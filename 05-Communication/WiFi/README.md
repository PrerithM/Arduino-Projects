# Wi-Fi & IoT Cloud Telemetry (ESP8266 / ESP32)

> Connect your hardware to the local Wi-Fi network to stream live telemetry to IoT cloud dashboards and receive webhook commands.

---

## 🎯 What You'll Learn
- Connecting to WPA2 Wi-Fi networks with DHCP IP assignment
- Issuing HTTP GET and POST requests to REST APIs
- Building lightweight embedded HTTP web servers

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| ESP8266 (NodeMCU/D1 Mini) or ESP32 or Uno+ESP-01 | 1 | Wi-Fi enabled microcontroller board |
| Micro-USB Cable | 1 | Power and programming cable |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `Onboard` | `Wi-Fi Radio (2.4GHz 802.11 b/g/n)` | Wireless internet link |
| `D4 / LED_BUILTIN` | `Status LED` | Connection status indicator |


---

## 📐 Circuit & Wiring Diagram

```text
+-------------------------+        2.4GHz Wi-Fi       +--------------------+
    | ESP8266 / ESP32 Board   | - - - - - - - - - - - - ->| Wi-Fi Router / AP  |
    |                         |                           | (Internet Gateway) |
    |  [ ESP-12F Wi-Fi SoC ]  |                           +---------+----------+
    |                         |                                     |
    |  Onboard Microcontroller|                               +-----v----------+
    +-------------------------+                               | Cloud Dashboard|
                                                              | (Thingspeak)   |
                                                              +----------------+
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`wifi_iot.ino`](./wifi_iot.ino).

```cpp
/*
 * Module: Wi-Fi IoT Client & Embedded Web Server
 * Description: Connects to a 2.4GHz Wi-Fi access point and serves an
 *              interactive HTML webpage for remote appliance control.
 * Targets: ESP8266 (NodeMCU / D1 Mini) or ESP32
 * Part of: Arduino Projects Cookbook
 */

#if defined(ESP8266)
  #include <ESP8266WiFi.h>
  #include <ESP8266WebServer.h>
  ESP8266WebServer server(80);
#elif defined(ESP32)
  #include <WiFi.h>
  #include <WebServer.h>
  WebServer server(80);
#endif

const char* ssid     = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

const int RELAY_PIN = 4; // GPIO4 (D2 on NodeMCU)
bool relayState = false;

void handleRoot() {
  String html = "<!DOCTYPE html><html><head><meta name='viewport' content='width=device-width, initial-scale=1'>";
  html += "<style>body{font-family:sans-serif;text-align:center;padding:20px;background:#111;color:#fff;}";
  html += ".btn{display:inline-block;padding:15px 30px;font-size:18px;border-radius:8px;text-decoration:none;color:#fff;background:#00979D;margin:10px;}";
  html += ".off{background:#555;}</style></head><body>";
  html += "<h1>⚡ Arduino IoT Server</h1>";
  html += "<p>Relay Status: <b>" + String(relayState ? "ACTIVE (ON)" : "INACTIVE (OFF)") + "</b></p>";
  html += "<a class='btn " + String(relayState ? "" : "off") + "' href='/toggle'>Toggle Switch</a>";
  html += "</body></html>";

  server.send(200, "text/html", html);
}

void handleToggle() {
  relayState = !relayState;
  digitalWrite(RELAY_PIN, relayState ? HIGH : LOW);
  server.sendHeader("Location", "/");
  server.send(303);
}

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  Serial.begin(115200);
  Serial.println();
  Serial.print(F("Connecting to Wi-Fi: "));
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(F("."));
  }

  Serial.println();
  Serial.println(F("WiFi Connected!"));
  Serial.print(F("Open this IP address in your browser: http://"));
  Serial.println(WiFi.localIP());

  server.on("/", handleRoot);
  server.on("/toggle", handleToggle);
  server.begin();
}

void loop() {
  server.handleClient();
}
```

---

## ⚙️ How It Works (Under the Hood)

The ESP8266/ESP32 integrates a full TCP/IP networking stack alongside a Tensilica 32-bit Xtensa core. When you type the device IP into any web browser on the local network, an HTTP GET request arrives over TCP port 80; the embedded web server parses the route and sends back full HTML/CSS markup dynamically.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Publish sensor telemetry every 60 seconds to an MQTT broker like HiveMQ or Home Assistant.
1. Fetch the current real-world time and weather forecast from an OpenWeatherMap JSON API.
1. Enable Over-The-Air (OTA) firmware updates so you never have to plug in a USB cable again.

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [06-Automation/Environment-Monitoring](../../06-Automation/Environment-Monitoring/)**: Build an IoT greenhouse station streaming soil moisture and temperature worldwide.
- **Pair with [06-Automation/Smart-Lighting](../../06-Automation/Smart-Lighting/)**: Smart home voice assistant integration via webhooks.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
