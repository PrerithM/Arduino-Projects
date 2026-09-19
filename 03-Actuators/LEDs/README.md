# LED Sequences & Addressable WS2812B NeoPixels

> Create visual indicators, traffic light sequences, and control millions of colors with single-wire addressable RGB LEDs.

---

## 🎯 What You'll Learn
- Current calculation: I = (Vsource - Vled) / R
- Controlling individual color channels in WS2812B / NeoPixel arrays
- Single-wire 800kHz precision timing protocols

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| Arduino Uno / Nano | 1 | Main board |
| WS2812B / NeoPixel Ring (8 or 16 LEDs) or 3x Discrete LEDs | 1 | RGB LED module |
| 330Ω Resistor & 1000µF Capacitor | 1 each | Protection components for NeoPixels |
| Breadboard & Jumpers | 1 set | Connections |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `5V` | `NeoPixel VCC` | 5V Power |
| `D6` | `NeoPixel DIN (via 330Ω)` | High-speed 800kHz data signal |
| `GND` | `NeoPixel GND` | Ground |


---

## 📐 Circuit & Wiring Diagram

```text
+-----------------+              +----------------------+
    |   Arduino Uno   |              |  WS2812B NeoPixel    |
    |                 |              |  [RGB] [RGB] [RGB]   |
    |              5V |=============>| VCC                  |
    |              D6 |---[ 330Ω ]-->| DIN                  |
    |             GND |=============>| GND                  |
    +-----------------+              +----------------------+
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`leds.ino`](./leds.ino).

```cpp
/*
 * Module: WS2812B / NeoPixel Addressable RGB LEDs
 * Description: Animates a smooth rainbow chase cycle across an addressable
 *              LED strip using only 1 digital output pin.
 * Requires: Adafruit_NeoPixel library (Arduino Library Manager)
 * Part of: Arduino Projects Cookbook
 */

#include <Adafruit_NeoPixel.h>

#define LED_PIN    6
#define LED_COUNT  8

Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  strip.begin();
  strip.show(); // Initialize all pixels to 'off'
  strip.setBrightness(50); // Set brightness to ~20% to save power
}

// Generate rainbow colors across 0-255 spectrum
uint32_t Wheel(byte WheelPos) {
  WheelPos = 255 - WheelPos;
  if (WheelPos < 85) {
    return strip.Color(255 - WheelPos * 3, 0, WheelPos * 3);
  }
  if (WheelPos < 170) {
    WheelPos -= 85;
    return strip.Color(0, WheelPos * 3, 255 - WheelPos * 3);
  }
  WheelPos -= 170;
  return strip.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
}

void loop() {
  // Rainbow cycle animation
  for (long firstPixelHue = 0; firstPixelHue < 5 * 65536; firstPixelHue += 256) {
    for (int i = 0; i < strip.numPixels(); i++) {
      int pixelHue = firstPixelHue + (i * 65536L / strip.numPixels());
      strip.setPixelColor(i, strip.gamma32(strip.ColorHSV(pixelHue)));
    }
    strip.show();
    delay(10);
  }
}
```

---

## ⚙️ How It Works (Under the Hood)

Each WS2812B LED contains integrated Red, Green, and Blue diodes alongside an embedded driver IC. 24 bits of color data (8 bits per color) are streamed into the first pixel; it strips off its 24 bits and regenerates the signal to pass the remaining bits down the chain.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Build a real-time VU audio meter with a microphone sensor module.
1. Create a custom Knight Rider / Cylon bouncing red scanner effect.
1. Implement a visual status indicator that shifts from green to red based on temperature.

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [02-Sensors/Ultrasonic](../../02-Sensors/Ultrasonic/)**: Light up more LED segments as an obstacle approaches.
- **Pair with [06-Automation/Smart-Lighting](../../06-Automation/Smart-Lighting/)**: Create an animated sunrise wake-up lamp.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
