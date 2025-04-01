function downloadPDF() {
  const element = document.body; // Or use a specific element like document.getElementById('your-element-id')

  const opt = {
    margin: 0,
    filename: "downloaded-page.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 3, // Increase scale for better quality (higher value = better quality)
      useCORS: true, // Ensures cross-origin images are rendered properly
      logging: true, // Logs progress in the console
    },
    jsPDF: {
      unit: "px",
      format: [element.scrollWidth, element.scrollHeight],
      orientation: "portrait",
    },
  };

  html2pdf().from(element).set(opt).save();
}

document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("floodPredictionChart").getContext("2d");

  // Retrieve the predictions from the hidden input field
  const floodPredictions = JSON.parse(
    document.getElementById("floodPredictions").value
  );

  console.log("FloodPredictions: ", floodPredictions);

  const labels = Array.from({ length: 7 }, (_, i) => {
    let date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split("T")[0]; // Format YYYY-MM-DD
  });

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Flood Probability (%)",
          data: floodPredictions,
          borderColor: "rgba(30, 144, 255, 1)", // Dodger Blue
          backgroundColor: "rgba(30, 144, 255, 0.2)", // Light blue
          borderWidth: 2,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 20, // Space on the left
          right: 20, // Space on the right
          top: 20, // Space on top
          bottom: 20, // Space on the bottom
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: "Probability (%)",
            color: "#fff", // White for visibility on dark background
          },
          grid: {
            color: "#444", // Light gray grid for contrast
          },
        },
        x: {
          title: {
            display: true,
            text: "Date",
            color: "#fff", // White for visibility on dark background
          },
          grid: {
            color: "#444", // Light gray grid for contrast
          },
        },
      },
    },
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Get the hidden input values
  let predictions = document.getElementById("landslidePredictions").value;
  let dates = document.getElementById("landslideDates").value;

  // Log the data to verify it's already in the correct format
  console.log("Predictions: ", predictions);
  console.log("Dates: ", dates);

  // Convert string to array using eval (since data is already in array format)
  let predictionData = eval(predictions);
  let dateLabels = eval(dates);

  // Get the canvas element
  let ctx = document.getElementById("LandslideChart").getContext("2d");

  // Find the maximum value in the prediction data and increase it slightly for better appearance
  let maxPrediction = Math.max(...predictionData);
  let yMax = Math.ceil(maxPrediction * 1.2); // Increase by 20% for some breathing space

  // Create the chart using Chart.js
  new Chart(ctx, {
    type: "line",
    data: {
      labels: dateLabels, // Show the time (dates) on the x-axis
      datasets: [
        {
          label: "", // No label for the dataset
          data: predictionData, // Data for the graph
          borderColor: "#211f20", // Dark color for the line
          backgroundColor: "rgba(33, 31, 32, 0.2)", // Light shadow effect
          borderWidth: 2,
          fill: false, // No fill under the line
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 20,
          right: 20,
          top: 25,
          bottom: 20,
        },
      },
      scales: {
        x: {
          title: {
            display: false, // Hide the label for the x-axis
          },
          ticks: {
            font: {
              size: 8, // Reduced font size for the x-axis ticks
            },
            maxRotation: 0, // Ensure the x-axis labels are straight (no rotation)
            minRotation: 0, // No rotation of labels
          },
        },
        y: {
          title: {
            display: false,
            text: "Prediction Level", // Keep the y-axis label
            font: {
              size: 10, // Reduced font size for the y-axis label
            },
          },
          beginAtZero: true,
          max: yMax, // Set the maximum value to a bit higher than the max prediction value
        },
      },
      plugins: {
        legend: {
          display: false, // Hide the legend
        },
      },
    },
  });
});

// Fetch data from the hidden input fields
const floodPredictions = JSON.parse(
  document.getElementById("floodPredictions").value
);
const landslidePredictions = JSON.parse(
  document.getElementById("landslidePredictions").value
);
const landslideDates = document
  .getElementById("landslideDates")
  .value.split(","); // Assuming the dates are comma-separated strings

// Create the daily labels for Flood Predictions
const floodLabels = [];
const currentDate = new Date();
for (let i = 0; i < 7; i++) {
  let date = new Date(currentDate);
  date.setDate(date.getDate() + i);
  floodLabels.push(date.toISOString().split("T")[0]); // Format to YYYY-MM-DD
}

// Create the hourly labels for Landslide Predictions
const landslideLabels = [];
for (let i = 0; i < landslideDates.length; i++) {
  landslideLabels.push(`${landslideDates[i]} ${i % 24}:00`); // Adding hour markers
}

// Prepare chart data
const chartData = {
  labels: floodLabels, // Use the flood dates for the X axis (7 days)
  datasets: [
    {
      label: "Flood Predictions",
      data: floodPredictions, // Flood data for the Y axis
      borderColor: "#0736fe", // Blue color for the flood line
      backgroundColor: "rgba(7, 54, 254, 0.4)", // Darker blue for flood area fill
      fill: true, // Fill the area below the line
      tension: 0.4, // Slight curve for the line
      borderWidth: 3, // Thicker border for better visibility
    },
    {
      label: "Landslide Predictions",
      data: landslidePredictions, // Landslide data for the Y axis
      borderColor: "#ff6347", // Tomato red for the landslide line
      backgroundColor: "rgba(255, 99, 71, 0.4)", // Light red for landslide area fill
      fill: true, // Fill the area below the line
      tension: 0.4, // Slight curve for the line
      borderWidth: 3, // Thicker border for better visibility
    },
  ],
};

// Chart configuration
const config = {
  type: "line", // Use a line chart (which will have area filled)
  data: chartData,
  options: {
    responsive: true, // Make the chart responsive
    maintainAspectRatio: false, // Allow the chart to fill the div
    layout: {
      padding: {
        top: 20, // Add space at the top
        left: 30, // Add space on the left
        right: 30, // Add space on the right
        bottom: 20, // Add space at the bottom
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Dates / Hours",
        },
        ticks: {
          autoSkip: true, // Automatically skip some labels if needed
        },
      },
      y: {
        title: {
          display: true,
          text: "Predictions",
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
    },
  },
};

// Render the chart
const ctx = document.getElementById("LandslideFloodChart").getContext("2d");
new Chart(ctx, config);
