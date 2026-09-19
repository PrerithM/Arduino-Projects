# Serial Communication (UART Command Line Interface)

> Transmit telemetry, parse incoming ASCII commands, and control your Arduino in real-time from your computer terminal.

---

## 🎯 What You'll Learn
- Baud rates, UART framing (8N1), and hardware buffers
- Non-blocking line-by-line serial command parsing using readBytesUntil() or char buffers
- Structuring human-readable and JSON-formatted diagnostic logs

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| Arduino Uno / Nano | 1 | Main board |
| USB Cable | 1 | Serial communication link to PC |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `USB / D0 (RX)` | `PC TX` | Receives data from computer |
| `USB / D1 (TX)` | `PC RX` | Transmits data to computer |


---

## 📐 Circuit & Wiring Diagram

```text
+-----------------+        USB Cable         +--------------------+
    |   Arduino Uno   |<========================>| Computer / Laptop  |
    |                 |   (Virtual COM Port)     |  (Serial Monitor   |
    |      D0 (RX)    |                          |   @ 115200 Baud)   |
    |      D1 (TX)    |                          +--------------------+
    +-----------------+
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`serial_communication.ino`](./serial_communication.ino).

```cpp
/*
 * Module: Serial Communication & Interactive CLI
 * Description: Parses multi-character text commands from the Serial Monitor
 *              to configure onboard hardware and query telemetry.
 * Part of: Arduino Projects Cookbook
 */

const int STATUS_LED = 13;
String inputString = "";
bool stringComplete = false;

void setup() {
  pinMode(STATUS_LED, OUTPUT);
  Serial.begin(115200); // Fast modern baud rate
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
  // Check if a complete command line has arrived
  if (stringComplete) {
    inputString.trim(); // Strip trailing \r and \n

    if (inputString.equalsIgnoreCase("LED ON")) {
      digitalWrite(STATUS_LED, HIGH);
      Serial.println(F("OK: LED set to HIGH"));
    } else if (inputString.equalsIgnoreCase("LED OFF")) {
      digitalWrite(STATUS_LED, LOW);
      Serial.println(F("OK: LED set to LOW"));
    } else if (inputString.equalsIgnoreCase("READ A0")) {
      int val = analogRead(A0);
      float v = (val * 5.0) / 1023.0;
      Serial.print(F("ANALOG A0: "));
      Serial.print(val);
      Serial.print(F(" ("));
      Serial.print(v, 2);
      Serial.println(F("V)"));
    } else if (inputString.equalsIgnoreCase("PING")) {
      Serial.print(F("PONG (Uptime: "));
      Serial.print(millis() / 1000);
      Serial.println(F("s)"));
    } else if (inputString.length() > 0) {
      Serial.print(F("ERR: Unknown command '"));
      Serial.print(inputString);
      Serial.println(F("'"));
    }

    // Reset buffer for next command
    inputString = "";
    stringComplete = false;
    Serial.print(F("> "));
  }
}

// Built-in Arduino serial event handler called between loop() iterations
void serialEvent() {
  while (Serial.available()) {
    char inChar = (char)Serial.read();
    if (inChar == '\n') {
      stringComplete = true;
    } else if (inChar != '\r') {
      inputString += inChar;
    }
  }
}
```

---

## ⚙️ How It Works (Under the Hood)

Universal Asynchronous Receiver-Transmitter (UART) converts parallel byte data to a serial stream of bits with start/stop framing. Arduino's USB-to-UART chip (e.g. ATmega16U2 or CH340) presents a virtual COM port. Incoming bytes accumulate in a 64-byte hardware FIFO ring buffer until extracted via `Serial.read()`.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Format telemetry as JSON packets (e.g., `{"temp": 24.5, "hum": 60}`) for Python/Node.js dashboards.
1. Add variable command parsing (e.g., `PWM 9 128` to set pin 9 to duty cycle 128).
1. Implement a CRC checksum validation for noisy telemetry links.

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [05-Communication/Bluetooth](../../05-Communication/Bluetooth/)**: Use SoftwareSerial to pipe the exact same CLI command structure wirelessly over HC-05.
- **Pair with [05-Communication/WiFi](../../05-Communication/WiFi/)**: Bridge Serial commands to an MQTT broker via ESP8266.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
