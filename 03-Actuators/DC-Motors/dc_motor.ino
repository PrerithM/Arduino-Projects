/*
 * Module: L298N H-Bridge DC Motor Driver
 * Description: Controls forward/reverse rotation and smooth PWM acceleration
 *              of a DC motor while protecting the microcontroller.
 * Part of: Arduino Projects Cookbook
 */

const int ENA_PIN = 5; // PWM pin for speed control
const int IN1_PIN = 7; // Direction logic 1
const int IN2_PIN = 8; // Direction logic 2

void setup() {
  pinMode(ENA_PIN, OUTPUT);
  pinMode(IN1_PIN, OUTPUT);
  pinMode(IN2_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println(F("DC Motor Driver Initialized."));
}

void setMotor(int speed, bool forward) {
  // Set direction
  if (forward) {
    digitalWrite(IN1_PIN, HIGH);
    digitalWrite(IN2_PIN, LOW);
  } else {
    digitalWrite(IN1_PIN, LOW);
    digitalWrite(IN2_PIN, HIGH);
  }

  // Set speed (0 - 255)
  analogWrite(ENA_PIN, constrain(abs(speed), 0, 255));
}

void stopMotor() {
  digitalWrite(IN1_PIN, LOW);
  digitalWrite(IN2_PIN, LOW);
  analogWrite(ENA_PIN, 0);
}

void loop() {
  Serial.println(F("Ramping Forward..."));
  for (int spd = 50; spd <= 255; spd += 5) {
    setMotor(spd, true);
    delay(30);
  }

  delay(1000);
  stopMotor();
  delay(500);

  Serial.println(F("Ramping Reverse..."));
  for (int spd = 50; spd <= 255; spd += 5) {
    setMotor(spd, false);
    delay(30);
  }

  delay(1000);
  stopMotor();
  delay(1000);
}
