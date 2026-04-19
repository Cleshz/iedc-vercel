export let code = `

#include <WiFi.h>
#include <WebServer.h>
#include <TinyGPS++.h>

// WiFi credentials - use the laptop hotspot
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

#define RXD2 20
#define TXD2 21
#define GPS_BAUD 9600

TinyGPSPlus gps;
HardwareSerial gpsSerial(1);
WebServer server(80);

// HTML page (served to browser)
const char webpage[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ESP32 GPS Tracker</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

  <style>
    html, body {
      margin: 0;
      padding: 0;
    }
    #map {
      height: 100vh;
      width: 100vw;
    }
    #info {
      position: fixed;
      bottom: 10px;
      left: 10px;
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 10px;
      font-size: 14px;
      border-radius: 8px;
      font-family: monospace;
      z-index: 9999;          
      pointer-events: none;
}
  </style>
</head>
<body>

<div id="map"></div>
<div id="info">
  <b>GPS Info</b><br>
  Lat: <span id="lat">-</span><br>
  Lng: <span id="lng">-</span><br>
  Fix: <span id="fix">-</span><br>
  Satellites: <span id="sat">-</span><br>
  HDOP: <span id="hdop">-</span>
</div>

<script>
let map = null;
let marker = null;

async function getGPS() {
  try {
    const res = await fetch('/gps');
    const data = await res.json();

    // Update UI panel
    document.getElementById("lat").textContent = data.lat.toFixed(6);
    document.getElementById("lng").textContent = data.lng.toFixed(6);
    document.getElementById("fix").textContent = data.fix ? "YES" : "NO";
    document.getElementById("sat").textContent = data.sat;
    document.getElementById("hdop").textContent = data.hdop;

    if (data.lat !== 0 && data.lng !== 0) {
      if (!map) {
        map = L.map('map').setView([data.lat, data.lng], 18);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);

        marker = L.marker([data.lat, data.lng]).addTo(map);
      } else {
        marker.setLatLng([data.lat, data.lng]);
        map.setView([data.lat, data.lng]);
      }
    }
  } catch (e) {
    console.log("Fetch error:", e);
  }
}

setInterval(getGPS, 1000);
</script>

</body>
</html>
)rawliteral";

// Serve webpage
void handleRoot() {
  server.sendHeader("Content-Type", "text/html");
  server.sendHeader("Connection", "close");
  server.send_P(200, "text/html", webpage);
}

// Serve GPS data as JSON
void handleGPS() {
  String json = "{";

  if (gps.location.isValid()) {
    json += "\\"lat\\":" + String(gps.location.lat(), 6) + ",";
    json += "\\"lng\\":" + String(gps.location.lng(), 6) + ",";
  } else {
    json += "\\"lat\\":0,\\"lng\\":0,";
  }

  json += "\\"sat\\":" + String(gps.satellites.value()) + ",";
  json += "\\"fix\\":" + String(gps.location.isValid() ? 1 : 0) + ",";
  json += "\\"hdop\\":" + String(gps.hdop.hdop());

  json += "}";

  server.send(200, "application/json", json);
}

void setup() {
  Serial.begin(115200);

  gpsSerial.begin(GPS_BAUD, SERIAL_8N1, RXD2, TXD2);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\\nConnected!");
  Serial.println(WiFi.localIP());

  server.on("/", handleRoot);
  server.on("/gps", handleGPS);

  server.begin();
}

void loop() {
  while (gpsSerial.available()) {
    gps.encode(gpsSerial.read());
  }

  server.handleClient();
}

`