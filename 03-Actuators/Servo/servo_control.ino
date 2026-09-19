/*
 * Module: SG90 / MG996R Precision RC Servo Control
 * Description: Sweeps a micro-servo smoothly between 0° and 180°
 *              using non-blocking incremental velocity control.
 * Part of: Arduino Projects Cookbook
 */

#include <Servo.h>

Servo myServo;

const int SERVO_PIN = 9;
int currentPos = 0;
int targetPos  = 180;
int step = 1;

unsigned long prevMillis = 0;
const int speedDelay = 15; // Lower = faster sweep, Higher = smooth slow motion

void setup() {
  // Attaches the servo on pin 9 with standard 544µs - 2400µs pulse limits
  myServo.attach(SERVO_PIN, 544, 2400);
  myServo.write(0);
  Serial.begin(9600);
  Serial.println(F("Servo Controller Active."));
}

void loop() {
  unsigned long now = millis();

  if (now - prevMillis >= speedDelay) {
    prevMillis = now;

    currentPos += step;
    myServo.write(currentPos);

    if (currentPos >= 180) {
      step = -1; // Reverse direction
      Serial.println(F("Reached 180° -> Sweeping to 0°"));
    } else if (currentPos <= 0) {
      step = 1;
      Serial.println(F("Reached 0° -> Sweeping to 180°"));
    }
  }
}
