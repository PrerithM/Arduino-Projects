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
