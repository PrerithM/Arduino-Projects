# ⏱️ Concurrent Timers & Non-Blocking Multitasking

> **"Eliminate blocking `delay()` calls completely and execute multiple concurrent tasks at independent frequencies using non-blocking hardware time arithmetic."**
>
> 🌐 **Interactive Lab:** Open [`index.html`](./index.html) in any browser to test the cooperative task scheduler visualizer, task progress timelines, and live delay-freeze injection.

---

## 🎯 The Big Idea

The single biggest obstacle for beginners transitioning to intermediate embedded programming is the `delay()` function. Writing `delay(1000)` commands the microcontroller core to halt and execute empty CPU cycles for one billion nanoseconds. During that freeze, the processor cannot read pushbuttons, process incoming serial commands, or balance a robot.

This module introduces **Cooperative Non-Blocking Multitasking** using the hardware millisecond counter `millis()`. You will learn how to run three completely independent tasks—a Fast LED (4Hz / 250ms), a Slow LED (1Hz / 1000ms), and a Telemetry Stream (0.5Hz / 2000ms)—simultaneously on a single-core 16MHz ATmega328P without a real-time operating system (RTOS).

---

## 💡 The Mental Model

- **The Chef with a Wristwatch**: Imagine a professional chef cooking dinner. The pasta needs 10 minutes to boil, the bread takes 25 minutes to bake, and the sauce needs to be stirred every 3 minutes.
  - A chef using `delay()` would put the pasta in the water, close their eyes, and stand completely frozen in place for 10 minutes, ignoring the burning sauce and smoking oven!
  - A chef using `millis()` glances at their wristwatch (`now = millis()`). They put the pasta in, stir the sauce, chop vegetables, check the oven, and glance at the watch every few seconds. When the 10-minute mark arrives, they pull the pasta out immediately. Everything finishes simultaneously with zero wasted time.

---

## 🔌 Hardware Setup & Pinout

Connect two independent LEDs to observe asynchronous blink rates running side-by-side:

| Arduino Pin | Connected Hardware | Scheduled Period | Functional Behavior |
| :--- | :--- | :--- | :--- |
| **`Pin D11`** | 220Ω &rarr; Fast LED (Blue) | **250 ms (4.0 Hz)** | Rapid system activity heartbeat |
| **`Pin D12`** | 220Ω &rarr; Slow LED (Red) | **1000 ms (1.0 Hz)** | Slow clock cadence |
| **`USB UART`** | Serial Monitor Stream | **2000 ms (0.5 Hz)** | Telemetry broadcast every 2.0s |
| **`GND`** | Common Ground Rail | 0V Return | Cathodes of both LEDs |

```
                 Arduino Uno
               ┌─────────────┐
     Pin D11 ──┤──/\/\/\────►│ Blue LED (Fast: 250ms)
               │    220Ω     │
     Pin D12 ──┤──/\/\/\────►│ Red LED (Slow: 1000ms)
               │    220Ω     │
         GND ──┴─────────────┴── Common Ground (0V)
```

---

## 🔬 How the Hardware Works (Under the Hood)

### 1. The Millisecond Timer Engine (Timer0)
The ATmega328P has a dedicated hardware peripheral called **Timer0**.
- The 16.00 MHz system clock is divided by a prescaler of 64 ($250\text{ kHz}$).
- The 8-bit timer register overflows every 256 counts ($1.024\text{ ms}$).
- An internal interrupt (`TIMER0_OVF_vect`) updates a 32-bit `unsigned long` tick counter in RAM.
- Calling `millis()` retrieves this counter in under 1 microsecond.

### 2. The Non-Blocking Timestamp Comparison
Instead of halting execution, each task maintains its own state struct:
```cpp
struct TaskTimer {
  unsigned long previousMillis;
  unsigned long interval;
};
```
During every single pass through `void loop()`, the task checks:
$$\text{Elapsed Time} = \text{Current Time} - \text{Previous Time}$$
If $\text{Elapsed Time} \ge \text{Interval}$, the task executes its action, updates its timestamp, and hands control back to the loop.

### 3. The 49.7-Day Rollover Immunity
An `unsigned long` occupies 32 bits and tops out at $2^{32} - 1 = 4,294,967,295\text{ ms}$ (approx. **49.71 days**).
When it overflows, it wraps around from 4.29 billion back to 0.
Because C++ performs unsigned binary subtraction using two's complement:
$$\text{now} - \text{previous}$$
**Always calculates the correct positive elapsed duration**, even across the rollover point!
*(Note: Never write `if (millis() > previous + interval)` as this will permanently stall when `previous + interval` overflows).*

---

## 💻 Line-by-Line Code Walkthrough

```cpp
/*
 * Module: Non-Blocking Concurrent Timers & Multitasking
 * Features: Modular task struct scheduler running 3 concurrent jobs
 */

// Define lightweight task state container
struct TaskTimer {
  unsigned long previousMillis;
  unsigned long interval;
};

// Instantiate 3 independent tasks with custom cadences:
TaskTimer taskFast      = {0, 250};   // 4Hz toggle (250ms)
TaskTimer taskSlow      = {0, 1000};  // 1Hz toggle (1000ms)
TaskTimer taskTelemetry = {0, 2000};  // Report every 2.0s

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
  // Snapshot current hardware timestamp once at top of cycle
  unsigned long now = millis();

  // Task 1: Fast Flash (250ms)
  if (now - taskFast.previousMillis >= taskFast.interval) {
    taskFast.previousMillis = now;
    stateFast = !stateFast;
    digitalWrite(PIN_FAST, stateFast);
  }

  // Task 2: Slow Flash (1000ms) - completely independent!
  if (now - taskSlow.previousMillis >= taskSlow.interval) {
    taskSlow.previousMillis = now;
    stateSlow = !stateSlow;
    digitalWrite(PIN_SLOW, stateSlow);
  }

  // Task 3: Telemetry Stream (2000ms)
  if (now - taskTelemetry.previousMillis >= taskTelemetry.interval) {
    taskTelemetry.previousMillis = now;
    Serial.print(F("[UPTIME] "));
    Serial.print(now / 1000);
    Serial.print(F("s | Fast LED: "));
    Serial.print(stateFast ? "ON" : "OFF");
    Serial.print(F(" | Slow LED: "));
    Serial.println(stateSlow ? "ON" : "OFF");
  }

  // The CPU can read emergency pushbuttons or sensors right here with 0ms delay!
}
```

---

## 🧪 Hands-On Experiments to Try

1. **Inject a Blocking Delay**: Add `delay(2000);` right at the end of `void loop()`. Observe how both LEDs stop blinking independently and now jump in unison every 2 seconds. Remove the delay to restore silky multitasking.
2. **Dynamic Period Modulation**: Connect a 10k potentiometer to Pin A0. Make `taskFast.interval = map(analogRead(A0), 0, 1023, 50, 1000)`. Rotate the dial to dynamically tune the fast LED speed while the slow LED keeps steady 1.0Hz time!
3. **Four-Phase Traffic Light**: Create a non-blocking sequence that cycles Red &rarr; Red+Yellow &rarr; Green &rarr; Yellow while continuously scanning for pedestrian crosswalk pushbuttons.

---

## ⚠️ Common Mistakes & Troubleshooting

- **The Addition Rollover Bug**: Never write `if (millis() > nextTargetTime)`. Always write `if (millis() - previousTime >= interval)`. The subtraction form guarantees rollover safety across 49.7 days.
- **Forgetting to Update `previousMillis`**: If you forget `previousMillis = now;` inside the `if` block, the condition will remain true on every subsequent loop pass, causing the LED to flash at MHz speeds.
- **Variable Type Mismatch**: Never store time values in an `int` or `long`. An `int` overflows in 32.7 seconds! Always use `unsigned long`.

---

## 🚀 What to Build Next

Non-blocking timing is the cornerstone of:
- **Autonomous Drones & Quadcopters** (running PID stabilization loops at 250Hz while polling radio telemetry at 20Hz)
- **3D Printers & CNC Mills** (stepping stepper motors without stuttering when calculating G-code)
- **Connected IoT Weather Stations** (reading temperature, uploading Wi-Fi packets, and updating LCD displays without freezing)
