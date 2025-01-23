var Latitude = document.getElementById("latitude").value;
var Longitude = document.getElementById("longitude").value;

var map = L.map("map", {
    center: [19.210095219278568, 73.15352289901084],
    zoom: 14, 
});
mapLink = '<a href="http://www.esri.com/">Esri</a>';
wholink = "SAFER";

L.tileLayer(
  "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/3/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: "&copy; " + wholink + ", " + mapLink,
    maxZoom: 18,
  }
).addTo(map);

L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png",
  {
    opacity: 1,
  }
).addTo(map);