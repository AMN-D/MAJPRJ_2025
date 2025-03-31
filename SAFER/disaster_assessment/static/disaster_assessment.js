function downloadPDF() {
  const element = document.body; // Or use a specific element like document.getElementById('your-element-id')

  const opt = {
    margin:       0,
    filename:     'downloaded-page.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { 
      scale: 3, // Increase scale for better quality (higher value = better quality)
      useCORS: true, // Ensures cross-origin images are rendered properly
      logging: true, // Logs progress in the console
    },
    jsPDF:        { unit: 'px', format: [element.scrollWidth, element.scrollHeight], orientation: 'portrait' }
  };

  html2pdf().from(element).set(opt).save();
}


document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("floodPredictionChart").getContext("2d");

  // Retrieve the predictions from the hidden input field
  const floodPredictions = JSON.parse(document.getElementById("floodPredictions").value);

  const labels = Array.from({ length: 7 }, (_, i) => {
      let date = new Date();
      date.setDate(date.getDate() + i);
      return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
  });

  new Chart(ctx, {
    type: "line",
    data: {
        labels: labels,
        datasets: [
            {
                label: "Flood Probability (%)",
                data: floodPredictions,
                borderColor: "rgba(30, 144, 255, 1)",  // Dodger Blue
                backgroundColor: "rgba(30, 144, 255, 0.2)",  // Light blue
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
                left: 20,  // Space on the left
                right: 20, // Space on the right
                top: 20,   // Space on top
                bottom: 20, // Space on the bottom
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: {
                    display: true,
                    text: "Probability (%)",
                    color: "#fff",  // White for visibility on dark background
                },
                grid: {
                    color: "#444",  // Light gray grid for contrast
                },
            },
            x: {
                title: {
                    display: true,
                    text: "Date",
                    color: "#fff",  // White for visibility on dark background
                },
                grid: {
                    color: "#444",  // Light gray grid for contrast
                },
            },
        },
    },
});

});
