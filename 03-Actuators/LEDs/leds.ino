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
