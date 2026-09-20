# ⚡ Hardware Interrupts & Zero-Latency Event Handling

> **"Trap critical microsecond-level hardware triggers instantaneously without burning CPU cycles in software polling loops."**
>
> 🌐 **Interactive Lab:** Open [`index.html`](./index.html) in any browser to test the Polling vs. Hardware ISR benchmark, pulse generator, and live interrupt vector oscillogram.

---

## 🎯 The Big Idea

In simple programs, a microcontroller checks an input pin over and over again inside `void loop()`. This is called **polling**. But what happens if the CPU is in the middle of a complex 500ms calculation, or waiting for a slow sensor? If a critical pulse occurs during that time, **the event is lost forever**.

A **Hardware Interrupt** solves this at the silicon level. When an external pin transitions, dedicated hardware circuitry pauses the main program counter within 4 clock cycles (~250 nanoseconds), executes a specialized function called an **Interrupt Service Routine (ISR)**, and returns to the main loop without missing a beat.

---

## 💡 The Mental Model

- **Polling**: Imagine sitting at your desk studying, but every 10 seconds you stop reading, stand up, walk to the front door, open it to check if a delivery person is standing outside, and walk back. You waste enormous energy, and if someone knocks while you are in the kitchen, you miss them completely.
- **Hardware Interrupt**: You install a **doorbell**. You sit at your desk and study continuously with 100% focus. The instant a visitor presses the doorbell, a chime rings. You immediately pause, open the door, take the package, and sit right back down to study. Zero missed visitors, zero wasted trips.

---

## 🔌 Hardware Setup & Pinout

On the Arduino Uno (ATmega328P), only **Pin D2 (INT0)** and **Pin D3 (INT1)** support dedicated external hardware interrupts:

| Arduino Pin | Hardware Vector | Function | Description |
| :--- | :--- | :--- | :--- |
| **`Pin D2`** | `INT0` (Vector 1) | Pulse / Sensor Trigger | Hardware-monitored interrupt input line |
| **`Pin D3`** | `INT1` (Vector 2) | Secondary Interrupt | Auxiliary interrupt channel (e.g. Encoder Channel B) |
| **`Pin D13`** | Onboard LED | Visual Status Indicator | Toggles state every time a valid ISR executes |

```
              ATmega328P Microcontroller
             ┌─────────────────────────┐
             │                         │
   Pin D2 ───► INT0 Hardware Comparator│
             │           │             │
             │     Flag Set in EIFR    │
             │           ▼             │
             │  Branch to isrTrigger() │
             │  (Execution < 4 μs)     │
             └─────────────────────────┘
```

---

## 🔬 How the Hardware Works (Under the Hood)

### 1. Trigger Modes
When configuring `attachInterrupt()`, you choose which electrical transition triggers the ISR:
- **`FALLING`**: High-to-Low voltage drop (5V &rarr; 0V). Ideal for buttons wired with `INPUT_PULLUP`.
- **`RISING`**: Low-to-High voltage rise (0V &rarr; 5V). Used for optical tachometers and motion sensors.
- **`CHANGE`**: Triggers on both rising and falling transitions.
- **`LOW`**: Continuously fires as long as the pin is held at 0V.

### 2. The `volatile` Keyword
When a variable is shared between an ISR and the main loop, it **must** be declared with the `volatile` modifier:
```cpp
volatile unsigned long pulseCount = 0;
```
Without `volatile`, the C++ optimizing compiler may assume that because `pulseCount` is not visibly modified inside `loop()`, it can keep its value cached in a CPU register instead of re-reading RAM. `volatile` forces the compiler to read directly from physical memory every single time.

### 3. Atomic Variable Access (The 8-Bit Rule)
The ATmega328P is an **8-bit processor**. An `unsigned long` is 32 bits (4 bytes).
Reading a 32-bit variable takes 4 separate assembly instructions. If an interrupt fires halfway through those 4 reads, the main program can read corrupted garbage!
To read safely, briefly disable interrupts:
```cpp
noInterrupts();
unsigned long safeCount = pulseCount; // Atomic copy
interrupts();
```

---

## 💻 Line-by-Line Code Walkthrough

```cpp
/*
 * Module: Hardware Interrupt Service Routine (ISR)
 * Features: Debounced ISR + Atomic variable transfer
 */

const byte INTERRUPT_PIN = 2; // INT0 on Arduino Uno
const byte STATUS_LED    = 13;

// volatile tells compiler this changes asynchronously in hardware
volatile unsigned long pulseCount = 0;
volatile bool newPulseFlag = false;

// Microsecond-level lockout for mechanical debounce
volatile unsigned long lastIsrMicros = 0;
const unsigned long DEBOUNCE_MICROS = 150000; // 150ms

// Interrupt Service Routine: Keep it lightning fast!
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

  // Attach Interrupt: maps Pin 2 (INT0) to isrTrigger on FALLING edge
  attachInterrupt(digitalPinToInterrupt(INTERRUPT_PIN), isrTrigger, FALLING);

  Serial.println(F("Hardware Interrupt active on Pin D2 (FALLING edge)."));
}

void loop() {
  // Heavy computation simulation: loop is completely busy!
  delay(500);

  // Check if the ISR flagged a new event
  if (newPulseFlag) {
    // Atomic critical section for 32-bit variable safety
    noInterrupts();
    unsigned long currentCount = pulseCount;
    newPulseFlag = false;
    interrupts();

    Serial.print(F("Interrupt Caught! Total Events: "));
    Serial.println(currentCount);

    // Toggle status LED
    digitalWrite(STATUS_LED, !digitalRead(STATUS_LED));
  }
}
```

### The 4 Golden Rules of ISRs

1. **Keep it ultra-short**: An ISR should take under 10 microseconds. Set flags, increment counters, and exit.
2. **Never call `delay()`**: Timekeeping interrupts are disabled inside an ISR, so `delay()` will freeze the Arduino forever.
3. **Never call `Serial.print()`**: UART output relies on hardware interrupts to transmit buffer bytes. Calling it inside an ISR can cause deadlocks.
4. **Always declare shared variables as `volatile`**.

---

## 🧪 Hands-On Experiments to Try

1. **Prove Zero-Latency**: In `loop()`, change `delay(500)` to `delay(3000)`. Tap the button on Pin D2 rapidly while the main loop is sleeping. Notice how *every single click* is captured and processed without a single dropped event!
2. **Tachometer Pulse Counter**: Connect the output of a photo-interrupter wheel sensor to Pin D2. Spin the wheel to count pulses at hundreds of hertz.
3. **Trigger on RISING vs FALLING**: Change `FALLING` to `RISING` in `attachInterrupt()`. Notice the event now fires when you *release* the button rather than when you push it down.

---

## ⚠️ Common Mistakes & Troubleshooting

- **Forgetting `digitalPinToInterrupt()`**: On the Uno, interrupt 0 is on Pin 2. Writing `attachInterrupt(2, isr, FALLING)` is a common bug on newer boards. Always use `digitalPinToInterrupt(PIN)`.
- **System Lockup Inside ISR**: If your Arduino freezes the instant an interrupt triggers, you likely placed a `delay()`, `Serial.print()`, or infinite `while` loop inside your ISR handler.
- **Race Condition Data Corruption**: Reading a 32-bit `pulseCount` without disabling interrupts will occasionally yield erratic numbers like `65536` when the low byte rolls over. Always use atomic `noInterrupts()` guards.

---

## 🚀 What to Build Next

Hardware interrupts are mandatory for mission-critical physical computing:
- **Optical Rotary Encoders** (high-speed wheel odometry in robotics)
- **Flow Rate Meters** (counting water turbine impeller pulses)
- **Emergency Stop Safety Circuits** (instantaneously killing motor power)
