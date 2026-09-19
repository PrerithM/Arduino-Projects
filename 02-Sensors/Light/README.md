# Ambient Light Intensity (Photoresistor / LDR)

> Detect ambient daylight, room illumination, and laser tripwires with a Light Dependent Resistor (LDR).

---

## 🎯 What You'll Learn
- Photoconductive effect in Cadmium Sulfide (CdS) semiconductors
- Designing voltage divider networks: Vout = Vin * (R2 / (R1 + R2))
- Auto-calibrating light and dark thresholds dynamically in setup()

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| Arduino Uno / Nano | 1 | Main board |
| Photoresistor (LDR / CdS Cell) | 1 | 5mm photoresistor |
| 10kΩ Resistor | 1 | Fixed resistor for voltage divider |
| Breadboard & Jumpers | 1 set | Connections |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `5V` | `LDR Leg 1` | +5V Power rail |
| `A1` | `LDR Leg 2 & 10kΩ Resistor` | Voltage Divider Midpoint (Analog In) |
| `GND` | `10kΩ Resistor Leg 2` | Ground rail |


---

## 📐 Circuit & Wiring Diagram

```text
+-----------------+
    |   Arduino Uno   |
    |                 |
    |              5V |---------+
    |                 |         |
    |                 |     [ Photoresistor (LDR) ]
    |                 |         |
    |              A1 |---------+ (Midpoint)
    |                 |         |
    |                 |     [ 10kΩ Fixed Resistor ]
    |                 |         |
    |             GND |---------+
    +-----------------+
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`light_sensor.ino`](./light_sensor.ino).

```cpp
/*
 * Module: Ambient Light Sensing (LDR Voltage Divider)
 * Description: Calibrates ambient room light on startup and triggers
 *              automatic nightlight activation with hysteresis.
 * Part of: Arduino Projects Cookbook
 */

const int LDR_PIN = A1;
const int NIGHTLIGHT_PIN = 13;

int sensorMin = 1023;
int sensorMax = 0;

void setup() {
  pinMode(NIGHTLIGHT_PIN, OUTPUT);
  Serial.begin(9600);

  Serial.println(F("Calibrating LDR for 5 seconds... Cover and shine light!"));
  // 5-second calibration window
  while (millis() < 5000) {
    int val = analogRead(LDR_PIN);
    if (val < sensorMin) sensorMin = val;
    if (val > sensorMax) sensorMax = val;
  }

  Serial.print(F("Calibration Done. Min: "));
  Serial.print(sensorMin);
  Serial.print(F(" | Max: "));
  Serial.println(sensorMax);
}

void loop() {
  int rawValue = analogRead(LDR_PIN);
  
  // Constrain and map reading to 0 - 100% light intensity
  rawValue = constrain(rawValue, sensorMin, sensorMax);
  int lightPercent = map(rawValue, sensorMin, sensorMax, 0, 100);

  Serial.print(F("Light Level: "));
  Serial.print(lightPercent);
  Serial.println(F(" %"));

  // Nightlight threshold with hysteresis (turn on below 20%, turn off above 30%)
  if (lightPercent < 20) {
    digitalWrite(NIGHTLIGHT_PIN, HIGH);
  } else if (lightPercent > 30) {
    digitalWrite(NIGHTLIGHT_PIN, LOW);
  }

  delay(200);
}
```

---

## ⚙️ How It Works (Under the Hood)

As photons strike the Cadmium Sulfide semiconductor, electrons are excited across the bandgap, decreasing electrical resistance from ~1MΩ (in complete darkness) down to ~1kΩ (in bright sunlight). In a voltage divider, this resistance shift alters the voltage measured at pin A1 proportionally.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Build a dual-axis solar tracker using two LDRs and a servo motor.
1. Create a laser tripwire alarm that triggers when a laser beam focused on the LDR is broken.
1. Upgrade to a digital I2C ambient light sensor like the BH1750 (measures true Lux).

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [06-Automation/Smart-Lighting](../../06-Automation/Smart-Lighting/)**: Automatically control residential high-voltage lamps through relays as the sun sets.
- **Pair with [03-Actuators/LEDs](../../03-Actuators/LEDs/)**: Inversely dim an LED so it brightens as ambient room light drops.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
