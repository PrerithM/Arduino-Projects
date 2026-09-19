/*
 * Module: Pulse Width Modulation (PWM) & Breathing Glow
 * Description: Implements a non-blocking organic breathing LED pulse
 *              using a trigonometric sine-wave lookup for natural perception.
 * Part of: Arduino Projects Cookbook
 */

const int PWM_PIN = 9; // Pin 9 supports ~490Hz 8-bit timer PWM

unsigned long previousMillis = 0;
const long interval = 20; // 50 updates per second

float angle = 0.0;

void setup() {
  pinMode(PWM_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println(F("PWM Breathing Controller Started on Pin 9."));
}

void loop() {
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    // Human eye responds logarithmically to light brightness.
    // A sine wave provides smooth deceleration at peaks and troughs.
    float sinVal = (sin(angle) + 1.0) / 2.0; // Scale -1..1 to 0.0..1.0
    int brightness = (int)(pow(sinVal, 2.2) * 255.0); // Gamma 2.2 correction

    analogWrite(PWM_PIN, brightness);

    angle += 0.04;
    if (angle >= 2 * PI) {
      angle = 0.0;
    }
  }
}
