# Alphanumeric 16x2 LCD Display (I2C Backpack)

> Display clear text, sensor readings, and custom pixel icons using just 2 I2C wires instead of 16 parallel pins.

---

## 🎯 What You'll Learn
- HD44780 LCD controller architecture and PCF8574 I2C expander backpacks
- Formatting fixed-width strings and clearing flicker without clear()
- Designing custom 5x8 pixel bitmap glyphs (battery, heart, degree symbol)

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| Arduino Uno / Nano | 1 | Main board |
| 16x2 Character LCD with I2C Backpack | 1 | Liquid crystal display (0x27 or 0x3F address) |
| Breadboard & Jumpers | 1 set | Connections |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `5V` | `VCC` | 5V Power |
| `GND` | `GND` | Ground |
| `A4` | `SDA` | I2C Serial Data |
| `A5` | `SCL` | I2C Serial Clock |


---

## 📐 Circuit & Wiring Diagram

```text
+-----------------+              +-------------------------------+
    |   Arduino Uno   |              |  16x2 Character LCD (I2C)     |
    |                 |              |  +-------------------------+  |
    |              5V |=============>|  | ARDUINO COOKBOOK!       |  |
    |             GND |=============>|  | Temp: 24.5C  Hum: 60%   |  |
    |        A4 (SDA) |<------------>|  +-------------------------+  |
    |        A5 (SCL) |------------->|  [ VCC  GND  SDA  SCL ]       |
    +-----------------+              +-------------------------------+
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`lcd_display.ino`](./lcd_display.ino).

```cpp
/*
 * Module: 16x2 Character LCD with I2C Backpack
 * Description: Displays sensor metrics, animated text scroll, and custom
 *              pixel glyphs on an HD44780 LCD using I2C.
 * Requires: LiquidCrystal_I2C library by Frank de Brabander
 * Part of: Arduino Projects Cookbook
 */

#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// Set the LCD I2C address (commonly 0x27 or 0x3F) for a 16 chars and 2 line display
LiquidCrystal_I2C lcd(0x27, 16, 2);

// Custom Heart Icon (5x8 pixel bitmap)
byte heartIcon[8] = {
  0b00000,
  0b01010,
  0b11111,
  0b11111,
  0b01110,
  0b00100,
  0b00000,
  0b00000
};

void setup() {
  lcd.init();
  lcd.backlight();

  // Create custom character at slot 0
  lcd.createChar(0, heartIcon);

  lcd.setCursor(0, 0);
  lcd.print(F("ARDUINO COOKBOOK"));
  lcd.setCursor(0, 1);
  lcd.print(F("Made with "));
  lcd.write(0); // Display custom heart
  lcd.print(F(" by Makers"));

  delay(2500);
  lcd.clear();
}

void loop() {
  // Example telemetry simulation
  float simulatedTemp = 24.5 + sin(millis() / 5000.0) * 3.0;
  int simulatedHum  = 55 + (int)(cos(millis() / 4000.0) * 10);

  // Line 1: Static label + dynamic reading
  lcd.setCursor(0, 0);
  lcd.print(F("Temp: "));
  lcd.print(simulatedTemp, 1);
  lcd.print(F((char)223)); // Built-in degree symbol
  lcd.print(F("C   "));   // Trailing spaces clear old characters without flicker!

  // Line 2: Humidity + Uptime
  lcd.setCursor(0, 1);
  lcd.print(F("Hum: "));
  lcd.print(simulatedHum);
  lcd.print(F("% | Up:"));
  lcd.print(millis() / 1000);
  lcd.print(F("s  "));

  delay(500);
}
```

---

## ⚙️ How It Works (Under the Hood)

The classic HD44780 parallel interface requires 6 to 10 pins. An I2C backpack contains a PCF8574 I/O expander chip that converts I2C serial packets from pins A4/A5 into the required parallel pin toggles, reducing wiring down to just 4 connections.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Create a horizontal bar graph using custom 5x8 pixel block characters to show progress.
1. Build a 2-button scrollable menu system with cursor selection.
1. Run an I2C scanner sketch if your display shows blank boxes to confirm its hex address (0x27 vs 0x3F).

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [02-Sensors/Temperature](../../02-Sensors/Temperature/)**: Build a standalone digital room thermometer and weather station.
- **Pair with [06-Automation/Security](../../06-Automation/Security/)**: Display armed/disarmed status and password entry prompt.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
