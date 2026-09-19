/*
 * Module: Infrared (IR) Proximity & Obstacle Sensor
 * Description: Monitors infrared reflectance for proximity alerts
 *              and line-tracking navigation.
 * Part of: Arduino Projects Cookbook
 */

const int IR_PIN  = 3;
const int LED_PIN = 13;

void setup() {
  pinMode(IR_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println(F("IR Proximity Sensor Active."));
}

void loop() {
  // Most IR modules output LOW when an obstacle reflects IR light
  int obstacleDetected = (digitalRead(IR_PIN) == LOW);

  digitalWrite(LED_PIN, obstacleDetected ? HIGH : LOW);

  if (obstacleDetected) {
    Serial.println(F(">>> OBSTACLE DETECTED! <<<"));
  } else {
    Serial.println(F("Path Clear."));
  }

  delay(100);
}
