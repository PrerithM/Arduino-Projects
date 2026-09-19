# 📖 The Arduino Cookbook

> Pick any two modules from the list below, combine them, and you have a project. This page is your map.

---

## 🗺️ The Module Map

Every module in this repo is a self-contained building block. The chart below shows how they connect naturally.

```
┌──────────────────────────────────────────────────────────────────┐
│                     INPUTS (what detects)                        │
│  [Ultrasonic] [IR] [Temp] [Humidity] [Light] [IMU] [Distance]    │
└─────────────────────────────┬────────────────────────────────────┘
                              │  flows into
┌─────────────────────────────▼────────────────────────────────────┐
│                   PROCESSING (the Arduino brain)                 │
│  [Digital I/O] [Analog I/O] [Interrupts] [Timers] [PWM]          │
│  [UART / I2C / SPI / Bluetooth / WiFi]                           │
└──────────────┬───────────────────────────────┬───────────────────┘
               │ controls                      │ shows
┌──────────────▼───────────┐  ┌────────────────▼──────────────────┐
│   OUTPUTS (what moves)   │  │      DISPLAYS (what you see)      │
│ [LEDs] [Servo] [DC Motor]│  │ [LCD] [7-Segment] [Serial Monitor]│
│ [Stepper] [Relay] [Buzzer│  └───────────────────────────────────┘
└──────────────────────────┘
```

---

## 🍳 Suggested Recipes

### Beginner Builds (2–3 modules)

| Build | Modules | Folder Links |
|---|---|---|
| LED Dimmer | Analog I/O + PWM + LEDs | [01/Analog-IO](./01-Fundamentals/Analog-IO/) + [03/LEDs](./03-Actuators/LEDs/) |
| Distance Alarm | Ultrasonic + Buzzer | [02/Ultrasonic](./02-Sensors/Ultrasonic/) + [03/Buzzers](./03-Actuators/Buzzers/) |
| Temperature Display | Temperature + LCD | [02/Temperature](./02-Sensors/Temperature/) + [04/LCD](./04-Displays/LCD/) |
| Fan Speed Controller | Temp + PWM + DC Motor | [02/Temperature](./02-Sensors/Temperature/) + [03/DC-Motors](./03-Actuators/DC-Motors/) |

### Intermediate Builds (3–4 modules)

| Build | Modules | Folder Links |
|---|---|---|
| Parking Sensor | Ultrasonic + Buzzer + LEDs + Serial | [02/Ultrasonic](./02-Sensors/Ultrasonic/) + [03/Buzzers](./03-Actuators/Buzzers/) + [03/LEDs](./03-Actuators/LEDs/) |
| Humidity Monitor | Humidity + LCD + 7-Seg | [02/Humidity](./02-Sensors/Humidity/) + [04/LCD](./04-Displays/LCD/) |
| Bluetooth Car | Bluetooth + DC Motors + IR | [05/Bluetooth](./05-Communication/Bluetooth/) + [03/DC-Motors](./03-Actuators/DC-Motors/) |
| Smart Servo Arm | IMU + Servo + I2C | [02/IMU](./02-Sensors/IMU/) + [03/Servo](./03-Actuators/Servo/) + [05/I2C](./05-Communication/I2C/) |

### Advanced Builds (Full Automation)

| Build | Modules | Folder Links |
|---|---|---|
| Smart Room | Light + Relay + Temp + WiFi + LCD | [06/Smart-Lighting](./06-Automation/Smart-Lighting/) |
| Security System | PIR/IR + Buzzer + Relay + Bluetooth | [06/Security](./06-Automation/Security/) |
| Weather Station | Temp + Humidity + Light + WiFi + LCD | [06/Environment-Monitoring](./06-Automation/Environment-Monitoring/) |
| Line Follower Robot | IR + DC Motors + Distance + Timers | [06/Motor-Automation](./06-Automation/Motor-Automation/) |

---

## 🧩 Module Quick Reference

| Module | Key Library | Typical Pins |
|---|---|---|
| Digital I/O | Built-in | D2–D13 |
| Analog I/O | Built-in | A0–A5 |
| PWM | Built-in | D3, D5, D6, D9, D10, D11 |
| Ultrasonic HC-SR04 | `NewPing` | D2 (trig), D3 (echo) |
| DHT11/22 (Temp+Humidity) | `DHT sensor library` | D4 |
| LDR (Light) | Built-in | A0 |
| MPU6050 (IMU) | `MPU6050` / `Wire` | SDA (A4), SCL (A5) |
| SG90 Servo | `Servo` | D9 |
| L298N DC Motor | `Motor Shield` | D5, D6, D7, D8 |
| 28BYJ-48 Stepper | `Stepper` | D8–D11 |
| 16×2 LCD (I2C) | `LiquidCrystal_I2C` | SDA (A4), SCL (A5) |
| HC-05 Bluetooth | `SoftwareSerial` | D10 (RX), D11 (TX) |
| ESP8266 Wi-Fi | `ESP8266WiFi` | Serial pins |

---

*Combine freely. Document your builds. Share what you make.*
