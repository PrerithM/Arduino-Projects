# Wireless Bluetooth Telemetry & Control (HC-05 / HC-06)

> Connect your Arduino wirelessly to smartphones, laptops, and tablets over classic Bluetooth SPP (Serial Port Profile).

---

## 🎯 What You'll Learn
- Configuring HC-05 Bluetooth modules with AT command mode
- Voltage divider level shifting (5V Arduino TX to 3.3V HC-05 RX)
- Building smartphone UI interfaces with Bluetooth Serial terminal apps

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| Arduino Uno / Nano | 1 | Main board |
| HC-05 or HC-06 Bluetooth Module | 1 | Wireless serial module (2.4GHz) |
| 1kΩ and 2kΩ Resistors | 1 each | Voltage divider for 3.3V RX protection |
| Breadboard & Jumpers | 1 set | Connections |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `5V` | `VCC` | 5V Power |
| `GND` | `GND` | Ground |
| `D10 (RX)` | `HC-05 TXD` | Arduino receives 3.3V data directly |
| `D11 (TX)` | `HC-05 RXD (via divider)` | 5V stepped down to 3.3V via 1k/2k divider |


---

## 📐 Circuit & Wiring Diagram

```text
+-----------------+              +----------------------+
    |   Arduino Uno   |              |  HC-05 Bluetooth SPP |
    |                 |              |  [ 2.4GHz Antenna ]  |
    |              5V |=============>| VCC                  |
    |             GND |======+======>| GND                  |
    |        D10 (RX) |<-----|-------| TXD                  |
    |        D11 (TX) |--[1k]--+---->| RXD (3.3V Logic)     |
    +-----------------+        |     +----------------------+
                             [2k]
                               |
                              GND
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`bluetooth_hc05.ino`](./bluetooth_hc05.ino).

```cpp
/*
 * Module: HC-05 Wireless Bluetooth Serial Interface
 * Description: Bi-directional wireless bridge allowing phone apps to control
 *              onboard pins and stream telemetry via Bluetooth SPP.
 * Part of: Arduino Projects Cookbook
 */

#include <SoftwareSerial.h>

const int BT_RX = 10;
const int BT_TX = 11;
const int LED_PIN = 13;

SoftwareSerial bluetooth(BT_RX, BT_TX); // RX, TX

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);       // Serial monitor on PC
  bluetooth.begin(9600);   // Default HC-05 baud rate

  Serial.println(F("Bluetooth Module Online. Pair with smartphone (PIN: 1234)."));
}

void loop() {
  // Read incoming commands from smartphone
  if (bluetooth.available()) {
    char cmd = bluetooth.read();
    Serial.print(F("Phone Sent: "));
    Serial.println(cmd);

    if (cmd == '1' || cmd == 'H') {
      digitalWrite(LED_PIN, HIGH);
      bluetooth.println(F("LED: ON"));
    } else if (cmd == '0' || cmd == 'L') {
      digitalWrite(LED_PIN, LOW);
      bluetooth.println(F("LED: OFF"));
    }
  }

  // Send data from PC keyboard over Bluetooth to phone
  if (Serial.available()) {
    char c = Serial.read();
    bluetooth.write(c);
  }
}
```

---

## ⚙️ How It Works (Under the Hood)

The HC-05 is a baseband Bluetooth V2.0+EDR module. It implements the standard Bluetooth Serial Port Profile (SPP), which presents itself to paired devices as a virtual transparent serial cable, eliminating the need for complex custom Bluetooth drivers on your phone.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Use AT commands to change the Bluetooth device broadcast name and custom PIN code.
1. Build a custom Android app using MIT App Inventor with virtual joysticks and gauges.
1. Upgrade to Bluetooth Low Energy (BLE) using an HM-10 or ESP32.

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [03-Actuators/DC-Motors](../../03-Actuators/DC-Motors/)**: Build a smartphone-controlled Bluetooth RC Rover.
- **Pair with [06-Automation/Smart-Lighting](../../06-Automation/Smart-Lighting/)**: Control home mood lights wirelessly from your couch.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
