# Electromechanical Relay Switching (High-Voltage AC Control)

> Safely switch high-voltage mains AC appliances (120V/240V lamps, fans, heaters) with galvanic optocoupler isolation.

---

## 🎯 What You'll Learn
- Optoisolator galvanic barrier protection between 5V micro and 240V mains
- Normally Open (NO) vs Normally Closed (NC) relay contacts
- Snubber circuits and preventing AC inductive inductive kickback

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| Arduino Uno / Nano | 1 | Main board |
| 5V 1-Channel (or 4-Channel) Relay Module | 1 | Optocoupler isolated relay board (10A 250VAC rated) |
| LED / Low-voltage DC Test Load | 1 | For safe prototyping |
| Breadboard & Jumpers | 1 set | Connections |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `5V` | `VCC` | 5V Power |
| `GND` | `GND` | Ground |
| `D4` | `IN` | Relay Control Signal (Often Active LOW) |


---

## 📐 Circuit & Wiring Diagram

```text
+-----------------+              +----------------------+
    |   Arduino Uno   |              |  5V Opto Relay Board |
    |                 |              |                      |
    |              5V |=============>| VCC       [ COM ]----+==== [ High Voltage ]
    |              D4 |------------->| IN        [  NO ]----+==== [   Load / AC  ]
    |             GND |=============>| GND       [  NC ]    |
    +-----------------+              +----------------------+
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`relay_control.ino`](./relay_control.ino).

```cpp
/*
 * Module: 5V Optoisolated Relay Module
 * Description: Switches high-power external loads with safe optocoupler
 *              isolation and duty-cycle interval timing.
 * Part of: Arduino Projects Cookbook
 */

const int RELAY_PIN = 4;

// NOTE: Most relay modules are ACTIVE LOW (writing LOW energizes the coil)
const int RELAY_ON  = LOW;
const int RELAY_OFF = HIGH;

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, RELAY_OFF); // Ensure relay starts in safe OFF state

  Serial.begin(9600);
  Serial.println(F("Relay Controller Armed and Safe."));
}

void loop() {
  Serial.println(F("Relay: ENERGIZING COIL (Switch Closed - Load ON)"));
  digitalWrite(RELAY_PIN, RELAY_ON);
  delay(3000);

  Serial.println(F("Relay: DE-ENERGIZING COIL (Switch Open - Load OFF)"));
  digitalWrite(RELAY_PIN, RELAY_OFF);
  delay(3000);
}
```

---

## ⚙️ How It Works (Under the Hood)

When pin D4 goes LOW, an internal infrared LED inside an optocoupler illuminates a phototransistor. This energizes an electromagnet coil, physically pulling a spring-loaded mechanical contact from the Normally Closed (NC) pin to the Normally Open (NO) terminal. The optocoupler ensures that high voltage spikes on the AC side can never physically cross over to the Arduino.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Implement a cycle-timer that runs a water pump for 30 seconds every 4 hours.
1. Build a zero-cross solid-state relay (SSR) controller for noise-free silent switching.
1. Add a physical manual override push button with LED status indication.

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [06-Automation/Smart-Lighting](../../06-Automation/Smart-Lighting/)**: Automate home ceiling lamps based on ambient brightness and motion.
- **Pair with [02-Sensors/Temperature](../../02-Sensors/Temperature/)**: Control an AC space heater or aquarium cooler based on water temperature.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
