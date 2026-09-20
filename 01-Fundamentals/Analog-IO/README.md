# 🎛️ Analog Input / Output (ADC & Voltage Sampling)

> **"Turn a real-world continuous knob into discrete numbers your microcontroller can understand."**
>
> 🌐 **Interactive Lab:** Open [`index.html`](./index.html) in any browser to test the live potentiometer simulator, moving average filter, and real-time waveform chart.

---

## 🎯 The Big Idea

Computers are fundamentally digital—they only speak in binary zeros and ones (0V and 5V). But the physical world is continuous and analog: sound, temperature, light, and pressure change smoothly along infinite gradations.

This module demonstrates how the Arduino Uno uses its internal **10-bit Analog-to-Digital Converter (ADC)** to read continuous voltages between **0.00V and 5.00V**, converts them into discrete integers (**0 to 1023**), and applies a **10-sample circular moving average filter** to eliminate electrical noise.

---

## 💡 The Mental Model

Imagine a water faucet connected to a pipe:

- **Turning the faucet closed** shuts off water pressure completely (**0V / 0 counts**).
- **Turning the faucet wide open** releases maximum water pressure (**5V / 1023 counts**).
- **Halfway open** delivers exactly half pressure (**2.5V / 512 counts**).

The potentiometer acts as this faucet for electrical pressure (voltage). Pin **A0** acts as the Arduino's digital pressure gauge, taking a measurement every 100 milliseconds.

---

## 🔌 Hardware Setup & Pinout

You only need **three wires** to wire up this experiment:

| Arduino Pin       | Potentiometer Terminal     | Function         | Description                                |
| :---------------- | :------------------------- | :--------------- | :----------------------------------------- |
| **`5V`**  | Outer Terminal (Pin 1)     | Power Rail       | Supplies +5.0V reference potential         |
| **`A0`**  | Center Wiper (Pin 2)       | Analog Input     | Variable voltage divided between 0V and 5V |
| **`GND`** | Opposite Outer Leg (Pin 3) | Ground Reference | Common 0V reference return                 |

```
       +5V Rail ─────────┐ (Outer Leg)
                         │
                      ┌──┴──┐
   Shaft Rotation ──► │ 10k │ ◄── Carbon Resistive Track
                      └──┬──┘
                         │ (Center Wiper) ──► Connect to Arduino Pin A0
                         │
       GND (0V) ─────────┘ (Outer Leg)
```

---

## 🔬 How the Hardware Works (Under the Hood)

### 1. The Voltage Divider Law

A 10kΩ potentiometer divides the total resistance $R_{total} = R_1 + R_2$. The center wiper taps off a fraction of that voltage:

$$
V_{out} = V_{in} \times \frac{R_2}{R_1 + R_2}
$$

### 2. The 10-Bit ADC Mystery (Why 0 to 1023?)

The ATmega328P microcontroller has a **10-bit Successive Approximation ADC**.

- "10-bit" means $2^{10} = 1024$ discrete measurement steps.
- Counting starts at 0, so the numbers range from **0 to 1023**.
- Each step corresponds to:
  $$
  \text{Resolution} = \frac{5.000\text{ V}}{1024} \approx 4.887\text{ mV per step}
  $$

### 3. Converting Raw ADC to Physical Voltage

To reconstruct the real-world voltage in firmware:

$$
\text{Voltage} = \frac{\text{Raw ADC Value} \times 5.0}{1023.0}
$$

For example, if `analogRead(A0)` returns **512**:

$$
\text{Voltage} = \frac{512 \times 5.0}{1023.0} \approx 2.50\text{ Volts}
$$

### 4. Digital Noise Filtering (10-Sample Moving Average)

Breadboard wires act like tiny antennas picking up electrical interference from room lights and Wi-Fi. An unfiltered reading might jump: `501 → 509 → 502 → 507`.
By storing the last 10 readings in a circular buffer and computing the rolling average:

$$
\bar{x} = \frac{1}{10} \sum_{i=0}^{9} x_i
$$

We smooth out random fluctuations in constant $O(1)$ time.

---

## 💻 Line-by-Line Code Walkthrough

```cpp
/*
 * Module: Analog I/O & Continuous Voltage Measurement
 * Reads a 10k potentiometer via A0 with a 10-sample moving average filter.
 */

const int ANALOG_PIN = A0;
const int NUM_READINGS = 10;

int readings[NUM_READINGS]; // Circular buffer for rolling samples
int readIndex = 0;          // Current position in the ring buffer
long total = 0;             // Running accumulator sum

void setup() {
  Serial.begin(9600);
  
  // Zero out the buffer at boot
  for (int i = 0; i < NUM_READINGS; i++) {
    readings[i] = 0;
  }

  Serial.println(F("Analog Reading Initialized."));
  Serial.println(F("Raw (0-1023)\tVoltage (V)\tPercent (%)"));
}

void loop() {
  // 1. Subtract the oldest sample from running sum
  total = total - readings[readIndex];

  // 2. Read the latest voltage level from analog pin A0
  readings[readIndex] = analogRead(ANALOG_PIN);

  // 3. Add the new sample to running sum
  total = total + readings[readIndex];

  // 4. Wrap around circular buffer index
  readIndex = (readIndex + 1) % NUM_READINGS;

  // 5. Calculate smoothed average
  int averageRaw = total / NUM_READINGS;

  // 6. Convert to real-world volts (0.00V to 5.00V)
  float voltage = (averageRaw * 5.0) / 1023.0;

  // 7. Map to percentage (0% to 100%)
  int percentage = map(averageRaw, 0, 1023, 0, 100);

  // 8. Stream telemetry to Serial Monitor
  Serial.print(averageRaw);
  Serial.print(F("\t\t"));
  Serial.print(voltage, 2);
  Serial.print(F(" V\t\t"));
  Serial.print(percentage);
  Serial.println(F(" %"));

  delay(100); // 10Hz refresh rate
}
```

### Explanation Table

| Code Snippet                            | What It Tells Arduino to Do                                                        |
| :-------------------------------------- | :--------------------------------------------------------------------------------- |
| `analogRead(A0)`                      | Connects internal ADC channel to A0, samples voltage, and returns integer 0–1023. |
| `total = total - readings[readIndex]` | Drops the oldest stored reading from the sum before replacing it.                  |
| `readIndex = (readIndex + 1) % 10`    | The modulo operator`%` automatically resets index to 0 when it reaches 10.       |
| `(averageRaw * 5.0) / 1023.0`         | Converts integer steps into human-readable floating point volts.                   |
| `map(averageRaw, 0, 1023, 0, 100)`    | Linearly re-scales the 0–1023 range into 0–100%.                                 |

---

## 🧪 Hands-On Experiments to Try

1. **Threshold Voltage Alarm**: Add an LED to Pin 13. Write an `if (voltage > 3.50)` condition that lights the LED only when the knob is turned past 70%.
2. **Reverse Direction**: Swap the `5V` and `GND` wires on the outer potentiometer legs. Notice how clockwise rotation now decreases voltage instead of increasing it.
3. **Change Filter Window**: Change `NUM_READINGS` from 10 to 30. Observe how the output becomes rock-steady, but slightly lags rapid hand twists.

---

## ⚠️ Common Mistakes & Troubleshooting

- **Floating Pin (Erratic numbers when not touching the knob)**: If numbers randomly jump between 100 and 800, check if the middle pin wire came loose from breadboard terminal `A0`.
- **Integer Division Trap**: Writing `voltage = rawValue * (5 / 1023)` will always produce `0.0V`! In C++, `5 / 1023` is integer division which truncates to 0. Always write `5.0 / 1023.0`.
- **Swapping Middle and Outer Pins**: If the potentiometer gets hot or only changes between 0 and 1023 at the extreme ends, you connected 5V and GND to the middle pin. The wiper must always be the center pin.

---

## 🚀 What to Build Next

This analog sampling technique is the exact foundation used in:

- **Audio Equalizers & Mixers** (slide faders)
- **Robotic Arm Joy-Sticks** (two potentiometers for X and Y axis control)
- **Sensor Interfaces** (Light-dependent resistors, thermistors, and gas sensors are all analog voltage dividers!)
