/*
 * Module: VL53L0X Time-of-Flight (ToF) Laser Distance Sensor
 * Description: Emits invisible 940nm laser photons and measures picosecond
 *              flight durations to achieve millimeter precision ranging.
 * Requires: Adafruit_VL53L0X library (Arduino Library Manager)
 * Part of: Arduino Projects Cookbook
 */

#include <Wire.h>
#include "Adafruit_VL53L0X.h"

Adafruit_VL53L0X lox = Adafruit_VL53L0X();

void setup() {
  Serial.begin(115200);
  while (!Serial) delay(1); // Wait for Serial Monitor on Leonardo/ESP32

  Serial.println(F("Initializing VL53L0X Laser Ranging Sensor..."));
  if (!lox.begin()) {
    Serial.println(F("Failed to boot VL53L0X! Check wiring and pullups."));
    while (1);
  }
  Serial.println(F("VL53L0X Online and Ready."));
}

void loop() {
  VL53L0X_RangingMeasurementData_t measure;
  
  lox.rangingTest(&measure, false); // Pass 'true' for diagnostic debug prints

  if (measure.RangeStatus != 4) { // Phase failures = 4 (out of range)
    Serial.print(F("Laser Distance: "));
    Serial.print(measure.RangeMilliMeter);
    Serial.print(F(" mm ("));
    Serial.print(measure.RangeMilliMeter / 10.0, 1);
    Serial.println(F(" cm)"));
  } else {
    Serial.println(F("Laser target out of range (>2000mm)"));
  }

  delay(100);
}
