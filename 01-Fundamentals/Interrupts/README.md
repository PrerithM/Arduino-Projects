# Hardware Interrupts (Zero-Latency Event Handling)

> Trap critical hardware events instantaneously without polling or missing microsecond-level triggers.

---

## 🎯 What You'll Learn
- Configuring external interrupts with attachInterrupt() on pins D2 and D3
- Interrupt Service Routine (ISR) best practices: keep it fast, avoid delay() and Serial prints
- Proper usage of the volatile keyword for thread-safe memory sharing

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| Arduino Uno / Nano | 1 | Main board |
| Pushbutton or Optical Interrupter | 1 | Trigger device |
| 10kΩ Pull-down Resistor | 1 | If using active-high (or use internal pullup) |
| Breadboard & Jumper Wires | 1 set | Connections |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `D2 (INT0)` | `Signal Pin` | Interrupt Trigger Input (FALLING / RISING) |
| `GND` | `Button Leg` | Active Low ground link |


---

## 📐 Circuit & Wiring Diagram

```text
+-----------------+
    |   Arduino Uno   |
    |                 |
    |       D2 (INT0) |--------+
    |                 |        |
    |             GND |--------+------------------+
    +-----------------+        |                  |
                           [ Pushbutton ]      [ GND ]
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`interrupts.ino`](./interrupts.ino).

```cpp
/*
 * Module: Hardware Interrupt Service Routine (ISR)
 * Description: Measures precise pulse triggers and rotary encoder ticks
 *              without polling inside the main loop().
 * Part of: Arduino Projects Cookbook
 */

const byte INTERRUPT_PIN = 2; // INT0 on Uno / Nano
const byte STATUS_LED    = 13;

// volatile tells the compiler that this variable can change unexpectedly
// inside an interrupt, preventing aggressive compiler optimization.
volatile unsigned long pulseCount = 0;
volatile bool newPulseFlag = false;

// Debouncing inside ISR
volatile unsigned long lastIsrMicros = 0;
const unsigned long DEBOUNCE_MICROS = 150000; // 150ms lock out for mechanical buttons

void isrTrigger() {
  unsigned long currentMicros = micros();
  if (currentMicros - lastIsrMicros > DEBOUNCE_MICROS) {
    pulseCount++;
    newPulseFlag = true;
    lastIsrMicros = currentMicros;
  }
}

void setup() {
  pinMode(INTERRUPT_PIN, INPUT_PULLUP);
  pinMode(STATUS_LED, OUTPUT);
  Serial.begin(9600);

  // Attach Interrupt: pin 2, ISR function, Trigger on FALLING edge
  attachInterrupt(digitalPinToInterrupt(INTERRUPT_PIN), isrTrigger, FALLING);

  Serial.println(F("Hardware Interrupt active on Pin D2 (FALLING edge)."));
}

void loop() {
  // Heavy computation simulation in loop()
  // Even if loop() is busy, the interrupt will NEVER be missed!
  delay(500);

  if (newPulseFlag) {
    // Disable interrupts briefly if reading multi-byte variables on 8-bit AVR
    noInterrupts();
    unsigned long currentCount = pulseCount;
    newPulseFlag = false;
    interrupts();

    Serial.print(F("Interrupt Caught! Total Events: "));
    Serial.println(currentCount);

    digitalWrite(STATUS_LED, !digitalRead(STATUS_LED));
  }
}
```

---

## ⚙️ How It Works (Under the Hood)

When the voltage on D2 transitions from HIGH to LOW, the AVR CPU pauses whatever instruction it is currently executing in `loop()`, saves the program counter to the stack, jumps to the ISR address vector, executes the code, and immediately resumes normal execution.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Attach a rotary encoder with both channels (A on D2, B on D3) to detect directional CW/CCW rotation.
1. Build a high-speed tachometer measuring RPM of a spinning motor wheel using an optical sensor.
1. Use pin change interrupts (PCINT) on any arbitrary Arduino pin.

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [06-Automation/Security](../../06-Automation/Security/)**: Trigger instant panic alarms when security tripwires or reed switches break.
- **Pair with [02-Sensors/Ultrasonic](../../02-Sensors/Ultrasonic/)**: Capture exact microsecond echo return edges with zero latency.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
