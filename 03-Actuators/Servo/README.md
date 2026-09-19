# Precision RC Servo Motor Control (SG90 / MG996R)

> Position mechanical arms, steering linkages, and camera gimbals with exact degree control from 0° to 180°.

---

## 🎯 What You'll Learn
- 50Hz PWM position control pulse trains (1.0ms = 0°, 1.5ms = 90°, 2.0ms = 180°)
- Internal closed-loop feedback potentiometer and gear train mechanisms
- Preventing servo jitter and power brownouts with decoupling capacitors

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| Arduino Uno / Nano | 1 | Main board |
| SG90 Micro Servo (9g) | 1 | Positioning actuator with horns |
| 100µF Capacitor | 1 | Power rail buffer capacitor |
| Breadboard & Jumpers | 1 set | Connections |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `5V` | `VCC / Power (Red Wire)` | +5V Power Supply |
| `D9` | `Signal (Orange / Yellow Wire)` | 50Hz Servo PWM Control Signal |
| `GND` | `GND (Brown / Black Wire)` | Common Ground |


---

## 📐 Circuit & Wiring Diagram

```text
+-----------------+              +----------------------+
    |   Arduino Uno   |              |  SG90 Micro Servo    |
    |                 |              |  (Internal Gearbox)  |
    |              5V |=============>| Red (VCC)            |
    |              D9 |------------->| Orange/Yellow (PWM)  |
    |             GND |=============>| Brown/Black (GND)    |
    +-----------------+              +----------------------+
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`servo_control.ino`](./servo_control.ino).

```cpp
/*
 * Module: SG90 / MG996R Precision RC Servo Control
 * Description: Sweeps a micro-servo smoothly between 0° and 180°
 *              using non-blocking incremental velocity control.
 * Part of: Arduino Projects Cookbook
 */

#include <Servo.h>

Servo myServo;

const int SERVO_PIN = 9;
int currentPos = 0;
int targetPos  = 180;
int step = 1;

unsigned long prevMillis = 0;
const int speedDelay = 15; // Lower = faster sweep, Higher = smooth slow motion

void setup() {
  // Attaches the servo on pin 9 with standard 544µs - 2400µs pulse limits
  myServo.attach(SERVO_PIN, 544, 2400);
  myServo.write(0);
  Serial.begin(9600);
  Serial.println(F("Servo Controller Active."));
}

void loop() {
  unsigned long now = millis();

  if (now - prevMillis >= speedDelay) {
    prevMillis = now;

    currentPos += step;
    myServo.write(currentPos);

    if (currentPos >= 180) {
      step = -1; // Reverse direction
      Serial.println(F("Reached 180° -> Sweeping to 0°"));
    } else if (currentPos <= 0) {
      step = 1;
      Serial.println(F("Reached 0° -> Sweeping to 180°"));
    }
  }
}
```

---

## ⚙️ How It Works (Under the Hood)

A standard RC servo motor accepts a 50Hz (20ms period) pulse train. The width of the high pulse (between 1ms and 2ms) dictates the output shaft position. An internal feedback potentiometer and error amplifier continuously drive the internal DC motor until the physical shaft matches the commanded pulse width.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Control servo position smoothly using an analog joystick.
1. Build a 2-DOF Pan-Tilt turret capable of tracking coordinates.
1. Implement a soft-start acceleration curve to prevent mechanical gear shock.

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [02-Sensors/IMU](../../02-Sensors/IMU/)**: Build an active 1-axis stabilization gimbal matching roll tilt.
- **Pair with [05-Communication/Bluetooth](../../05-Communication/Bluetooth/)**: Position a robotic arm wirelessly from an Android/iOS app.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
