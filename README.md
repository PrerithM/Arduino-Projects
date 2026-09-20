# ⚡ PRERITH.M — Hardware Lab Notebook & Arduino Repository

> **"The website tells the story of the experiment; GitHub contains the implementation."**
> 
> *A modern engineering lab notebook documenting hands-on experiments in electronics, physical computing, embedded systems, and robotics.*

---

## 🔬 The Documentation Philosophy

Most Arduino repositories look like conventional school tutorials: *Introduction → Requirements → Code → Conclusion*.

This repository is built as an **authentic engineering lab notebook**. Every experiment documents the actual engineering journey through a rigorous 10-phase story arc:

```
WHY ──► WHAT ──► HOW ──► BUILD ──► TEST ──► FAIL ──► DEBUG ──► LEARN ──► IMPROVE ──► NEXT
```

### The 15-Section Lab Standard

Every project in this repository follows this exact structure:

| # | Section | What It Contains |
| :--- | :--- | :--- |
| **01** | **Project Header** | Experiment ID, title, one-line elevator pitch, hardware tags, and board preview |
| **02** | **Project Specification** | 5-second technical datasheet matrix (Platform, Controller, Sensor, Status, Difficulty, Year) |
| **03** | **The Problem** | The core physical/computing question I wanted to solve + ASCII signal diagram |
| **04** | **The Approach** | 5-step numbered concept flow explained in direct, plain-English engineering terms |
| **05** | **Hardware Datasheet** | Component, quantity, and exact functional purpose table + annotated layout |
| **06** | **Circuit & Wiring** | Pin-to-pin wiring map + circuit schematic + pin configuration table |
| **07** | **How It Works** | Step-by-step physics & timing breakdown (e.g. 10µs trigger pulse, acoustic wave propagation, round-trip echo time, why `/2` exists) |
| **08** | **Core Code & Concept Flow** | The critical 10-line concept snippet + flowchart breakdown of what the registers and functions are doing |
| **09** | **Experiment Log** | Real test bench logs (`TEST #01`, `TEST #02`, expected vs. actual values, error margins, pass/fail status) |
| **10** | **What Broke (Debugging)** | Real hardware failures, breadboard contact issues, sensor jitter, and first-person engineering diagnosis |
| **11** | **What I Learned** | Key personal engineering takeaways written in authentic first-person voice |
| **12** | **Results & Benchmark** | Visual hero metric readout + accuracy table across multiple distances/voltages |
| **13** | **Next Iteration** | Step-by-step evolution path (`CURRENT ──► NEXT ──► NEXT ──► AUTONOMOUS ROBOT`) |
| **14** | **Project Evolution** | `THIS EXPERIMENT LED TO` flow connecting simple fundamentals to advanced robotics projects |
| **15** | **Project Footer** | Status verification badge, source code links, and next/previous experiment navigation |

---

## 🗂️ Lab Experiments Directory

```
Arduino-Projects/
├── 01-Fundamentals/       # Clock cycles, I/O registers, ADC quantization, PWM, Interrupts
│   ├── Digital-IO/        # Non-blocking millis() state machines, current limiting (V=IR)
│   ├── Analog-IO/         # 10-bit Successive Approximation ADC, voltage divider math
│   ├── PWM/               # Timer counter registers, duty cycle modulation
│   ├── Interrupts/        # Hardware ISRs, volatile atomic state, bounce filtering
│   ├── Timers/            # CTC mode, prescalers, hardware timer comparisons
│   └── Serial-Communication/ # UART framing, circular baud buffer polling
├── 02-Sensors/            # Translating physical phenomena into electrical signals
│   ├── Ultrasonic/        # Speed-of-sound physics, HC-SR04 pulse timing, echo round trip
│   ├── IR/                # Infrared photodiode reflectance, threshold comparator
│   ├── Temperature/       # LM35 / Thermistor analog voltage curves, linearization
│   ├── Humidity/          # DHT11 single-wire bi-directional protocol timing
│   ├── Light/             # LDR photoresistor resistance decay, ambient lux
│   ├── IMU/               # MPU6050 6-DOF accelerometer + gyro, I2C DMP fusion
│   └── Distance/          # Optical time-of-flight vs sonar comparison
├── 03-Actuators/          # Controlling physical motion, torque, light, and sound
│   ├── LEDs/              # RGB PWM mixing, WS2812B addressable protocols
│   ├── Servo/             # SG90 50Hz 1ms–2ms pulse width servo control
│   ├── DC-Motors/         # L298N H-Bridge current amplification, flyback diodes
│   ├── Stepper-Motors/    # 28BYJ-48 ULN2003 4-phase microstepping sequences
│   ├── Relays/            # Optocoupler isolation, inductive kickback protection
│   └── Buzzers/           # Piezo resonant frequencies, square-wave tone generation
├── 04-Displays/           # Real-time visual data presentation & telemetry
│   ├── Serial-Monitor/    # ANSI formatting, high-baud streaming, real-time plotting
│   ├── LCD/               # HD44780 16x2 via PCF8574 I2C bus expander
│   └── 7-Segment/         # Common anode/cathode multiplexing, shift registers
├── 05-Communication/      # Distributed embedded networking & protocols
│   ├── UART/              # Hardware vs SoftwareSerial, baud rate error budgets
│   ├── I2C/               # Two-wire synchronous serial, ACK/NACK clock stretching
│   ├── SPI/               # High-speed synchronous master-slave bus (10MHz+)
│   ├── Bluetooth/         # HC-05 SPP wireless serial telemetry bridge
│   └── WiFi/              # ESP8266 Hayes AT command parser, IoT REST endpoints
└── 06-Automation/         # Integrated multi-module cyber-physical systems
    ├── Smart-Lighting/    # Sensor-fused presence detection + light switching
    ├── Security/          # Modulated laser tripwire + latched alarm state machine
    ├── Environment-Monitoring/ # Closed-loop greenhouse climate control
    └── Motor-Automation/  # Advanced Rover autonomous obstacle avoidance
```

---

## 🍳 The Full Cookbook

For complete wiring combinations, multi-module recipe charts, and cross-module architecture maps, see **[COOKBOOK.md](./COOKBOOK.md)**.

---

## 🛠️ Lab Tools & Hardware Stack

- **Microcontroller**: Arduino UNO R3 (ATmega328P @ 16MHz) & Arduino Nano
- **IDE & Toolchain**: Arduino IDE 2.x / `avr-gcc` / PlatformIO
- **Core Languages**: C++ (Embedded AVR-C++), Python (Host Telemetry)
- **Bench Instruments**: Digital Multimeter, 24MHz 8-Channel Logic Analyzer, Solderless Breadboard, USB-A/B Cable

---

## 🌐 Live Web Portfolio

Explore interactive circuit simulations, animated signal flows, live sensor sandboxes, and full lab notebook entries at:
👉 **[prerithm.github.io/Arduino-Projects](https://prerithm.github.io/Arduino-Projects/)**

---

*Written by **Prerith M.** from the workbench. Every schematic, code sample, failure log, and test benchmark was built and validated with real hardware.*
