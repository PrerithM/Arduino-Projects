# 📡 Serial Communication & Interactive CLI Engine

> **"Establish bi-directional asynchronous UART telemetry between Arduino and computer, and build robust text command parsers."**
>
> 🌐 **Interactive Lab:** Open [`index.html`](./index.html) in any browser to test the interactive command-line terminal, simulated TX/RX LED bursts, and ASCII packet inspector.

---

## 🎯 The Big Idea

Developing physical computing systems without telemetry is like driving a car blindfolded. You cannot see what internal variables the microcontroller is calculating, and you cannot adjust thresholds without re-compiling and uploading firmware.

**UART (Universal Asynchronous Receiver-Transmitter)** is the universal two-wire digital serial protocol that links your Arduino to your computer. This module demonstrates how to configure modern **115200 baud** communications, handle incoming characters asynchronously using the **64-byte hardware FIFO ring buffer**, and parse formatted human commands (`LED ON`, `READ A0`, `PING`) into immediate hardware actions.

---

## 💡 The Mental Model

- **The Morse Code Walkie-Talkie**: Imagine two people with walkie-talkies talking over a single channel. Because they don't share a clock wire, they must agree beforehand on how fast words are spoken (the **baud rate**). When a character is sent, it is broken down into a rapid pulse train: one Start bit, 8 data bits (representing the ASCII letter), and one Stop bit.
- **The Mailbox (Ring Buffer)**: When your computer sends a text command, the characters arrive much faster than your Arduino code can read them. The microcontroller has a hardware-managed "mailbox" called a **64-byte circular FIFO ring buffer**. Hardware interrupts automatically drop incoming letters into this mailbox so your code can read them when ready without dropping a single byte.

---

## 🔌 Hardware Setup & Pinout

On the Arduino Uno, the hardware UART is hard-wired to the onboard ATmega16U2 USB-to-Serial converter:

| Arduino Pin | Hardware USART Line | Direction | Function |
| :--- | :--- | :--- | :--- |
| **`Pin D0`** | `RX` (Receive) | Input &larr; Host | Reads serialized binary bits into UDR0 register |
| **`Pin D1`** | `TX` (Transmit) | Output &rarr; Host | Drives outgoing telemetry pulses to USB host |
| **`Pin D13`** | Status Indicator | Output | Switched via CLI commands (`LED ON` / `LED OFF`) |
| **`Pin A0`** | Analog Input | Input | Sampled remotely via the `READ A0` command |

```
    Host Computer / USB
           ▲
           │ USB Cable (D+, D-)
           ▼
    ATmega16U2 USB Bridge
           ▲
           │ TTL Serial (0V - 5V)
    TX ────┼──────► RX (Pin D0) ───┐
    RX ◄───┼─────── TX (Pin D1) ───┼── ATmega328P Core
           │                       │
          GND ─────────────────────┘
```

---

## 🔬 How the Hardware Works (Under the Hood)

### 1. Asynchronous Frame Timing
Because there is no shared clock wire between computer and Arduino, both sides must adhere strictly to the configured **baud rate** (bits per second).
At **115200 baud**:
$$\text{Bit Period } T = \frac{1}{115200} \approx 8.68\text{ microseconds per bit}$$
A standard UART packet uses **8-N-1 formatting**:
$$\text{1 Start Bit (LOW)} + 8\text{ Data Bits} + \text{0 Parity Bits} + \text{1 Stop Bit (HIGH)} = 10\text{ bits per character}$$
Transmitting one ASCII letter takes only $86.8\text{ }\mu\text{s}$.

### 2. The 64-Byte Circular FIFO Buffer
When a byte finishes shifting into the hardware `UDR0` register, the microcontroller automatically fires `USART_RX_vect`, an internal hardware interrupt. This ISR pushes the byte into a 64-byte circular RAM array:
- `Serial.available()` returns the count of bytes waiting in the buffer.
- `Serial.read()` pops the oldest byte and advances the tail index.
- If more than 64 bytes arrive without being read, incoming bytes are discarded.

### 3. String Reservation (`inputString.reserve(64)`)
Dynamic string concatenation in C++ repeatedly allocates and frees small blocks on the microcontroller's tiny 2KB SRAM, leading to memory fragmentation and sudden crashes. Calling `inputString.reserve(64)` pre-allocates a fixed contiguous buffer once at boot, guaranteeing zero heap fragmentation.

---

## 💻 Line-by-Line Code Walkthrough

```cpp
/*
 * Module: Serial Communication & Interactive CLI
 * Description: Parses multi-character text commands from Serial Monitor
 *              at 115200 baud to control hardware and stream telemetry.
 */

const int STATUS_LED = 13;
String inputString = "";         // Buffer holding incoming command text
bool stringComplete = false;     // Flag indicating a newline has arrived

void setup() {
  pinMode(STATUS_LED, OUTPUT);

  // Modern high-speed baud rate (12x faster than 9600!)
  Serial.begin(115200);

  // Pre-allocate buffer to prevent SRAM heap fragmentation
  inputString.reserve(64);

  Serial.println(F("========================================"));
  Serial.println(F("      ARDUINO CLI ENGINE v1.0           "));
  Serial.println(F(" Available Commands:                    "));
  Serial.println(F("   LED ON     - Turn pin 13 ON          "));
  Serial.println(F("   LED OFF    - Turn pin 13 OFF         "));
  Serial.println(F("   READ A0    - Sample analog pin A0    "));
  Serial.println(F("   PING       - Return PONG & uptime    "));
  Serial.println(F("========================================"));
  Serial.print(F("> "));
}

void loop() {
  // Execute only when a complete newline-terminated line is ready
  if (stringComplete) {
    inputString.trim(); // Strip trailing carriage returns and spaces

    // Command Dispatcher:
    if (inputString.equalsIgnoreCase("LED ON")) {
      digitalWrite(STATUS_LED, HIGH);
      Serial.println(F("OK: LED set to HIGH"));
    } 
    else if (inputString.equalsIgnoreCase("LED OFF")) {
      digitalWrite(STATUS_LED, LOW);
      Serial.println(F("OK: LED set to LOW"));
    } 
    else if (inputString.equalsIgnoreCase("READ A0")) {
      int val = analogRead(A0);
      float v = (val * 5.0) / 1023.0;
      Serial.print(F("ANALOG A0: "));
      Serial.print(val);
      Serial.print(F(" ("));
      Serial.print(v, 2);
      Serial.println(F("V)"));
    } 
    else if (inputString.equalsIgnoreCase("PING")) {
      Serial.print(F("PONG (Uptime: "));
      Serial.print(millis() / 1000);
      Serial.println(F("s)"));
    } 
    else if (inputString.length() > 0) {
      Serial.print(F("ERR: Unknown command '"));
      Serial.print(inputString);
      Serial.println(F("'"));
    }

    // Reset buffer for next incoming command
    inputString = "";
    stringComplete = false;
    Serial.print(F("> "));
  }
}

// Built-in AVR runtime hook called between loop() passes if serial is available
void serialEvent() {
  while (Serial.available()) {
    char inChar = (char)Serial.read();
    if (inChar == '\n') {
      stringComplete = true; // Newline marks end of message
    } else if (inChar != '\r') {
      inputString += inChar;
    }
  }
}
```

---

## 🧪 Hands-On Experiments to Try

1. **Test Baud Rate Mismatch**: Change your Arduino IDE Serial Monitor dropdown to **9600 baud** while the sketch runs at **115200**. Notice the garbled hieroglyphs (`⸮⸮?`)! Switch it back to 115200 to restore clean ASCII.
2. **Add a `RESET` Command**: Add an `else if (inputString.equalsIgnoreCase("RESET"))` branch that sets all outputs LOW and prints a reboot notice.
3. **Parse Numerical Parameters**: Implement an `ADC AVG` command that samples Pin A0 20 times and prints the standard deviation.

---

## ⚠️ Common Mistakes & Troubleshooting

- **Line Ending Not Set to Newline**: If typing commands produces no response, look at the bottom of the Arduino Serial Monitor window. Ensure the dropdown is set to **"Newline"** or **"Both NL & CR"** so the `\n` delimiter is transmitted.
- **Using Pins 0 and 1 for Sensors**: If you wire buttons or LEDs to Pin 0 or Pin 1, sketches will fail to upload with `avrdude: stk500_recv(): programmer is not responding`. Pins 0 and 1 must remain clear for USB communications.
- **Serial Monitor Steals Terminal**: Only one software program can open a COM port at a time. If you run a Python telemetry script, close the Arduino IDE Serial Monitor first.

---

## 🚀 What to Build Next

UART communication powers:
- **GPS Telemetry Modules** (NMEA text sentence parsing at 9600 baud)
- **Bluetooth Serial Bridges** (wireless smartphone terminal apps)
- **Robotic Host Telemetry** (streaming sensor matrices directly to Python and ROS)
