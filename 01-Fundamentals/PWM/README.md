# 🌊 Pulse Width Modulation (PWM) & Perceptual Dimming

> **"Synthesize pseudo-analog voltages using high-frequency digital square waves and master logarithmic eye perception correction."**
>
> 🌐 **Interactive Lab:** Open [`index.html`](./index.html) in any browser to explore the 490Hz carrier oscillogram, duty-cycle slider, and gamma 2.2 breathing LED glow simulator.

---

## 🎯 The Big Idea

Digital microcontrollers do not have built-in Digital-to-Analog Converters (DACs) on their general-purpose pins. They cannot output a continuous 2.5V, 1.8V, or 3.3V directly.

Instead, they synthesize an **effective average voltage** using **Pulse Width Modulation (PWM)**. By pulsing a digital pin between full 5V and 0V at approximately **490 times per second (490Hz)**, and varying the percentage of time the signal stays HIGH (the **duty cycle**), we can control motor speed, LED brightness, and heater power with high electrical efficiency.

---

## 💡 The Mental Model

- **The Rapid Light Switch**: Imagine you have a room light switch. If you leave it ON, the room is 100% bright. If you turn it OFF, it is 0% bright. Now imagine flipping that switch ON and OFF **500 times in a single second**. Your eyes cannot detect the individual flickers (the flicker fusion threshold is ~60Hz). Because the light is on half the time and off half the time, your brain perceives a steady, pleasant 50% brightness!
- **Non-Linear Human Eyes (Why 50% Doesn't Look Like 50%)**: Human vision evolved to see predators in pitch-black caves and avoid glare in bright sunlight. Our eyes are logarithmic, not linear. Setting a raw 50% duty cycle feels like 80% full brightness to a human eye. True organic, natural fading requires **gamma 2.2 trigonometric correction**.

---

## 🔌 Hardware Setup & Pinout

On the Arduino Uno, PWM pins are marked with a tilde symbol (`~`):

| Arduino Pin | Hardware Timer | Default Frequency | Wiring Destination |
| :--- | :--- | :--- | :--- |
| **`Pin ~9`** | Timer1 (16-bit) | **490 Hz** | 220Ω Resistor &rarr; LED Anode (+) |
| **`Pin ~10`** | Timer1 (16-bit) | **490 Hz** | Secondary PWM Channel |
| **`Pin ~3, ~11`** | Timer2 (8-bit) | **490 Hz** | Auxiliary PWM Channels |
| **`Pin ~5, ~6`** | Timer0 (8-bit) | **980 Hz** | High-Frequency PWM Channels |
| **`GND`** | Common Rail | 0V Return | LED Cathode Flat Edge (-) |

```
              Arduino Uno Pin ~9
                      │
                     ┌┴┐
                     │ │ 220Ω Current Limiting Resistor
                     └┬┘
                      │
                     ┌┴┐ LED Anode (Long Lead, +)
                     │▼│
                     └┬┘ LED Cathode (Flat Edge, -)
                      │
                     GND (0V)
```

---

## 🔬 How the Hardware Works (Under the Hood)

### 1. Duty Cycle Mathematics
The duty cycle $D$ is the ratio of pulse active time ($T_{on}$) to total period ($T_{total}$):
$$D = \frac{T_{on}}{T_{on} + T_{off}} \times 100\%$$

On the ATmega328P, an 8-bit timer register divides this period into **256 discrete slices (0 to 255)**:
- `analogWrite(9, 0)`: 0% Duty Cycle &rarr; **0.00V Effective**
- `analogWrite(9, 64)`: 25% Duty Cycle &rarr; **1.25V Effective**
- `analogWrite(9, 128)`: 50% Duty Cycle &rarr; **2.50V Effective**
- `analogWrite(9, 255)`: 100% Duty Cycle &rarr; **5.00V Effective**

$$\text{Effective Voltage} = 5.0\text{V} \times \left(\frac{\text{Register Value}}{255.0}\right)$$

### 2. The Gamma 2.2 Biological Correction Law
Because human eye sensitivity follows Stevens' Power Law, linear increments in duty cycle produce harsh steps at low light levels and saturate too quickly near the top.
Applying an inverse power curve:
$$\text{Brightness} = \left(\frac{\sin(\theta) + 1.0}{2.0}\right)^{2.2} \times 255.0$$
Concentrates resolution at low illumination levels, producing the smooth "breathing" glow seen on modern laptop sleep indicators.

---

## 💻 Line-by-Line Code Walkthrough

```cpp
/*
 * Module: Pulse Width Modulation (PWM) & Breathing Glow
 * Implements a non-blocking organic breathing LED pulse
 * using a trigonometric sine-wave lookup for natural perception.
 */

const int PWM_PIN = 9; // Pin 9 supports ~490Hz 8-bit timer PWM

unsigned long previousMillis = 0;
const long interval = 20; // 50 updates per second (50Hz frame rate)

float angle = 0.0;

void setup() {
  pinMode(PWM_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println(F("PWM Breathing Controller Started on Pin 9."));
}

void loop() {
  unsigned long currentMillis = millis();

  // Execute non-blocking update every 20ms
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    // 1. Convert sine (-1.0 to +1.0) into normalized range (0.0 to 1.0)
    float sinVal = (sin(angle) + 1.0) / 2.0;

    // 2. Apply Gamma 2.2 perceptual curve to match human retinal response
    int brightness = (int)(pow(sinVal, 2.2) * 255.0);

    // 3. Write to hardware timer register OCR1A
    analogWrite(PWM_PIN, brightness);

    // 4. Advance angular phase (speed of pulsation)
    angle += 0.04;
    if (angle >= 2 * PI) {
      angle = 0.0; // Reset phase
    }
  }

  // Main loop remains 100% unblocked to handle other tasks!
}
```

### Explanation Table

| Code Snippet | What It Tells Arduino to Do |
| :--- | :--- |
| `analogWrite(9, brightness)` | Sets Output Compare Register `OCR1A`. Hardware timer handles pin pulsing automatically in the background. |
| `pow(sinVal, 2.2)` | Elevates normalized sine to power 2.2, expanding dark shades and compressing bright ones. |
| `angle += 0.04` | Controls modulation speed. Increasing to `0.08` doubles breathing tempo. |
| `interval = 20` | Smooth 50 frames-per-second animation with zero visible stepping. |

---

## 🧪 Hands-On Experiments to Try

1. **Compare Linear vs Gamma Fading**: Remove the `pow(sinVal, 2.2)` term and run direct linear fading `sinVal * 255`. Compare the two visually—notice how the linear version appears to flash abruptly at the bottom and stay permanently bright at the top.
2. **DC Motor Speed Governor**: Wire a small DC motor through a 2N2222 transistor or L298N driver to Pin 9. Use `analogWrite()` to regulate rotation speed from a gentle crawl to maximum RPM.
3. **RGB Color Wheel**: Connect an RGB LED to Pins 9, 10, and 11. Modulate all three with phase-shifted sine waves to smoothly cycle through the entire rainbow spectrum.

---

## ⚠️ Common Mistakes & Troubleshooting

- **Attempting PWM on Non-PWM Pins**: Trying to call `analogWrite()` on Pins 2, 4, 7, 8, or 12 will simply output digital HIGH for values $\ge 128$ and LOW for $< 128$. Look for the tilde (`~`) symbol on your board.
- **Omission of Current-Limiting Resistor**: Wiring an LED directly to a PWM pin without a 220Ω or 330Ω resistor will overdraw current ($>40\text{mA}$), damaging the ATmega328P output pin and burning out the LED.
- **Audible Motor Whine**: At 490Hz, driving coils or inductors directly can cause audible buzzing. Overriding the timer prescaler registers to 31.25 kHz eliminates human audible coil noise.

---

## 🚀 What to Build Next

PWM is the universal physical computing standard for:
- **DC Motor H-Bridge Controllers** (autonomous robot wheel velocity)
- **RC Servomotors** (50Hz variable duty cycle angle control)
- **High-Power LED Strobes & Mood Lights**
