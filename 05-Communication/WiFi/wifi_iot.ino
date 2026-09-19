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
