# Smart Greenhouse & Weather Station

> Automate agriculture and plant care with real-time temperature, humidity, light, soil moisture tracking, and automated water pump relays.

---

## 🎯 What You'll Learn
- Interfacing capacitive soil moisture sensors to prevent corrosion
- Automating water pump irrigation with hysteresis thresholds
- Displaying multi-sensor metrics across alternating LCD screens

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| Arduino Uno / Nano | 1 | Main board |
| DHT11 or DHT22 | 1 | Air Temperature & Humidity |
| Soil Moisture Sensor | 1 | Capacitive moisture probe |
| 5V Relay + DC Submersible Water Pump | 1 each | Irrigation actuator |
| 16x2 I2C LCD Display | 1 | Visual display |
| Breadboard & Jumpers | 1 set | Connections |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `D5` | `DHT Data` | Air Temp & Humidity |
| `A0` | `Soil Moisture Analog` | Soil Volumetric Water Content |
| `D4` | `Relay Control Pin` | Water Pump Relay Switch |
| `A4 & A5` | `I2C LCD (SDA/SCL)` | Display screen |


---

## 📐 Circuit & Wiring Diagram

```text
+-----------------+              +-----------------------------+
    |   Arduino Uno   |              |  Smart Greenhouse System    |
    |                 |              |                             |
    |              D5 |<------------>| DHT11 (Air Temp & Hum)      |
    |              A0 |<-------------| Soil Moisture Probe         |
    |              D4 |------------->| 5V Relay ===> [ Water Pump] |
    |        A4 & A5  |<------------>| 16x2 I2C LCD Display        |
    +-----------------+              +-----------------------------+
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`greenhouse_monitor.ino`](./greenhouse_monitor.ino).

```cpp
/*
 * Project: Smart Greenhouse Climate & Soil Moisture Monitor
 * Description: Monitors air temp, humidity, and soil moisture to automatically
 *              trigger water pump irrigation and update an LCD screen.
 * Requires: DHT sensor library, LiquidCrystal_I2C
 * Part of: Arduino Projects Cookbook
 */

#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "DHT.h"

#define DHTPIN 5
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

LiquidCrystal_I2C lcd(0x27, 16, 2);

const int SOIL_PIN  = A0;
const int PUMP_PIN  = 4;

const int SOIL_DRY_THRESHOLD = 35; // Water when soil drops below 35%
const int PUMP_DURATION_MS   = 3000; // Run pump for 3 seconds

unsigned long lastWaterTime = 0;
const unsigned long WATER_COOLDOWN = 60000; // Minimum 1 minute between watering

void setup() {
  pinMode(PUMP_PIN, OUTPUT);
  digitalWrite(PUMP_PIN, HIGH); // Relay OFF (Active LOW)

  Serial.begin(9600);
  dht.begin();
  lcd.init();
  lcd.backlight();

  lcd.setCursor(0, 0);
  lcd.print(F("GREENHOUSE READY"));
  delay(1500);
  lcd.clear();
}

void loop() {
  float hum = dht.readHumidity();
  float temp = dht.readTemperature();
  int rawSoil = analogRead(SOIL_PIN);
  
  // Map raw analog reading (e.g. 1023 dry, 300 wet) to 0 - 100% moisture
  int soilPercent = map(constrain(rawSoil, 300, 1023), 1023, 300, 0, 100);

  // Update LCD Screen
  lcd.setCursor(0, 0);
  lcd.print(F("T:"));
  lcd.print((int)temp);
  lcd.print(F("C H:"));
  lcd.print((int)hum);
  lcd.print(F("% Soil:"));
  lcd.print(soilPercent);
  lcd.print(F("% "));

  lcd.setCursor(0, 1);
  if (digitalRead(PUMP_PIN) == LOW) {
    lcd.print(F("PUMP: WATERING! "));
  } else {
    lcd.print(F("PUMP: STANDBY   "));
  }

  // Automated Watering Logic
  if (soilPercent < SOIL_DRY_THRESHOLD && (millis() - lastWaterTime > WATER_COOLDOWN)) {
    Serial.println(F("Soil is dry! Triggering irrigation pump..."));
    digitalWrite(PUMP_PIN, LOW); // Turn pump ON
    delay(PUMP_DURATION_MS);
    digitalWrite(PUMP_PIN, HIGH); // Turn pump OFF
    lastWaterTime = millis();
  }

  delay(1000);
}
```

---

## ⚙️ How It Works (Under the Hood)

The greenhouse controller samples three critical agronomic factors: air temperature, relative vapor pressure (humidity), and soil volumetric water content. When soil moisture drops below the calibrated threshold, the controller checks whether the minimum cooldown window has elapsed before pulsing the relay to pump water directly to root systems.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Add an exhaust fan relay that turns on if air temperature exceeds 30°C.
1. Save historical hourly moisture levels to an onboard SD card.
1. Connect to Wi-Fi to send Push notifications when the water reservoir is empty.

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [05-Communication/WiFi](../../05-Communication/WiFi/)**: Stream real-time plant telemetry to a mobile dashboard.
- **Pair with [03-Actuators/Relays](../../03-Actuators/Relays/)**: Control 12V ventilation louvers and grow lights.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
