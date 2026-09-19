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
