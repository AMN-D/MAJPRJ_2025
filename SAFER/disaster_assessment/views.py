from django.shortcuts import render
# This should be fine to add right ?
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
from home.models import LandslidePrediction
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

# Create your views here.
@csrf_exempt
def report_generator(request):
    latitude = 27.8987
    longitude = 93.3951

    location_data = df[(df["latitude"].round(6) == round(latitude, 6)) & 
                       (df["longitude"].round(6) == round(longitude, 6))]

    if location_data.empty:
        return render(request, 'home.html', {"first_prediction": "No data available"})


    is_flood_occurring = location_data.iloc[-1]["flood_probability"] >= 0.95
    current_flood_status = "Warning: A flood is currently occurring in your region!" if is_flood_occurring else "No floods are currently occurring in your region."

    features = ["temperature_2m_mean", "rain_sum", "snowfall_sum", "wind_speed_10m_max", 
                "precipitation_sum", "temperature_2m_min", "temperature_2m_max", 
                "river_discharge", "latitude", "longitude"]

    scaler = MinMaxScaler()
    location_data[features] = scaler.fit_transform(location_data[features])

    last_occurrence_index = location_data[location_data["flood_probability"] == 1].index.max()
    if pd.isna(last_occurrence_index):
        return render(request, 'home.html', {"first_prediction": "No previous flood occurrences"})

    recent_data = location_data.loc[last_occurrence_index-6:last_occurrence_index]
    
    # Get predictions for next 7 days
    current_date = datetime.now().strftime('%Y/%m/%d #%H:%M')
    predictions = predict_next_7_days(model, recent_data, features)

    # Extract the first prediction
    first_prediction = round(predictions[0] * 100, 2)  
    scaled_predictions = [round(pred * 100, 2) for pred in predictions]

    max_probability = max(scaled_predictions)  # Highest prediction
    max_index = scaled_predictions.index(max_probability)  # Find its position
    
    # Calculate the date for the highest probability
    future_date = (datetime.now() + timedelta(days=max_index)).strftime('%Y-%m-%d')

    landslide_data = LandslidePrediction.objects.order_by('datetime')

    landslide_predictions = [round(lp.probability * 100, 2) for lp in landslide_data]  # Convert to percentage
    landslide_dates = [lp.datetime.strftime('%Y-%m-%d') for lp in landslide_data]  # Format timestamps

    latest_prediction = LandslidePrediction.objects.order_by('-datetime').first()
    landslide_risk = "No Data"

    if latest_prediction:
        landslide_risk = f"{round(latest_prediction.probability * 100, 2)}%"  # Convert to percentage
    
    context = {
        "predictions": scaled_predictions,  
        "first_prediction": scaled_predictions[0],  
        "highest_probability": max_probability,
        "highest_probability_date": future_date,
        "current_flood_status": current_flood_status,
        "current_date": current_date,
        "landslide_risk": landslide_risk,
        "landslide_predictions": landslide_predictions,
        "landslide_dates": landslide_dates,
    }

    return render(request, 'report.html', context)
