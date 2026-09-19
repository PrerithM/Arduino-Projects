# Stepper Motor Precision Stepping (28BYJ-48 & ULN2003)

> Achieve exact rotational indexing, CNC positioning, and 3D printer axis movements with zero cumulative error.

---

## 🎯 What You'll Learn
- Unipolar vs Bipolar stepper motor coil winding physics
- Full-step vs Half-step 8-phase driving sequences
- Calculating steps per revolution with gear reduction ratios (4096 half-steps/rev on 28BYJ-48)

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| Arduino Uno / Nano | 1 | Main board |
| 28BYJ-48 Stepper Motor (5V) | 1 | Geared unipolar 4-phase stepper |
| ULN2003 Darlington Transistor Array Driver | 1 | Driver board with LED indicators |
| Breadboard & Jumpers | 1 set | Connections |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `5V` | `ULN2003 5V+` | External or 5V Power |
| `GND` | `ULN2003 GND-` | Ground |
| `D8` | `IN1` | Phase 1 Coil Drive |
| `D9` | `IN2` | Phase 2 Coil Drive |
| `D10` | `IN3` | Phase 3 Coil Drive |
| `D11` | `IN4` | Phase 4 Coil Drive |


---

## 📐 Circuit & Wiring Diagram

```text
+-----------------+              +----------------------+
    |   Arduino Uno   |              |  ULN2003 Driver      |
    |                 |              |  [ IN1 IN2 IN3 IN4 ] |=====> [ 28BYJ-48 ]
    |              D8 |------------->| IN1                  |       (Stepper)
    |              D9 |------------->| IN2                  |
    |             D10 |------------->| IN3                  |
    |             D11 |------------->| IN4                  |
    |             GND |=============>| GND                  |
    |              5V |=============>| 5V+                  |
    +-----------------+              +----------------------+
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`stepper_motor.ino`](./stepper_motor.ino).

```cpp
/*
 * Module: 28BYJ-48 Stepper Motor with ULN2003 Driver
 * Description: Rotates an exact number of steps and degrees in full and
 *              half-stepping modes for precision mechanisms.
 * Requires: Stepper library (Built into Arduino IDE)
 * Part of: Arduino Projects Cookbook
 */

#include <Stepper.h>

// 28BYJ-48 has 32 steps per internal motor revolution, with a 64:1 gear ratio.
// Total steps per output shaft revolution = 32 * 64 = 2048 full steps.
const int STEPS_PER_REV = 2048;

// Pin sequencing for ULN2003 (Notice order 1, 3, 2, 4 is required by standard Stepper lib)
Stepper myStepper(STEPS_PER_REV, 8, 10, 9, 11);

void setup() {
  myStepper.setSpeed(10); // 10 RPM
  Serial.begin(9600);
  Serial.println(F("Stepper Motor Controller Ready."));
}

void loop() {
  Serial.println(F("Rotating 1 Full Revolution Clockwise (360°)..."));
  myStepper.step(STEPS_PER_REV);
  delay(1000);

  Serial.println(F("Rotating Half Revolution Counter-Clockwise (180°)..."));
  myStepper.step(-STEPS_PER_REV / 2);
  delay(1000);
}
```

---

## ⚙️ How It Works (Under the Hood)

A stepper motor consists of a permanent magnet toothed rotor surrounded by stator electromagnets. By energizing coils in an alternating sequence (A -> B -> C -> D), the rotor teeth snap to the magnetic field, advancing one precise angular step at a time without slippage.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Use the AccelStepper library to add smooth acceleration and deceleration curves for high-speed moves.
1. Build a motorized automated camera slider for time-lapse photography.
1. Add limit switches to auto-home the stepper position on boot.

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [04-Displays/LCD](../../04-Displays/LCD/)**: Build an automated curtain opener with scheduled times shown on an LCD.
- **Pair with [01-Fundamentals/Interrupts](../../01-Fundamentals/Interrupts/)**: Homing calibration using physical limit switch interrupts.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
