/*
 * Project: Autonomous Obstacle-Avoiding Robotic Rover
 * Description: Navigates environments autonomously by panning a sonar radar,
 *              detecting obstacles, and choosing the path with maximum clearance.
 * Part of: Arduino Projects Cookbook
 */

#include <Servo.h>

// Motor Pins
const int ENA = 5;
const int IN1 = 7;
const int IN2 = 8;
const int ENB = 6;
const int IN3 = 12;
const int IN4 = 13;

// Sensor & Servo Pins
const int TRIG_PIN  = 9;
const int ECHO_PIN  = 10;
const int SERVO_PIN = 11;

Servo headServo;

const int SAFE_DISTANCE_CM = 25; // Stop if obstacle closer than 25cm
const int MOTOR_SPEED = 180;

float readDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  unsigned long d = pulseIn(ECHO_PIN, HIGH, 25000);
  if (d == 0) return 999.0;
  return (d * 0.0343) / 2.0;
}

void moveForward() {
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);
  analogWrite(ENA, MOTOR_SPEED); analogWrite(ENB, MOTOR_SPEED);
}

void moveBackward() {
  digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);
  digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH);
  analogWrite(ENA, MOTOR_SPEED); analogWrite(ENB, MOTOR_SPEED);
}

void turnLeft(int ms) {
  digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);
  digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);
  analogWrite(ENA, MOTOR_SPEED); analogWrite(ENB, MOTOR_SPEED);
  delay(ms);
}

void turnRight(int ms) {
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH);
  analogWrite(ENA, MOTOR_SPEED); analogWrite(ENB, MOTOR_SPEED);
  delay(ms);
}

void stopMotors() {
  digitalWrite(IN1, LOW); digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW); digitalWrite(IN4, LOW);
  analogWrite(ENA, 0); analogWrite(ENB, 0);
}

void setup() {
  pinMode(ENA, OUTPUT); pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(ENB, OUTPUT); pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
  pinMode(TRIG_PIN, OUTPUT); pinMode(ECHO_PIN, INPUT);

  headServo.attach(SERVO_PIN);
  headServo.write(90); // Look straight ahead

  Serial.begin(9600);
  Serial.println(F("Autonomous Rover Online. Starting in 3s..."));
  delay(3000);
}

void loop() {
  headServo.write(90); // Look ahead
  delay(50);
  float distanceAhead = readDistance();

  if (distanceAhead > SAFE_DISTANCE_CM) {
    moveForward();
  } else {
    // Obstacle encountered!
    stopMotors();
    moveBackward();
    delay(300);
    stopMotors();

    // Look Left
    headServo.write(150);
    delay(300);
    float distanceLeft = readDistance();

    // Look Right
    headServo.write(30);
    delay(400);
    float distanceRight = readDistance();

    headServo.write(90); // Reset head
    delay(200);

    // Decision
    if (distanceLeft > distanceRight && distanceLeft > SAFE_DISTANCE_CM) {
      Serial.println(F("Turning Left towards open space"));
      turnLeft(400);
    } else if (distanceRight > SAFE_DISTANCE_CM) {
      Serial.println(F("Turning Right towards open space"));
      turnRight(400);
    } else {
      Serial.println(F("Dead end! Doing 180° turn"));
      turnRight(800);
    }
  }
  delay(50);
}
