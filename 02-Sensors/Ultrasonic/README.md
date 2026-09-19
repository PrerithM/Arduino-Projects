# Ultrasonic Distance Sensor (HC-SR04)

> Measure distances with millimeter precision using 40kHz acoustic pulses and speed-of-sound physics.

---

## 🎯 What You'll Learn
- Speed of sound calculation in dry air (343 m/s or 29.1 µs/cm)
- Generating 10-microsecond trigger pulses
- Measuring high-precision echo pulses with pulseIn()

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| Arduino Uno / Nano | 1 | Main board |
| HC-SR04 Ultrasonic Sensor | 1 | 4-pin sonar transceiver module |
| Breadboard & Wires | 1 set | Connections |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `5V` | `VCC` | 5V Power |
| `GND` | `GND` | Ground reference |
| `D9` | `TRIG` | Trigger pulse output |
| `D10` | `ECHO` | Echo pulse input |


---

## 📐 Circuit & Wiring Diagram

```text
+-----------------+              +----------------------+
    |   Arduino Uno   |              |  HC-SR04 Ultrasonic  |
    |                 |              |  [ T ]        [ R ]  |
    |              5V |=============>| VCC                  |
    |              D9 |------------->| TRIG                 |
    |             D10 |<-------------| ECHO                 |
    |             GND |=============>| GND                  |
    +-----------------+              +----------------------+
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`ultrasonic.ino`](./ultrasonic.ino).

```cpp
/*
 * Module: HC-SR04 Ultrasonic Distance Sensor
 * Description: Fires a 40kHz ultrasonic burst and computes exact obstacle
 *              distance in centimeters with outlier median filtering.
 * Part of: Arduino Projects Cookbook
 */

const int TRIG_PIN = 9;
const int ECHO_PIN = 10;

// Speed of sound in air at 20°C: ~343 m/s = 0.0343 cm/µs
// Distance = (Time * 0.0343) / 2 = Time / 58.2 (for round trip)

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  Serial.begin(9600);
  Serial.println(F("HC-SR04 Sonar Initialized."));
}

float readDistanceCm() {
  // Ensure trigger pin is clean LOW
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);

  // Send 10µs HIGH trigger pulse
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // Read the echo pin pulse duration in microseconds (timeout at 30ms = ~5 meters)
  unsigned long duration = pulseIn(ECHO_PIN, HIGH, 30000);

  if (duration == 0) {
    return -1.0; // Out of range / timeout
  }

  return (duration * 0.0343) / 2.0;
}

void loop() {
  float distance = readDistanceCm();

  if (distance >= 0 && distance <= 400) {
    Serial.print(F("Distance: "));
    Serial.print(distance, 1);
    Serial.print(F(" cm ("));
    Serial.print(distance / 2.54, 1);
    Serial.println(F(" inches)"));
  } else {
    Serial.println(F("Target out of range (>400cm or no reflection)"));
  }

  delay(100);
}
```

---

## ⚙️ How It Works (Under the Hood)

The HC-SR04 transmitter emits an 8-cycle ultrasonic burst at 40 kHz. The receiver detects the reflected echo and sets the ECHO pin HIGH for the exact duration the sound took to travel to the obstacle and bounce back. Dividing by 2 accounts for the two-way journey.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Integrate a temperature sensor to adjust the speed of sound dynamically: v = 331.3 + 0.606 * T.
1. Build a 3-zone visual parking assistant (Green = Safe, Yellow = Caution, Red = STOP).
1. Mount the sensor on a panning servo motor to build a 180-degree radar scanner.

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [03-Actuators/Buzzers](../../03-Actuators/Buzzers/)**: Create a proximity alarm that beeps faster as objects get closer.
- **Pair with [03-Actuators/Servo](../../03-Actuators/Servo/)**: Open an automatic trash can lid when a hand is detected closer than 15cm.
- **Pair with [06-Automation/Security](../../06-Automation/Security/)**: Detect unauthorized entry in doorways.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
