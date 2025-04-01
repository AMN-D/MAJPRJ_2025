from django.core.cache import cache
from django.http import HttpResponse
from django.shortcuts import render
from quick_first_aid.models import Symptom, QuickFirstAid
import os
import pickle
import numpy as np
import pandas as pd
import datetime
from datetime import datetime, timedelta
from django.conf import settings
import matplotlib.pyplot as plt
import seaborn as sns
from django.shortcuts import render
from django.http import JsonResponse
from tensorflow.keras.models import load_model
from sklearn.preprocessing import MinMaxScaler
from django.views.decorators.csrf import csrf_exempt
from io import BytesIO
import base64

MODEL_PATH = os.path.join(settings.BASE_DIR, 'models', 'flood_lstm_model.pkl')
with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

CSV_FILE = os.path.join(settings.BASE_DIR, 'datasets', 'Flood_final.csv')
df = pd.read_csv(CSV_FILE)

print("Model path:", MODEL_PATH)
print("CSV path:", CSV_FILE)

if "flood_probability" not in df.columns:
    threshold_discharge = df["river_discharge"].quantile(0.75)
    threshold_rainfall = df["rain_sum"].quantile(0.9)
    df["flood_probability"] = ((df["river_discharge"] > threshold_discharge) & 
                                (df["rain_sum"] > threshold_rainfall)).astype(int)

def predict_next_7_days(model, recent_data, features, seq_length=7):
    predictions = []
    input_seq = recent_data[features].values.reshape(1, seq_length, len(features))

    for _ in range(7):
        next_day_pred = float(model.predict(input_seq)[0, 0])
        predictions.append(next_day_pred)
        
        next_day_features = input_seq[:, -1, :].copy()
        next_day_features[-1] = next_day_pred
        input_seq = np.roll(input_seq, shift=-1, axis=1)
        input_seq[:, -1, :] = next_day_features

    return predictions

def predict_landslide(lat, lon):
    if not lat or not lon:
        return {"error": "Latitude and Longitude are required"}
    
    try:
        lat = float(lat)
        lon = float(lon)
    except ValueError:
        return {"error": "Invalid latitude or longitude values."}
    
    # Load the trained model
    model_path = os.path.join(settings.BASE_DIR, "models", "landslide_model.pkl")
    with open(model_path, "rb") as f:
        model = pickle.load(f)
    
    # Define feature names
    features = ["temperature_2m", "precipitation", "soil_moisture_7_to_28cm",
                "soil_moisture_100_to_255cm", "wind_speed_100m", "surface_pressure",
                "cloud_cover", "latitude", "longitude"]
    
    # Load dataset
    csv_file = os.path.join(settings.BASE_DIR, "datasets", "Northeast__Landslide_Merged.csv")
    df = pd.read_csv(csv_file)
    df["date"] = pd.to_datetime(df["date"])
    
    # Find closest data points
    df["distance"] = np.sqrt((df["latitude"] - lat) ** 2 + (df["longitude"] - lon) ** 2)
    closest_df = df.nsmallest(24, "distance")
    
    if len(closest_df) < 24:
        return {"error": "Not enough historical data available for this location."}
    
    # Prepare input features
    input_data = closest_df[features].values.reshape(1, 24, len(features))
    
    # Normalize features
    scaler = MinMaxScaler()
    input_data = scaler.fit_transform(input_data.reshape(-1, len(features))).reshape(1, 24, len(features))
    
    # Predict for the next 24 hours
    predictions = []
    for _ in range(24):
        pred = model.predict(input_data)[0, 0]
        predictions.append(pred)
        
        # Shift sequence
        next_hour_features = input_data[:, -1, :].copy()
        next_hour_features[-1] = pred
        input_data = np.roll(input_data, shift=-1, axis=1)
        input_data[:, -1, :] = next_hour_features
    
    # Generate timestamps
    future_dates = [datetime.now() + timedelta(hours=i) for i in range(1, 25)]
    result = [{"datetime": dt.strftime('%Y-%m-%d %H:%M'), "probability": pred} for dt, pred in zip(future_dates, predictions)]	
    print({"predictions": result, "latitude": lat, "longitude": lon})    

    return {"predictions": result, "latitude": lat, "longitude": lon}

@csrf_exempt
def home(request):
    latitude = 27.8987
    longitude = 93.3951

    # Landslide Prediction (Cached)
    last_landslide_run_time = cache.get("last_landslide_run_time")
    last_landslide_prediction = cache.get("last_landslide_prediction")

    if not last_landslide_run_time or (datetime.now() - last_landslide_run_time) > timedelta(hours=24):
        data = predict_landslide(latitude, longitude)
        first_landslide_prediction = data['predictions'][0]['probability']
        landslide_prediction_percentage = round(first_landslide_prediction * 100, 2)

        cache.set("last_landslide_run_time", datetime.now(), timeout=86400)  
        cache.set("last_landslide_prediction", landslide_prediction_percentage, timeout=86400)
    else:
        landslide_prediction_percentage = last_landslide_prediction  

    # Get location data
    location_data = df[(df["latitude"].round(6) == round(latitude, 6)) & 
                       (df["longitude"].round(6) == round(longitude, 6))]

    if location_data.empty:
        return render(request, 'home.html', {
            "first_prediction": "No data available",
            "first_landslide_prediction": landslide_prediction_percentage
        })

    features = ["temperature_2m_mean", "rain_sum", "snowfall_sum", "wind_speed_10m_max", 
                "precipitation_sum", "temperature_2m_min", "temperature_2m_max", 
                "river_discharge", "latitude", "longitude"]

    scaler = MinMaxScaler()
    location_data[features] = scaler.fit_transform(location_data[features])

    last_occurrence_index = location_data[location_data["flood_probability"] == 1].index.max()
    if pd.isna(last_occurrence_index):
        return render(request, 'home.html', {
            "first_prediction": "No previous flood occurrences",
            "first_landslide_prediction": landslide_prediction_percentage
        })

    recent_data = location_data.loc[last_occurrence_index-6:last_occurrence_index]

    # Flood Prediction (Cached)
    last_flood_run_time = cache.get("last_flood_run_time")
    last_flood_prediction = cache.get("last_flood_prediction")

    if not last_flood_run_time or (datetime.now() - last_flood_run_time) > timedelta(hours=24):
        predictions = predict_next_7_days(model, recent_data, features)
        first_prediction = round(predictions[0] * 100, 2)  

        cache.set("last_flood_run_time", datetime.now(), timeout=86400)  
        cache.set("last_flood_prediction", first_prediction, timeout=86400)
    else:
        first_prediction = last_flood_prediction  

    return render(request, 'home.html', {
        "first_prediction": first_prediction,
        "first_landslide_prediction": landslide_prediction_percentage
    })

def vcm(request):
    return render(request, 'vcm.html')

def disaster_assessment(request):
    return render(request, 'NorthEast.html')

def quick_first_aid(request):
    symptoms = Symptom.objects.all()
    diseases = None

    if request.method == "POST":
        selected_symptom_ids = request.POST.getlist('symptom')
        if selected_symptom_ids:
            diseases = QuickFirstAid.objects.filter(symptoms__id__in=selected_symptom_ids).distinct()[:3]

    return render(request, 'quick_first_aid.html', {'symptoms': symptoms, 'diseases': diseases})

def ambulance(request):
    import geocoder
    g = geocoder.ip('me')
    return render(request, 'ambulance.html', {"latitude": g.lat or 0, "longitude": g.lng or 0})


