# Analog Input / Output (Potentiometer & Voltage Mapping)

> Read continuous real-world voltage levels using the 10-bit Analog-to-Digital Converter (ADC) and convert raw values to volts and percentage.

---

## 🎯 What You'll Learn
- Understanding 10-bit ADC resolution (0 - 1023 corresponds to 0V - 5V)
- Scaling analog readings with map() and float calculations
- Mitigating ADC noise with software rolling-average smoothing

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| Arduino Uno / Nano | 1 | Main board |
| Potentiometer (10kΩ) | 1 | Rotary linear potentiometer |
| Breadboard & Jumper Wires | 1 set | Connections |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `5V` | `Potentiometer Pin 1 (Outer)` | +5V Power rail |
| `A0` | `Potentiometer Pin 2 (Wiper)` | Analog Voltage Input |
| `GND` | `Potentiometer Pin 3 (Outer)` | Ground rail |


---

## 📐 Circuit & Wiring Diagram

```text
+-----------------+
    |   Arduino Uno   |
    |                 |
    |              5V |---------+ (Outer Leg 1)
    |                 |         |
    |              A0 |-------[ 10kΩ Potentiometer (Wiper) ]
    |                 |         |
    |             GND |---------+ (Outer Leg 3)
    +-----------------+
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`analog_io.ino`](./analog_io.ino).

```cpp
/*
 * Module: Analog I/O & Continuous Voltage Measurement
 * Description: Reads a 10k potentiometer via ADC pin A0 with a 10-sample
 *              moving average filter to eliminate electrical noise.
 * Part of: Arduino Projects Cookbook
 */

const int ANALOG_PIN = A0;
const int NUM_READINGS = 10;

int readings[NUM_READINGS];      // Circular buffer for readings
int readIndex = 0;               // Current index in buffer
long total = 0;                  // Running total
int averageRaw = 0;              // Average ADC value

void setup() {
  Serial.begin(9600);
  
  // Initialize all buffer readings to 0
  for (int thisReading = 0; thisReading < NUM_READINGS; thisReading++) {
    readings[thisReading] = 0;
  }

  Serial.println(F("Analog Reading Initialized."));
  Serial.println(F("Raw (0-1023)\tVoltage (V)\tPercent (%)"));
}

void loop() {
  // Subtract the oldest reading from running total
  total = total - readings[readIndex];
  // Read from sensor
  readings[readIndex] = analogRead(ANALOG_PIN);
  // Add new reading to running total
  total = total + readings[readIndex];
  // Advance circular index
  readIndex = (readIndex + 1) % NUM_READINGS;

  // Calculate smoothed average
  averageRaw = total / NUM_READINGS;

  // Convert to voltage (0.00V - 5.00V) assuming standard 5V Vref
  float voltage = (averageRaw * 5.0) / 1023.0;
  // Convert to percentage (0 - 100%)
  int percentage = map(averageRaw, 0, 1023, 0, 100);

  Serial.print(averageRaw);
  Serial.print(F("\t\t"));
  Serial.print(voltage, 2);
  Serial.print(F(" V\t\t"));
  Serial.print(percentage);
  Serial.println(F(" %"));

  delay(100); // 10Hz sampling rate
}
```

---

## ⚙️ How It Works (Under the Hood)

The Arduino ADC measures voltages between 0V and 5V relative to AREF. 10-bit resolution provides 2^10 = 1024 discrete steps (approx 4.88mV per step). The 10-sample moving window reduces high-frequency EMI noise from breadboard jumpers and unstable power rails.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Use analogReference(INTERNAL) to measure lower voltages (1.1V ref on Uno) with higher resolution.
1. Trigger visual threshold alerts when the voltage exceeds 3.5V.
1. Calibrate non-linear responses using piecewise linear interpolation.

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [01-Fundamentals/PWM](../../01-Fundamentals/PWM/)**: Feed the analog percentage directly into analogWrite() to control LED fading or motor speed.
- **Pair with [03-Actuators/Servo](../../03-Actuators/Servo/)**: Map the 0-1023 range directly to 0-180 degrees for manual servo joystick positioning.
- **Pair with [04-Displays/7-Segment](../../04-Displays/7-Segment/)**: Output the measured voltage to a 4-digit 7-segment display.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
