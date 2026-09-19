# SoftwareSerial & Dual Microcontroller UART

> Establish point-to-point serial communication between two Arduino boards using bit-banged SoftwareSerial pins.

---

## 🎯 What You'll Learn
- Creating virtual serial ports on any digital pin with SoftwareSerial
- Designing structured start/end delimiter packet protocols (e.g. `<CMD,VAL>`)
- Avoiding serial buffer overruns

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| Arduino Uno / Nano | 2 | Master and Slave microcontrollers |
| Jumper Wires | 3 | Crossed TX/RX and Common Ground |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `D10 (RX)` | `Remote Arduino D11 (TX)` | Crossed Receive Line |
| `D11 (TX)` | `Remote Arduino D10 (RX)` | Crossed Transmit Line |
| `GND` | `Remote Arduino GND` | Crucial Common Ground Reference |


---

## 📐 Circuit & Wiring Diagram

```text
+-----------------+                       +-----------------+
    | Arduino 1 (TX)  |                       | Arduino 2 (RX)  |
    |                 |                       |                 |
    |        D11 (TX) |---------------------->| D10 (RX)        |
    |        D10 (RX) |<----------------------| D11 (TX)        |
    |             GND |======================>| GND             |
    +-----------------+                       +-----------------+
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`uart_softwareserial.ino`](./uart_softwareserial.ino).

```cpp
/*
 * Module: SoftwareSerial Inter-Microcontroller UART
 * Description: Sends and receives structured packet messages between two
 *              Arduinos with packet framing delimiters.
 * Part of: Arduino Projects Cookbook
 */

#include <SoftwareSerial.h>

const byte RX_PIN = 10;
const byte TX_PIN = 11;

SoftwareSerial linkSerial(RX_PIN, TX_PIN); // RX, TX

void setup() {
  Serial.begin(9600);       // PC Debug Serial
  linkSerial.begin(9600);   // Inter-Arduino Link

  Serial.println(F("UART Inter-Board Link Active."));
  Serial.println(F("Type a message to send to the other Arduino:"));
}

void loop() {
  // Read from PC Serial Monitor and send to Remote Arduino
  if (Serial.available()) {
    char c = Serial.read();
    linkSerial.write(c);
  }

  // Read from Remote Arduino and print to PC Serial Monitor
  if (linkSerial.available()) {
    char c = linkSerial.read();
    Serial.write(c);
  }
}
```

---

## ⚙️ How It Works (Under the Hood)

UART is asynchronous (no clock line). Both sender and receiver agree on a fixed baud rate. When a byte is sent, the TX pin drops LOW for 1 start bit, pulses 8 data bits sequentially, and returns HIGH for 1 stop bit. Crossing TX to RX ensures one board's output feeds the other's input.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Implement a packet parser that extracts checksum-verified packets like `<SERVO,90>` and `<TEMP,25.4>`.
1. Build a master-slave telemetry system where the master polls multiple slave sensors.
1. Create a wireless optical communication link using an IR LED and receiver.

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [05-Communication/Bluetooth](../../05-Communication/Bluetooth/)**: Connect the HC-05 module to SoftwareSerial while keeping Hardware Serial open for PC debugging.
- **Pair with [04-Displays/LCD](../../04-Displays/LCD/)**: Display incoming UART telemetry sent from a remote sensor station.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
