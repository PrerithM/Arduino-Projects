# Serial Monitor & Real-Time Waveform Plotter

> Visualize live mathematical waveforms, multiple sensor channels, and real-time filtering curves directly in the IDE.

---

## 🎯 What You'll Learn
- Formatting multi-variable telemetry for the Arduino IDE Serial Plotter (Ctrl+Shift+L)
- Visualizing filter responses (Raw Signal vs Filtered Signal)
- Designing structured CSV logging formats

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| Arduino Uno / Nano | 1 | Main board |
| Potentiometer or Analog Sensor | 1 | Signal source (optional) |
| USB Cable | 1 | Connection to PC |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `USB` | `Virtual COM Port` | Serial Telemetry Stream |


---

## 📐 Circuit & Wiring Diagram

```text
+-----------------+        USB Cable         +--------------------+
    |   Arduino Uno   |<========================>| Computer / Laptop  |
    |                 |                          |  Serial Plotter    |
    | (Analog Signal) |                          |  [ /\  /\  /\ ]    |
    +-----------------+                          +--------------------+
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`serial_monitor.ino`](./serial_monitor.ino).

```cpp
/*
 * Module: Serial Monitor & Multi-Channel Serial Plotter
 * Description: Generates multi-variable labeled telemetry streams that
 *              render as colored real-time graphs in the Arduino Serial Plotter.
 * Part of: Arduino Projects Cookbook
 */

float phase = 0.0;

void setup() {
  Serial.begin(115200);
  // Print legend headers for the Serial Plotter
  Serial.println(F("SineWave,CosineWave,NoiseSignal,FilteredAverage"));
}

void loop() {
  // Generate test signals
  float sineVal = sin(phase) * 50.0;
  float cosVal  = cos(phase) * 50.0;
  float noisySignal = sineVal + (random(-15, 15));

  // Running low-pass filter
  static float filtered = 0.0;
  filtered = (filtered * 0.85) + (noisySignal * 0.15);

  // Format: "VarName1:Value1,VarName2:Value2" or "Val1,Val2,Val3"
  Serial.print(F("Sine:"));
  Serial.print(sineVal);
  Serial.print(F(","));
  Serial.print(F("Cosine:"));
  Serial.print(cosVal);
  Serial.print(F(","));
  Serial.print(F("Noisy:"));
  Serial.print(noisySignal);
  Serial.print(F(","));
  Serial.print(F("Filtered:"));
  Serial.println(filtered);

  phase += 0.05;
  delay(30); // ~33 Hz update rate for silky smooth plotting
}
```

---

## ⚙️ How It Works (Under the Hood)

The Arduino IDE Serial Plotter reads lines terminated by newline characters (`\n`). Comma or tab-delimited numbers are automatically parsed into separate channels and plotted on an auto-scaling time-series canvas.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Plot raw ECG or photoplethysmography (pulse) sensor signals with beat detection thresholds.
1. Visualize PID error, proportional, integral, and derivative terms during motor tuning.
1. Stream data directly into Python using matplotlib or pyserial.

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [02-Sensors/IMU](../../02-Sensors/IMU/)**: Plot live 3-axis accelerometer vibrations to analyze motor balance.
- **Pair with [01-Fundamentals/Analog-IO](../../01-Fundamentals/Analog-IO/)**: Graph potentiometer smoothing filter performance in real-time.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
