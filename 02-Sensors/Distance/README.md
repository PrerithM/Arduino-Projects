# Time-of-Flight Laser Distance (VL53L0X / VL53L1X)

> Measure precise millimeter distances regardless of target color or surface reflectivity using 940nm photon flight times.

---

## 🎯 What You'll Learn
- Time-of-Flight (ToF) vs Sonar vs IR triangulation advantages
- VCSEL (Vertical Cavity Surface Emitting Laser) technology
- I2C communication with high-speed distance ranging sensors

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| Arduino Uno / Nano | 1 | Main board |
| VL53L0X ToF Laser Distance Sensor | 1 | I2C Laser Ranging module (up to 2 meters) |
| Breadboard & Jumpers | 1 set | Connections |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `5V / 3.3V` | `VIN / VCC` | Power supply |
| `GND` | `GND` | Ground |
| `A4` | `SDA` | I2C Data |
| `A5` | `SCL` | I2C Clock |


---

## 📐 Circuit & Wiring Diagram

```text
+-----------------+              +----------------------+
    |   Arduino Uno   |              |  VL53L0X ToF Laser   |
    |                 |              |  (940nm VCSEL Laser) |
    |              5V |=============>| VIN                  |
    |             GND |=============>| GND                  |
    |        A4 (SDA) |<------------>| SDA                  |
    |        A5 (SCL) |------------->| SCL                  |
    +-----------------+              +----------------------+
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`tof_distance.ino`](./tof_distance.ino).

```cpp
/*
 * Module: VL53L0X Time-of-Flight (ToF) Laser Distance Sensor
 * Description: Emits invisible 940nm laser photons and measures picosecond
 *              flight durations to achieve millimeter precision ranging.
 * Requires: Adafruit_VL53L0X library (Arduino Library Manager)
 * Part of: Arduino Projects Cookbook
 */

#include <Wire.h>
#include "Adafruit_VL53L0X.h"

Adafruit_VL53L0X lox = Adafruit_VL53L0X();

void setup() {
  Serial.begin(115200);
  while (!Serial) delay(1); // Wait for Serial Monitor on Leonardo/ESP32

  Serial.println(F("Initializing VL53L0X Laser Ranging Sensor..."));
  if (!lox.begin()) {
    Serial.println(F("Failed to boot VL53L0X! Check wiring and pullups."));
    while (1);
  }
  Serial.println(F("VL53L0X Online and Ready."));
}

void loop() {
  VL53L0X_RangingMeasurementData_t measure;
  
  lox.rangingTest(&measure, false); // Pass 'true' for diagnostic debug prints

  if (measure.RangeStatus != 4) { // Phase failures = 4 (out of range)
    Serial.print(F("Laser Distance: "));
    Serial.print(measure.RangeMilliMeter);
    Serial.print(F(" mm ("));
    Serial.print(measure.RangeMilliMeter / 10.0, 1);
    Serial.println(F(" cm)"));
  } else {
    Serial.println(F("Laser target out of range (>2000mm)"));
  }

  delay(100);
}
```

---

## ⚙️ How It Works (Under the Hood)

Unlike ultrasonic sensors that can bounce off angled surfaces or IR sensors deceived by dark colors, ToF sensors emit photons of 940nm infrared laser light and use Single Photon Avalanche Diodes (SPADs) to time the flight of individual light particles returning at 300,000 km/s.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Configure long-range mode or high-accuracy mode (timing budget = 200ms) for sub-millimeter measurements.
1. Build a digital touchless gesture switch that detects hand hover heights.
1. Create a liquid level depth monitor for narrow pipes.

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [04-Displays/7-Segment](../../04-Displays/7-Segment/)**: Build a digital laser tape measure displaying millimeters in real-time.
- **Pair with [06-Automation/Security](../../06-Automation/Security/)**: High-precision laser trip perimeter monitors.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
