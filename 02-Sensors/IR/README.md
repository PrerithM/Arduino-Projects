# Infrared Proximity & Obstacle Detector

> Detect close-range reflective surfaces using active infrared emitter-receiver phototransistor pairs.

---

## 🎯 What You'll Learn
- Active infrared reflection principles and surface reflectivity variations
- Adjusting onboard comparator sensitivity potentiometers (LM393)
- Handling ambient daylight interference

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| Arduino Uno / Nano | 1 | Main board |
| TCRT5000 or FC-51 IR Obstacle Sensor | 1 | Infrared module with LM393 comparator |
| Breadboard & Jumpers | 1 set | Connections |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `5V` | `VCC` | 5V Power |
| `GND` | `GND` | Ground |
| `D3` | `OUT / DO` | Digital Trigger (Active LOW when obstacle detected) |


---

## 📐 Circuit & Wiring Diagram

```text
+-----------------+              +----------------------+
    |   Arduino Uno   |              |  IR Obstacle Module  |
    |                 |              |  (IR LED)  (PhotoTr) |
    |              5V |=============>| VCC                  |
    |              D3 |<-------------| OUT (LM393 Output)   |
    |             GND |=============>| GND                  |
    +-----------------+              +----------------------+
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`ir_sensor.ino`](./ir_sensor.ino).

```cpp
/*
 * Module: Infrared (IR) Proximity & Obstacle Sensor
 * Description: Monitors infrared reflectance for proximity alerts
 *              and line-tracking navigation.
 * Part of: Arduino Projects Cookbook
 */

const int IR_PIN  = 3;
const int LED_PIN = 13;

void setup() {
  pinMode(IR_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println(F("IR Proximity Sensor Active."));
}

void loop() {
  // Most IR modules output LOW when an obstacle reflects IR light
  int obstacleDetected = (digitalRead(IR_PIN) == LOW);

  digitalWrite(LED_PIN, obstacleDetected ? HIGH : LOW);

  if (obstacleDetected) {
    Serial.println(F(">>> OBSTACLE DETECTED! <<<"));
  } else {
    Serial.println(F("Path Clear."));
  }

  delay(100);
}
```

---

## ⚙️ How It Works (Under the Hood)

The onboard IR LED transmits 950nm infrared light. When an object is within range (typically 2-30cm), light reflects into the phototransistor. An LM393 comparator compares the phototransistor voltage against an onboard trimming potentiometer threshold and triggers the digital OUT pin LOW.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Use two IR sensors placed side-by-side to build a line-tracking differential steering algorithm.
1. Count items moving down a conveyor belt by logging state transitions.
1. Measure speed by calculating the time between two IR gate triggers.

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [06-Automation/Motor-Automation](../../06-Automation/Motor-Automation/)**: Use an array of IR sensors to guide autonomous line-follower robots.
- **Pair with [03-Actuators/DC-Motors](../../03-Actuators/DC-Motors/)**: Emergency collision stop for differential drive rovers.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
