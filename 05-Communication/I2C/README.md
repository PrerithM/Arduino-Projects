# I2C Bus Communication (Master-Slave Architecture)

> Connect up to 127 sensors, displays, and coprocessors over a simple 2-wire shared multi-drop synchronous bus.

---

## 🎯 What You'll Learn
- I2C protocol: START/STOP conditions, 7-bit addressing, and ACK/NACK bits
- Wire library onReceive() and onRequest() event callbacks
- Internal and external I2C pull-up resistors on SDA/SCL lines

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| Arduino Uno (Master) | 1 | Main controller |
| Arduino Uno/Nano (Slave) or I2C Sensor | 1 | Peripheral device |
| 4.7kΩ Pull-up Resistors | 2 | Pull-ups on SDA and SCL rails |
| Breadboard & Jumpers | 1 set | Connections |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `A4 (SDA)` | `Peripheral SDA` | Serial Data Line (Bi-directional) |
| `A5 (SCL)` | `Peripheral SCL` | Serial Clock Line (Driven by Master) |
| `GND` | `Peripheral GND` | Common Ground |


---

## 📐 Circuit & Wiring Diagram

```text
+-----------------+              5V   5V
    | Arduino Master  |              |    |
    |                 |           [4.7k][4.7k]
    |        A4 (SDA) |--------------+----+--------> [ I2C Slave 1 (0x27) ]
    |        A5 (SCL) |-------------------+--------> [ I2C Slave 2 (0x68) ]
    |             GND |============================> [ Common Ground    ]
    +-----------------+
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`i2c_bus.ino`](./i2c_bus.ino).

```cpp
/*
 * Module: I2C Master-Slave Communication (Wire Library)
 * Description: Demonstrates bidirectional multi-byte register reading and
 *              writing across a 2-wire shared I2C bus.
 * Part of: Arduino Projects Cookbook
 */

#include <Wire.h>

#define SLAVE_ADDR 0x08

void setup() {
  Wire.begin(); // Join I2C bus as Master
  Serial.begin(9600);
  Serial.println(F("I2C Master Ready."));
}

void loop() {
  // 1. Send Command to Slave
  Wire.beginTransmission(SLAVE_ADDR);
  Wire.write("PING");
  Wire.endTransmission();

  delay(50);

  // 2. Request 6 bytes of response data from Slave
  Wire.requestFrom(SLAVE_ADDR, 6);
  Serial.print(F("Received from Slave: "));
  while (Wire.available()) {
    char c = Wire.read();
    Serial.print(c);
  }
  Serial.println();

  delay(1000);
}
```

---

## ⚙️ How It Works (Under the Hood)

I2C (Inter-Integrated Circuit) uses open-drain lines with pull-up resistors. The Master drives the SCL clock line and initiates every transfer by broadcasting a 7-bit slave address plus a Read/Write bit. Only the peripheral matching that address pulls the SDA line LOW to acknowledge (ACK) and communicate.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Run an I2C Scanner to automatically detect addresses of all connected peripherals.
1. Build an Arduino coprocessor that offloads intensive math calculations over I2C.
1. Chain an RTC clock (DS3231), an LCD (0x27), and an IMU (0x68) on the exact same two pins.

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [04-Displays/LCD](../../04-Displays/LCD/)**: Share SDA/SCL lines between multiple sensors and display screens simultaneously.
- **Pair with [02-Sensors/IMU](../../02-Sensors/IMU/)**: High-speed 400kHz I2C data streaming.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
