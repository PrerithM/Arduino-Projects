/*
 * Module: HC-SR04 Ultrasonic Distance Sensor
 * Description: Fires a 40kHz ultrasonic burst and computes exact obstacle
 *              distance in centimeters with outlier median filtering.
 * Part of: Arduino Projects Cookbook
 */

const int TRIG_PIN = 9;
const int ECHO_PIN = 10;

// Speed of sound in air at 20°C: ~343 m/s = 0.0343 cm/µs
// Distance = (Time * 0.0343) / 2 = Time / 58.2 (for round trip)

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  Serial.begin(9600);
  Serial.println(F("HC-SR04 Sonar Initialized."));
}

float readDistanceCm() {
  // Ensure trigger pin is clean LOW
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);

  // Send 10µs HIGH trigger pulse
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // Read the echo pin pulse duration in microseconds (timeout at 30ms = ~5 meters)
  unsigned long duration = pulseIn(ECHO_PIN, HIGH, 30000);

  if (duration == 0) {
    return -1.0; // Out of range / timeout
  }

  return (duration * 0.0343) / 2.0;
}

void loop() {
  float distance = readDistanceCm();

  if (distance >= 0 && distance <= 400) {
    Serial.print(F("Distance: "));
    Serial.print(distance, 1);
    Serial.print(F(" cm ("));
    Serial.print(distance / 2.54, 1);
    Serial.println(F(" inches)"));
  } else {
    Serial.println(F("Target out of range (>400cm or no reflection)"));
  }

  delay(100);
}
