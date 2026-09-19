/*
 * Module: 28BYJ-48 Stepper Motor with ULN2003 Driver
 * Description: Rotates an exact number of steps and degrees in full and
 *              half-stepping modes for precision mechanisms.
 * Requires: Stepper library (Built into Arduino IDE)
 * Part of: Arduino Projects Cookbook
 */

#include <Stepper.h>

// 28BYJ-48 has 32 steps per internal motor revolution, with a 64:1 gear ratio.
// Total steps per output shaft revolution = 32 * 64 = 2048 full steps.
const int STEPS_PER_REV = 2048;

// Pin sequencing for ULN2003 (Notice order 1, 3, 2, 4 is required by standard Stepper lib)
Stepper myStepper(STEPS_PER_REV, 8, 10, 9, 11);

void setup() {
  myStepper.setSpeed(10); // 10 RPM
  Serial.begin(9600);
  Serial.println(F("Stepper Motor Controller Ready."));
}

void loop() {
  Serial.println(F("Rotating 1 Full Revolution Clockwise (360°)..."));
  myStepper.step(STEPS_PER_REV);
  delay(1000);

  Serial.println(F("Rotating Half Revolution Counter-Clockwise (180°)..."));
  myStepper.step(-STEPS_PER_REV / 2);
  delay(1000);
}
