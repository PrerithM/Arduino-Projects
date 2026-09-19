# Precision Temperature Sensing (DS18B20 & Thermistor)

> Measure Celsius and Fahrenheit temperatures with high accuracy over 1-Wire digital bus or NTC analog curves.

---

## 🎯 What You'll Learn
- 1-Wire protocol communication architecture
- Reading Dallas DS18B20 digital temperature sensors with 12-bit resolution (0.0625°C)
- Steinhart-Hart equation for analog NTC thermistor calibration

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| Arduino Uno / Nano | 1 | Main board |
| DS18B20 Temperature Sensor (or NTC 10k) | 1 | Digital 1-Wire sensor (TO-92 or waterproof probe) |
| 4.7kΩ Resistor | 1 | Pull-up resistor for 1-Wire data bus |
| Breadboard & Jumpers | 1 set | Connections |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `5V` | `VDD (Red)` | +5V Power |
| `GND` | `GND (Black)` | Ground reference |
| `D4` | `DQ (Yellow/White)` | 1-Wire Data with 4.7kΩ pullup to 5V |


---

## 📐 Circuit & Wiring Diagram

```text
+-----------------+
    |   Arduino Uno   |
    |                 |
    |              5V |---------+-------------+ (DS18B20 VDD)
    |                 |         |             |
    |                 |      [ 4.7kΩ ]        |
    |                 |         |             |
    |              D4 |---------+-------------+ (DS18B20 DQ Data)
    |                 |                       |
    |             GND |-----------------------+ (DS18B20 GND)
    +-----------------+
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`temperature.ino`](./temperature.ino).

```cpp
/*
 * Module: DS18B20 1-Wire Digital Temperature Sensor
 * Description: Reads digital temperatures with 12-bit resolution.
 * Requires: OneWire and DallasTemperature libraries (Arduino Library Manager)
 * Part of: Arduino Projects Cookbook
 */

#include <OneWire.h>
#include <DallasTemperature.h>

const int ONE_WIRE_BUS = 4;

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setup() {
  Serial.begin(9600);
  sensors.begin();
  Serial.println(F("DS18B20 1-Wire Sensor Initialized."));
  Serial.print(F("Sensors found: "));
  Serial.println(sensors.getDeviceCount());
}

void loop() {
  sensors.requestTemperatures(); // Issue global temperature conversion command

  float tempC = sensors.getTempCByIndex(0);
  float tempF = DallasTemperature::toFahrenheit(tempC);

  if (tempC != DEVICE_DISCONNECTED_C) {
    Serial.print(F("Temperature: "));
    Serial.print(tempC, 2);
    Serial.print(F(" °C  |  "));
    Serial.print(tempF, 2);
    Serial.println(F(" °F"));
  } else {
    Serial.println(F("Error: DS18B20 disconnected!"));
  }

  delay(1000);
}
```

---

## ⚙️ How It Works (Under the Hood)

1-Wire allows dozens of sensors to share a single digital pin. Each DS18B20 has a factory-lasered unique 64-bit ROM code. Inside the sensor, an onboard bandgap temperature reference and sigma-delta ADC convert temperature directly into digital words without analog noise corruption.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Connect 3 DS18B20 sensors on the same D4 pin and address them individually by their unique 64-bit addresses.
1. Implement an over-temperature cooling fan trigger with hysteresis (e.g. Turn ON at 30°C, Turn OFF at 27°C).
1. Log temperatures to an SD card or EEPROM memory every hour.

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [04-Displays/LCD](../../04-Displays/LCD/)**: Display current, min, and max temperatures on a 16x2 screen.
- **Pair with [03-Actuators/Relays](../../03-Actuators/Relays/)**: Build a home brewing or greenhouse climate thermostat.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
