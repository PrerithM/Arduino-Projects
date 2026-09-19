# Relative Humidity & Temperature (DHT11 / DHT22)

> Track ambient moisture and comfort index using digital capacitive humidity sensors.

---

## 🎯 What You'll Learn
- Capacitive relative humidity (%RH) sensing physics
- Decoding single-wire custom bi-directional digital pulse trains
- Calculating Heat Index (Feels Like temperature)

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| Arduino Uno / Nano | 1 | Main board |
| DHT11 or DHT22 (AM2302) Sensor | 1 | Digital Humidity & Temp module |
| 10kΩ Resistor | 1 | Pull-up resistor (if using bare sensor without PCB module) |
| Breadboard & Jumpers | 1 set | Connections |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `5V` | `VCC` | 5V Power |
| `GND` | `GND` | Ground |
| `D5` | `DATA` | Bi-directional digital data line |


---

## 📐 Circuit & Wiring Diagram

```text
+-----------------+              +----------------------+
    |   Arduino Uno   |              |  DHT11 / DHT22       |
    |                 |              |  [==== Humidity ====]|
    |              5V |=============>| VCC (Pin 1)          |
    |              D5 |<------------>| DATA (Pin 2)         |
    |             GND |=============>| GND (Pin 4)          |
    +-----------------+              +----------------------+
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`humidity.ino`](./humidity.ino).

```cpp
/*
 * Module: DHT11 / DHT22 Relative Humidity & Temperature
 * Description: Reads relative humidity (%RH) and ambient temperature,
 *              calculating the human Heat Index comfort score.
 * Requires: DHT sensor library by Adafruit
 * Part of: Arduino Projects Cookbook
 */

#include "DHT.h"

#define DHTPIN 5
#define DHTTYPE DHT11   // Set to DHT22 for higher accuracy AM2302

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
  Serial.println(F("DHT Environmental Sensor Active."));
}

void loop() {
  // Reading temperature or humidity takes about 250 milliseconds!
  float humidity = dht.readHumidity();
  float tempC = dht.readTemperature();
  float tempF = dht.readTemperature(true);

  if (isnan(humidity) || isnan(tempC) || isnan(tempF)) {
    Serial.println(F("Failed to read from DHT sensor! Check wiring."));
    delay(2000);
    return;
  }

  // Compute Heat Index in Fahrenheit and Celsius
  float hif = dht.computeHeatIndex(tempF, humidity);
  float hic = dht.computeHeatIndex(tempC, humidity, false);

  Serial.print(F("Humidity: "));
  Serial.print(humidity, 1);
  Serial.print(F(" %RH  |  Temp: "));
  Serial.print(tempC, 1);
  Serial.print(F(" °C  |  Heat Index: "));
  Serial.print(hic, 1);
  Serial.println(F(" °C"));

  delay(2000); // DHT11 minimum sampling interval is 1-2 seconds
}
```

---

## ⚙️ How It Works (Under the Hood)

The DHT uses a capacitive moisture sensor consisting of a moisture-holding dielectric substrate sandwiched between two electrodes. As humidity changes, the dielectric constant changes, shifting capacitance. An onboard 8-bit chip measures this capacitance, calibrates against stored ROM values, and outputs 40 bits of serial data.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Calculate dew point using the Magnus formula from temperature and relative humidity.
1. Trigger an automated dehumidifier relay if humidity exceeds 65% RH for more than 5 minutes.
1. Plot live humidity graphs in the Arduino IDE Serial Plotter.

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [06-Automation/Environment-Monitoring](../../06-Automation/Environment-Monitoring/)**: Combine with light and soil moisture for automated plant care systems.
- **Pair with [05-Communication/WiFi](../../05-Communication/WiFi/)**: Stream humidity telemetry to Adafruit IO or ThingSpeak IoT dashboards.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
