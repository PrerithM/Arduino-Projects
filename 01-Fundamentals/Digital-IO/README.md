# EXPERIMENT 001 — DIGITAL I/O & NON-BLOCKING STATE

> **The Hello World of physical computing: controlling current flow, Ohm's law, and async millis() timing.**
> 
> `Arduino UNO` · `ATmega328P` · `C++` · `BEGINNER`

```
┌──────────────────────────────────────────────────────────────┐
│ PRERITH.M                                      ← BACK TO LAB │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ EXPERIMENT 001                                               │
│                                                              │
│ DIGITAL INPUT / OUTPUT                                       │
│ & NON-BLOCKING TIMING                                        │
│                                                              │
│ Controlling electronic states (HIGH/LOW),                    │
│ tactile pushbutton debouncing, and async millis() timing.    │
│                                                              │
│ Arduino UNO   LED + Button   C++   BEGINNER                  │
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

| PLATFORM | CONTROLLER | SENSOR / ACTUATOR | LANGUAGE |
| :--- | :--- | :--- | :--- |
| **Arduino UNO** | **ATmega328P** | **Tactile Button & LED** | **C++** |

| STATUS | DIFFICULTY | COMPONENTS | YEAR |
| :--- | :--- | :--- | :--- |
| **Completed ✓** | **Beginner** | **3** | **2023** |

---

## 03 — The Problem

> **How can a microcontroller read user input without electrical floating noise, and toggle visual outputs without locking up the CPU with `delay()`?**

```
   PUSHBUTTON (D2)
          │
          │  Mechanical Press (Contact Bounce: ~5ms)
          ▼
     ┌─────────┐
     │ ATmega  │ ◄── Software Debounce Filter
     │ 328P    │ ◄── Non-blocking millis() scheduler
     └────┬────┘
          │
          │  5V Digital High (Ohm's Law: 220Ω limit)
          ▼
      LED (D13)
```

---

## 04 — The Approach

```
01  Configure D2 as INPUT_PULLUP (internal 20kΩ pullup)
          ↓
02  Poll button state on every loop pass (active LOW)
          ↓
03  Filter mechanical contact noise with 50ms timestamp window
          ↓
04  Evaluate elapsed non-blocking millis() interval
          ↓
05  Write HIGH/LOW state to LED anode (D13)
```

By enabling the internal pullup resistor and checking `millis()` deltas instead of calling `delay()`, the microcontroller remains 100% responsive to incoming signals.

---

## 05 — Hardware

| Component | Quantity | Purpose |
| :--- | :--- | :--- |
| **Arduino UNO** | 1 | Microcontroller digital I/O controller |
| **5mm LED** | 1 | Optical output feedback indicator |
| **220Ω Resistor** | 1 | Current limiting resistor ($I = \frac{V_{cc} - V_f}{R} \approx 14.5\text{mA}$) |
| **Tactile Pushbutton** | 1 | Momentary user switch |
| **Breadboard & Wires** | 1 set | Solderless prototyping |

```
              ┌──────── 5mm LED (via 220Ω)
              │
              ▼
        ┌─────────────┐
        │             │ ◄──── Pushbutton (D2 to GND)
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
TACTILE SWITCH         ARDUINO UNO
──────────────         ──────────
PIN A ───────────────── D2 (Internal Pullup)
PIN B ───────────────── GND

LED                    ARDUINO UNO
───                    ──────────
ANODE (+) ───────────── D13 (via 220Ω Resistor)
CATHODE (-) ─────────── GND
```

### Pin Configuration Table

| Component Pin | Arduino Pin | Mode | Electrical Role |
| :--- | :--- | :--- | :--- |
| **Pushbutton Pin A** | `D2` | `INPUT_PULLUP` | Reads `LOW` when pressed, `HIGH` when idle |
| **Pushbutton Pin B** | `GND` | Ground | Common system ground |
| **LED Anode (+)** | `D13` | `OUTPUT` | Driven `HIGH` (5V) to illuminate LED |
| **LED Cathode (-)** | `GND` | Ground | Returns current to ground |

---

## 07 — How It Works

### 01 — Pullup Resistor Logic
Floating input pins act as antennas that pick up electromagnetic noise. `pinMode(2, INPUT_PULLUP)` connects an internal $20\text{k}\Omega$ resistor to $5\text{V}$, ensuring a crisp `HIGH` state until the button shorts the pin to `GND` (`LOW`).

### 02 — Non-Blocking Timing Engine
Instead of freezing the processor with `delay(500)`, the sketch records the current timestamp `currentMillis = millis()`. If `currentMillis - previousMillis >= interval`, the state flips. The CPU continues executing at 16 million cycles per second.

---

## 08 — Code

### Core Concept Snippet

```cpp
const int LED_PIN = 13;
const int BUTTON_PIN = 2;

unsigned long previousMillis = 0;
const long interval = 500;
int ledState = LOW;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
}

void loop() {
  unsigned long currentMillis = millis();
  
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    ledState = (ledState == LOW) ? HIGH : LOW;
    digitalWrite(LED_PIN, ledState);
  }
}
```

### What is happening?

```
millis() timer tick
    ↓
calculate elapsed time (now - last_time)
    ↓
if threshold reached: toggle state variable
    ↓
digitalWrite(13, state)
    ↓
CPU remains free for sensor polling
```

The full code is located in [`digital_io.ino`](./digital_io.ino).

---

## 09 — The Experiment Log

| Test Run | Action | Expected Output | Observed Output | CPU Responsiveness |
| :--- | :--- | :--- | :--- | :---: |
| **TEST #01** | Rapid Button Tap (x10) | Single clean toggle per press | 10 toggles, no false triggers | **100% Free** |
| **TEST #02** | Sustained Press | State holds without flickering | Stable `LOW` reading on D2 | **100% Free** |
| **TEST #03** | Concurrent Serial Output | Serial data streams during LED blink | No stutter in 500ms cadence | **100% Free** |

---

## 10 — Problems Encountered (What Broke)

```
01 ─ LED was extremely dim / flickering
     ↓
     Diagnosed: Accidental 10kΩ resistor placed instead of 220Ω (starved LED of current)

02 ─ Button triggered 3-4 times on a single click
     ↓
     Diagnosed: Mechanical metal contacts bounce for 2–5ms; added 50ms software debounce lock

03 ─ Blinking froze when reading serial inputs
     ↓
     Diagnosed: Old delay() call blocked the loop; refactored to non-blocking millis() state machine
```

### Engineering Diagnosis

> *Physical switches are mechanical springs: when pressed, their metal contacts literally bounce against each other before settling. Debouncing is the first essential software filter in physical computing.*

---

## 11 — What I Learned

1. **Never connect an LED directly to 5V without a current-limiting resistor** — LEDs have negligible internal resistance once turned on; without a resistor, they draw destructive current ($I = \frac{V}{R}$).
2. **`INPUT_PULLUP` saves parts and breadboard real estate** — using the internal $20\text{k}\Omega$ pullup eliminates the need for discrete external resistors.
3. **`delay()` is the enemy of scalable embedded systems** — non-blocking state machines with `millis()` are required for real-time responsiveness.

---

## 12 — Results

```
RESULT
        14.2 mA @ 2.1V Forward Drop
     ────────────────────────────────
     STABLE 500ms BLINK CADENCE
```

| Parameter | Theoretical | Measured |
| :--- | :--- | :--- |
| **Current Draw** | 14.5 mA | 14.2 mA |
| **Debounce Window** | 50 ms | 48.5 ms |
| **Blink Period** | 500 ms | 500.1 ms |

---

## 13 — What Could Be Improved (Next Iteration)

```
CURRENT
Single LED + Pushbutton with millis()
       │
       ▼
NEXT
PWM brightness breathing fading (Timer register)
       │
       ▼
NEXT
Hardware Interrupts (attachInterrupt for instant wake)
       │
       ▼
NEXT
Rotary Encoder with multi-state menu navigation
```

---

## 14 — Project Evolution

```
THIS EXPERIMENT LED TO
Digital I/O & Millis()
       ↓
PWM Duty Cycle Control
       ↓
Hardware Timer Interrupts
       ↓
Multi-tasking Robotics Controller
```

---

## 15 — Final Project Footer

```
────────────────────────────────────────────────────────────
EXPERIMENT 001 — DIGITAL I/O & NON-BLOCKING STATE
Status: Completed ✓
[ VIEW SOURCE IN digital_io.ino ↗ ]
────────────────────────────────────────────────────────────
← Previous Experiment                           Next Experiment →
[Root Overview]                             [01-Fundamentals/Analog-IO]
```
