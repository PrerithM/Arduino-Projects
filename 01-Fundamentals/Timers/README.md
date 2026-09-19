# Hardware Timers & Non-Blocking State Machines

> Eliminate delay() completely to run multiple simultaneous tasks concurrently on single-core microcontrollers.

---

## 🎯 What You'll Learn
- Why delay() stalls the CPU and ruins responsive robotics
- Building cooperative multitasking loops using millis() timestamps
- Designing robust finite state machines (FSM)

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| Arduino Uno / Nano | 1 | Main board |
| LED 1 (Red) | 1 | Fast heartbeat indicator |
| LED 2 (Green) | 1 | Slow status indicator |
| 220Ω Resistors | 2 | Current limiting |
| Breadboard & Jumpers | 1 set | Connections |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `D11` | `Red LED (220Ω to Anode)` | Blinks at 2Hz (250ms toggle) |
| `D12` | `Green LED (220Ω to Anode)` | Blinks at 0.5Hz (1000ms toggle) |
| `GND` | `Cathodes` | Common Ground |


---

## 📐 Circuit & Wiring Diagram

```text
+-----------------+
    |   Arduino Uno   |
    |                 |
    |             D11 |---[ 220Ω ]--->| (Red LED)   ---+
    |             D12 |---[ 220Ω ]--->| (Green LED) -+
    |                 |                              |
    |             GND |------------------------------+
    +-----------------+
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`timers.ino`](./timers.ino).

```cpp
/*
 * Module: Non-Blocking Concurrent Timers & Multitasking
 * Description: Runs two independent LED flashers and a serial telemetry
 *              task at different frequencies with zero delay() bottlenecks.
 * Part of: Arduino Projects Cookbook
 */

struct TaskTimer {
  unsigned long previousMillis;
  unsigned long interval;
};

TaskTimer taskFast  = {0, 250};   // 4Hz toggle (250ms)
TaskTimer taskSlow  = {0, 1000};  // 1Hz toggle (1000ms)
TaskTimer taskTelemetry = {0, 2000}; // Report every 2s

const int PIN_FAST = 11;
const int PIN_SLOW = 12;

bool stateFast = false;
bool stateSlow = false;

void setup() {
  pinMode(PIN_FAST, OUTPUT);
  pinMode(PIN_SLOW, OUTPUT);
  Serial.begin(9600);
  Serial.println(F("Cooperative Multitasking Engine Started."));
}

void loop() {
  unsigned long now = millis();

  // Task 1: Fast Flash
  if (now - taskFast.previousMillis >= taskFast.interval) {
    taskFast.previousMillis = now;
    stateFast = !stateFast;
    digitalWrite(PIN_FAST, stateFast);
  }

  // Task 2: Slow Flash
  if (now - taskSlow.previousMillis >= taskSlow.interval) {
    taskSlow.previousMillis = now;
    stateSlow = !stateSlow;
    digitalWrite(PIN_SLOW, stateSlow);
  }

  // Task 3: Telemetry Stream
  if (now - taskTelemetry.previousMillis >= taskTelemetry.interval) {
    taskTelemetry.previousMillis = now;
    Serial.print(F("[UPTIME] "));
    Serial.print(now / 1000);
    Serial.print(F("s | Fast LED: "));
    Serial.print(stateFast ? "ON" : "OFF");
    Serial.print(F(" | Slow LED: "));
    Serial.println(stateSlow ? "ON" : "OFF");
  }

  // The loop is completely free to handle immediate sensor inputs here!
}
```

---

## ⚙️ How It Works (Under the Hood)

The ATmega328P Timer0 runs continuously in the background, incrementing an internal counter every millisecond. `millis()` returns this 32-bit unsigned integer (which overflows only after ~49.7 days). By subtracting `now - previousMillis >= interval`, subtraction with unsigned arithmetic handles rollover seamlessly.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Add an automatic timeout feature that shuts off an actuator after 10 seconds of inactivity.
1. Create a dynamic rate scheduler where one task adjusts the frequency of another.
1. Implement a lightweight state machine (IDLE -> ARMED -> TRIGGERED -> COOLDOWN).

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [06-Automation/Environment-Monitoring](../../06-Automation/Environment-Monitoring/)**: Sample temperature every 5 minutes while polling buttons every 20ms and updating LCD every 1 second.
- **Pair with [03-Actuators/Servo](../../03-Actuators/Servo/)**: Create smooth multi-point robotic sweep trajectories without blocking.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
