import streamlit as st
import pandas as pd
import numpy as np
import pickle
import tensorflow as tf
from tensorflow.keras.models import load_model
from sklearn.preprocessing import MinMaxScaler
import datetime
import matplotlib.pyplot as plt
import seaborn as sns

# Load the trained model
with open(r"lstm_model.pkl", "rb") as f:
    model = pickle.load(f)

# Load historical data
csv_file = r"Flood_final.csv"  # Ensure this file exists in the working directory
df = pd.read_csv(csv_file)

# Restore flood_probability column if missing
if "flood_probability" not in df.columns:
    threshold_discharge = df["river_discharge"].quantile(0.75)
    threshold_rainfall = df["rain_sum"].quantile(0.9)
    df["flood_probability"] = ((df["river_discharge"] > threshold_discharge) &
                                (df["rain_sum"] > threshold_rainfall)).astype(int)
    print("✅ flood_probability column restored!")

# Streamlit UI - Enhanced with Styling
st.set_page_config(page_title="Flood Prediction Dashboard", layout="wide")
st.markdown("""
    <style>
        body {background-color: #f0f2f6;}
        .stTitle {color: #2c3e50; text-align: center;}
        .stSidebar {background-color: #ecf0f1;}
    </style>
    """, unsafe_allow_html=True)

st.title("🌊 Flood Prediction for the Next 7 Days")

# User Input
st.sidebar.header("🌍 Enter Location Details")
latitude = st.sidebar.number_input("Enter Latitude:", format="%.6f")
longitude = st.sidebar.number_input("Enter Longitude:", format="%.6f")

# Filter data for the given location
location_data = df[(df["latitude"].round(6) == round(latitude, 6)) & 
                   (df["longitude"].round(6) == round(longitude, 6))]

if location_data.empty:
    st.error("❌ No matching data for the entered location. Please try another location.")
    st.stop()

st.subheader("📌 Location Data Preview")
st.dataframe(location_data.tail(7), use_container_width=True)

# Select relevant columns
features = ["temperature_2m_mean", "rain_sum", "snowfall_sum", "wind_speed_10m_max", 
            "precipitation_sum", "temperature_2m_min", "temperature_2m_max", 
            "river_discharge", "latitude", "longitude"]

scaler = MinMaxScaler()
location_data[features] = scaler.fit_transform(location_data[features])

# Find last occurrence of flood event (1 in flood_probability column)
last_occurrence_index = location_data[location_data["flood_probability"] == 1].index.max()
if pd.isna(last_occurrence_index):
    st.error("No previous flood occurrence found for this location.")
    st.stop()

recent_data = location_data.loc[last_occurrence_index-6:last_occurrence_index]

def predict_next_7_days(model, recent_data, features, seq_length=7):
    """
    Predicts flood probability for the next 7 days using the trained model.
    """
    predictions = []
    input_seq = recent_data[features].values.reshape(1, seq_length, len(features))

    for _ in range(7):
        next_day_pred = float(model.predict(input_seq)[0, 0])  # Ensure valid number
        predictions.append(next_day_pred)
        
        next_day_features = input_seq[:, -1, :].copy()
        next_day_features[-1] = next_day_pred
        input_seq = np.roll(input_seq, shift=-1, axis=1)
        input_seq[:, -1, :] = next_day_features
    
    return predictions

# Predict next 7 days
predictions = predict_next_7_days(model, recent_data, features)

# Generate future dates
future_dates = [datetime.date.today() + datetime.timedelta(days=i) for i in range(1, 8)]
prediction_df = pd.DataFrame({"Date": future_dates, "Flood Probability": predictions})

# Display Results
st.subheader("Predicted Flood Probability for the Next 7 Days")
st.write(prediction_df)
st.line_chart(prediction_df.set_index("Date"))

# Generate Report
st.subheader("🚨 Flood Risk Report")
if max(predictions) > 0.5:
    st.error("⚠ High flood risk detected in the next 7 days. Take necessary precautions!")
else:
    st.success("✅ Low flood risk detected. No immediate concerns.")

# Visualization Report
st.subheader("📈 Flood Risk Analysis")
fig, ax = plt.subplots(figsize=(10, 5))
sns.lineplot(x=prediction_df["Date"], y=prediction_df["Flood Probability"], marker="o", ax=ax, linewidth=2.5, color="#3498db")
ax.axhline(y=0.5, color="r", linestyle="--", label="High Risk Threshold")
plt.xticks(rotation=45)
plt.title("Flood Probability Over the Next 7 Days", fontsize=14, fontweight="bold")
plt.xlabel("Date", fontsize=12)
plt.ylabel("Flood Probability", fontsize=12)
plt.legend()
st.pyplot(fig)