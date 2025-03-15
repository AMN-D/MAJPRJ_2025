let latitude, longitude, userLocationMarker, map;

function userLocation() {
  function success(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    initializeMap(latitude, longitude);
    userLocationMarker = L.marker([latitude, longitude]).addTo(map);
    userLocationMarker.bindPopup("<b>Your Location</b>").openPopup();
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
    circle
      .bindPopup("<b>Please allow location</b><br>for improve accuracy")
      .openPopup();
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
    zoom: 18,
    attributionControl: false,
  });
  wholink = "SAFER";

  L.tileLayer("http://{s}.google.com/vt?lyrs=s,h&x={x}&y={y}&z={z}", {
    maxZoom: 18,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }).addTo(map);

  // L.tileLayer(
  //   "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png",
  //   {
  //     opacity: 1,
  //   }
  // ).addTo(map);
}

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
