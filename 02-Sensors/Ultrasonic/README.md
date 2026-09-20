# EXPERIMENT 004 — ULTRASONIC DISTANCE SENSOR

> **Measuring physical distance using sound, Arduino UNO and the HC-SR04.**
> 
> `Arduino UNO` · `HC-SR04` · `C++` · `BEGINNER`

```
┌──────────────────────────────────────────────────────────────┐
│ PRERITH.M                                      ← BACK TO LAB │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ EXPERIMENT 004                                               │
│                                                              │
│ ULTRASONIC                                                   │
│ DISTANCE SENSOR                                              │
│                                                              │
│ Measuring physical distance using sound,                     │
│ Arduino UNO and the HC-SR04.                                 │
│                                                              │
│ Arduino UNO   HC-SR04   C++   BEGINNER                       │
│                                                              │
│                         ┌──────────────────────┐             │
│                         │                      │             │
│                         │    PROJECT PHOTO     │             │
│                         │                      │             │
│                         └──────────────────────┘             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 02 — Project Specification

| PLATFORM | CONTROLLER | SENSOR | LANGUAGE |
| :--- | :--- | :--- | :--- |
| **Arduino UNO** | **ATmega328P** | **HC-SR04** | **C++** |

| STATUS | DIFFICULTY | COMPONENTS | YEAR |
| :--- | :--- | :--- | :--- |
| **Completed ✓** | **Beginner** | **4** | **2024** |

---

## 03 — The Problem

> **How can a microcontroller determine how far an object is without physically touching it?**

```
        OBJECT
          │
          │  37 cm
          ▼
     ┌─────────┐
     │ HC-SR04 │
     └────┬────┘
          │
          ▼
     ┌─────────┐
     │ ARDUINO │
     └────┬────┘
          │
          ▼
      DISTANCE
       = 37 cm
```

---

## 04 — The Approach

```
01  Send ultrasonic pulse
          ↓
02  Wait for echo
          ↓
03  Measure travel time
          ↓
04  Calculate distance
          ↓
05  Display result
```

The HC-SR04 sends an ultrasonic pulse and measures how long it takes for the echo to return. Arduino converts that time into distance.

---

## 05 — Hardware

| Component | Quantity | Purpose |
| :--- | :--- | :--- |
| **Arduino UNO** | 1 | Main controller & microsecond pulse timer |
| **HC-SR04** | 1 | 40kHz ultrasonic distance transceiver module |
| **LED** | 1 | Visual proximity alert indicator |
| **Buzzer** | 1 | Auditory warning feedback |
| **Jumper wires** | 4–6 | Breadboard connections |
| **Breadboard** | 1 | Solderless prototyping |

```
              ┌──────── HC-SR04
              │
              ▼
        ┌─────────────┐
        │             │
        │  BREADBOARD │
        │             │
        └──────┬──────┘
               │
               ▼
          ┌─────────┐
          │ ARDUINO │
          │   UNO   │
          └─────────┘
```

---

## 06 — Circuit / Wiring

```
HC-SR04                ARDUINO UNO
────────                ──────────
VCC ─────────────────── 5V
GND ─────────────────── GND
TRIG ────────────────── D9
ECHO ────────────────── D10
```

### Pin Configuration Table

| HC-SR04 Pin | Arduino Pin | Function |
| :--- | :--- | :--- |
| **VCC** | `5V` | 5V DC Power |
| **GND** | `GND` | Ground Reference |
| **TRIG** | `D9` | 10µs Output Trigger Pulse |
| **ECHO** | `D10` | High Pulse Duration Input |

---

## 07 — How It Works

### 01 — Trigger
```
Arduino
   │
   │ 10 μs pulse
   ▼
TRIG
```

### 02 — Sound Travels
```
HC-SR04
   )))))))))))))))))
                 OBJECT
```
The transducer fires an 8-cycle burst of 40 kHz ultrasound that travels through the air at roughly $343\text{ m/s}$ ($0.0343\text{ cm/\mu s}$).

### 03 — Echo Returns
```
OBJECT
   ((((((((((((((((
                  HC-SR04
```
The reflected acoustic wave strikes the receiver transducer, which raises the `ECHO` pin `HIGH` for the exact travel duration.

### 04 — Arduino Calculates
$$\text{Distance} = \frac{\text{Duration} \times \text{Speed of Sound}}{2}$$

> **Why `/ 2` exists:**
> Sound has to travel to the target object **and** bounce all the way back to the receiver. The time measured by `pulseIn()` is the **round-trip** flight time. We divide by $2$ to isolate the true one-way physical distance.

---

## 08 — Code

### Core Concept Snippet

```cpp
long duration;
int distance;

// Send 10µs HIGH trigger pulse
digitalWrite(TRIG_PIN, LOW);
delayMicroseconds(2);
digitalWrite(TRIG_PIN, HIGH);
delayMicroseconds(10);
digitalWrite(TRIG_PIN, LOW);

// Measure return echo time in microseconds
duration = pulseIn(ECHO_PIN, HIGH);

// Compute one-way distance in centimeters
distance = duration * 0.034 / 2;
```

### What is happening?

```
pulseIn()
    ↓
measures echo duration (μs)
    ↓
multiply by speed of sound (0.0343 cm/μs)
    ↓
divide by 2 (round-trip cancellation)
    ↓
physical distance (cm)
```

The full production sketch with median filtering and timeout handling is located in [`ultrasonic.ino`](./ultrasonic.ino).

---

## 09 — The Experiment Log

| Test Run | Target Distance | Expected Reading | Measured Reading | Error Margin | Validation |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TEST #01** | 10 cm | ~10 cm | **11 cm** | +1 cm | **✓ PASS** |
| **TEST #02** | 25 cm | ~25 cm | **26 cm** | +1 cm | **✓ PASS** |
| **TEST #03** | 50 cm | ~50 cm | **52 cm** | +2 cm | **✓ PASS** |

---

## 10 — Problems Encountered (What Broke)

```
01 ─ Random distance readings
     ↓
     Checked loose jumper wires & added decoupling on breadboard rail

02 ─ Sensor occasionally returned 0
     ↓
     Investigated pulse timeout (pulseIn hangs without explicit 30ms limit)

03 ─ Readings fluctuated on soft surfaces
     ↓
     Added 5-sample median window filter to discard scatter spikes
```

### Engineering Diagnosis

> *The problem wasn't the sensor itself. The timing and signal-reading behaviour needed to be handled correctly in software to reject acoustic reflection scatter and prevent indefinite blocking when no echo returns.*

---

## 11 — What I Learned

1. **Microcontrollers don't "understand" the physical world** — sensors translate physical events into electrical signals that software must interpret and condition.
2. **Hardware debugging requires checking both the circuit and the software** — an erratic signal can be a loose ground pin or a missing microsecond delay.
3. **Small timing differences produce large differences in sensor readings** — at $343\text{ m/s}$, a timing variance of just $58\mu\text{s}$ shifts the measured distance by a full centimeter.

---

## 12 — Results

```
RESULT
        37.2 cm
     ─────────────
     OBJECT
```

| Test Condition | Expected (cm) | Actual (cm) | Absolute Error |
| :--- | :--- | :--- | :--- |
| **Close Range (10 cm)** | 10.0 | 11.0 | 1.0 cm |
| **Mid Range (25 cm)** | 25.0 | 26.0 | 1.0 cm |
| **Far Range (50 cm)** | 50.0 | 52.0 | 2.0 cm |

---

## 13 — What Could Be Improved (Next Iteration)

```
CURRENT
Arduino + HC-SR04 (Single-point distance)
       │
       ▼
NEXT
Multiple sensor array (Frontal + Left + Right triangulation)
       │
       ▼
NEXT
OLED display (Live onboard telemetry HUD)
       │
       ▼
NEXT
Obstacle avoidance state machine
       │
       ▼
NEXT
Autonomous differential-drive robot
```

---

## 14 — Project Evolution

```
THIS EXPERIMENT LED TO
Ultrasonic Sensor
       ↓
Distance Detection
       ↓
Obstacle Avoidance
       ↓
Robot Navigation
       ↓
Advanced Rover
```

This fundamental sonar experiment directly powered the obstacle evasion radar in the **[Advanced Rover](../../06-Automation/Motor-Automation/)** project!

---

## 15 — Final Project Footer

```
────────────────────────────────────────────────────────────
EXPERIMENT 004 — ULTRASONIC DISTANCE SENSOR
Status: Completed ✓
[ VIEW SOURCE IN ultrasonic.ino ↗ ]
────────────────────────────────────────────────────────────
← Previous Experiment                           Next Experiment →
[01-Fundamentals/Digital-IO]                [03-Actuators/Servo]
```
