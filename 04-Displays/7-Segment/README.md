# 4-Digit 7-Segment Display (TM1637 Driver)

> Display bright numeric clocks, stopwatches, sensor values, and counter meters visible from across the room.

---

## 🎯 What You'll Learn
- Multiplexed 7-segment LED cathode/anode matrix layouts
- TM1637 two-wire serial interface protocol (CLK and DIO)
- Formatting integer clocks with center colon blinking

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| Arduino Uno / Nano | 1 | Main board |
| TM1637 4-Digit 7-Segment Display Module | 1 | Red/Green/Blue 0.36" LED display module |
| Breadboard & Jumpers | 1 set | Connections |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `5V` | `VCC` | 5V Power |
| `GND` | `GND` | Ground |
| `D2` | `CLK` | Clock line |
| `D3` | `DIO` | Data line |


---

## 📐 Circuit & Wiring Diagram

```text
+-----------------+              +----------------------+
    |   Arduino Uno   |              |  TM1637 4-Digit 7-Seg|
    |                 |              |  +----------------+  |
    |              5V |=============>|  | [1][2]:[3][4]  |  |
    |             GND |=============>|  +----------------+  |
    |              D2 |------------->| CLK                  |
    |              D3 |<------------>| DIO                  |
    +-----------------+              +----------------------+
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`seven_segment.ino`](./seven_segment.ino).

```cpp
/*
 * Module: TM1637 4-Digit 7-Segment Display
 * Description: Displays a digital running stopwatch clock with blinking colons
 *              and integer temperature readouts.
 * Requires: TM1637Display library by Avishay Orpaz
 * Part of: Arduino Projects Cookbook
 */

#include <TM1637Display.h>

const int CLK_PIN = 2;
const int DIO_PIN = 3;

TM1637Display display(CLK_PIN, DIO_PIN);

void setup() {
  display.setBrightness(0x0a); // Brightness range: 0x00 (dim) to 0x0f (bright)
  display.clear();
}

void loop() {
  // Example: Display Running Clock (MM:SS)
  unsigned long totalSeconds = millis() / 1000;
  int minutes = (totalSeconds / 60) % 60;
  int seconds = totalSeconds % 60;

  // Format as MMSS integer (e.g., 02:45 -> 245)
  int displayValue = (minutes * 100) + seconds;

  // Toggle center colon every half second (0x40 bit in dots mask)
  bool showColon = (millis() / 500) % 2;
  uint8_t colonMask = showColon ? 0b01000000 : 0b00000000;

  // display.showNumberDecEx(value, dots_mask, leading_zeros, length, pos)
  display.showNumberDecEx(displayValue, colonMask, true, 4, 0);

  delay(100);
}
```

---

## ⚙️ How It Works (Under the Hood)

Driving 4 multiplexed 7-segment displays directly requires 12 pins and constant CPU refresh cycles. The TM1637 chip includes internal display RAM and an 8-step brightness driver that automatically refreshes the LEDs, freeing up the Arduino CPU completely.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Display scrolling text messages using custom 7-segment character lookup tables.
1. Build a countdown kitchen timer with pause and reset buttons.
1. Display negative temperatures with a leading minus sign.

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [02-Sensors/Ultrasonic](../../02-Sensors/Ultrasonic/)**: Build a digital laser or sonar ruler that shows distance directly in centimeters.
- **Pair with [06-Automation/Motor-Automation](../../06-Automation/Motor-Automation/)**: Display remaining loop counts for automated robotic cycles.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
