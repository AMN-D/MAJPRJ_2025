let latitude, longitude, userLocationMarker, map;
let trackedUserMarkers = {}; // Store markers for tracked users

function userLocation() {
  function success(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    initializeMap(latitude, longitude);
    userLocationMarker = L.marker([latitude, longitude]).addTo(map);
    userLocationMarker.bindPopup("<b>Your Location</b>").openPopup();
    fetchTrackedLocations(); // Fetch tracked locations after loading the map
  }

  function error() {
    latitude = document.getElementById("latitude").value;
    longitude = document.getElementById("longitude").value;
    initializeMap(latitude, longitude);
    var circle = L.circle([latitude, longitude], {
      color: "blue",
      fillColor: "#ADD8E6",
      fillOpacity: 0.2,
      radius: 500,
    }).addTo(map);
    circle.bindPopup("<b>Please allow location</b><br>for improved accuracy").openPopup();
    fetchTrackedLocations(); // Fetch tracked locations even if location isn't allowed
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

function initializeMap(latitude, longitude) {
  map = L.map("map", {
    center: [latitude, longitude],
    zoom: 15,
    attributionControl: false,
  });

  L.tileLayer("http://{s}.google.com/vt?lyrs=s,h&x={x}&y={y}&z={z}", {
    maxZoom: 18,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }).addTo(map);
}

// Function to fetch and update tracked user locations
function fetchTrackedLocations() {
  fetch("/ambulance/receive-location/", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success" && data.locations) {
        updateTrackedUserMarkers(data.locations);
      }
    })
    .catch((error) => console.error("❌ Error fetching tracked locations:", error));
}

// Function to update tracked users' markers on the map
function updateTrackedUserMarkers(locations) {
  // Remove old markers first
  for (let ip in trackedUserMarkers) {
    if (!locations[ip]) {
      map.removeLayer(trackedUserMarkers[ip]);
      delete trackedUserMarkers[ip];
    }
  }

  // Add new markers
  for (let ip in locations) {
    let { latitude, longitude } = locations[ip];

    if (trackedUserMarkers[ip]) {
      // Update existing marker position
      trackedUserMarkers[ip].setLatLng([latitude, longitude]);
    } else {
      // Create a new marker
      let marker = L.marker([latitude, longitude], { icon: userIcon }).addTo(map);
      marker.bindPopup(`<b>Tracked User</b><br>IP: ${ip}`).openPopup();
      trackedUserMarkers[ip] = marker;
    }
  }
}

// Custom icon for tracked users
let userIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Example marker icon
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Fetch tracked locations every 10 seconds
setInterval(fetchTrackedLocations, 10000);

// Initialize map and location tracking
window.addEventListener("load", userLocation);

function getCSRFToken() {
  return document.querySelector("[name=csrfmiddlewaretoken]").value; // Get CSRF token
}

function callAmbulance() {
  let latitude = document.getElementById("latitude").value;
  let longitude = document.getElementById("longitude").value;
  let csrfToken = getCSRFToken();

  fetch("/ambulance/send_sms/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-CSRFToken": csrfToken, // CSRF token for security
    },
    body: `latitude=${latitude}&longitude=${longitude}`,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        alert(
          "SMS sent successfully! Help is on the way. Stay safe, and use our Quick Aid feature in case of an emergency."
        );
      } else {
        alert("Error sending SMS. Please try again.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Something went wrong! Please try again.");
    });
}