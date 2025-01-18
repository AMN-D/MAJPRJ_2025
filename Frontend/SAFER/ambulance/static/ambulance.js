var map = L.map("map").setView([26.2006, 92.9376], 6);
wholink =
  "SAFER";
L.tileLayer(
  "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: "&copy;" + wholink,
    maxZoom: 18,
  }
).addTo(map);
