# Pulse Width Modulation (PWM Fading & Motor Speed)

> Simulate analog output voltages on digital pins by rapidly pulsing square waves with variable duty cycles.

---

## 🎯 What You'll Learn
- How duty cycle translates to perceived DC voltage (0 - 255 = 0% - 100%)
- Identifying hardware PWM pins on Arduino Uno (Pins 3, 5, 6, 9, 10, 11)
- Creating smooth non-linear gamma-corrected breathing effects

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| Arduino Uno / Nano | 1 | Main board |
| LED (5mm or 10mm) | 1 | High brightness LED |
| 220Ω Resistor | 1 | Current limiting resistor |
| Breadboard & Jumper Wires | 1 set | Connections |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `D9 (~PWM)` | `LED Anode (+ through 220Ω)` | PWM Signal Output |
| `GND` | `LED Cathode (-)` | Ground rail |


---

## 📐 Circuit & Wiring Diagram

```text
+-----------------+
    |   Arduino Uno   |
    |                 |
    |        D9 (~PWM)|--------[ 220Ω Resistor ]----->| (LED) ----+
    |                 |                               (Anode/Cathode) |
    |             GND |-----------------------------------------------+
    +-----------------+
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`pwm.ino`](./pwm.ino).

```cpp
/*
 * Module: Pulse Width Modulation (PWM) & Breathing Glow
 * Description: Implements a non-blocking organic breathing LED pulse
 *              using a trigonometric sine-wave lookup for natural perception.
 * Part of: Arduino Projects Cookbook
 */

const int PWM_PIN = 9; // Pin 9 supports ~490Hz 8-bit timer PWM

unsigned long previousMillis = 0;
const long interval = 20; // 50 updates per second

float angle = 0.0;

void setup() {
  pinMode(PWM_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println(F("PWM Breathing Controller Started on Pin 9."));
}

void loop() {
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    // Human eye responds logarithmically to light brightness.
    // A sine wave provides smooth deceleration at peaks and troughs.
    float sinVal = (sin(angle) + 1.0) / 2.0; // Scale -1..1 to 0.0..1.0
    int brightness = (int)(pow(sinVal, 2.2) * 255.0); // Gamma 2.2 correction

    analogWrite(PWM_PIN, brightness);

    angle += 0.04;
    if (angle >= 2 * PI) {
      angle = 0.0;
    }
  }
}
```

---

## ⚙️ How It Works (Under the Hood)

Arduino pins cannot output true analog voltages without an external DAC. Instead, `analogWrite()` switches the pin between 0V and 5V at approximately 490 Hz (or 980 Hz on pins 5/6). The proportion of ON time vs OFF time (the duty cycle) determines the average power delivered. Because human vision perceives brightness logarithmically, applying a gamma exponent (2.2) ensures perceived brightness changes smoothly.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Change the breathing speed based on an external analog sensor value.
1. Directly configure ATmega Timer1 registers (TCCR1A / TCCR1B) to generate a 25kHz PWM signal for quiet fan control.
1. Create an RGB mood light blending Red, Green, and Blue over three PWM channels.

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [03-Actuators/DC-Motors](../../03-Actuators/DC-Motors/)**: Control DC motor rotational velocity using an H-Bridge enable pin tied to PWM.
- **Pair with [02-Sensors/Light](../../02-Sensors/Light/)**: Automatically adjust room ambient lighting in response to LDR readings.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
