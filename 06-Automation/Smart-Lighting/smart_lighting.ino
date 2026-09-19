/*
 * Project: Smart Adaptive Lighting Automation
 * Description: Fuses ambient light sensing with passive infrared (PIR)
 *              human motion detection to automatically fade in lights
 *              only when dark and occupied.
 * Part of: Arduino Projects Cookbook
 */

const int PIR_PIN   = 2;
const int LDR_PIN   = A0;
const int LIGHT_PIN = 9; // PWM capable

const int DARK_THRESHOLD = 300;      // ADC value below which room is dark
const unsigned long LIGHT_TIMEOUT = 10000; // Stay ON for 10s after last motion

unsigned long lastMotionTime = 0;
int currentBrightness = 0;
int targetBrightness  = 0;

void setup() {
  pinMode(PIR_PIN, INPUT);
  pinMode(LIGHT_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println(F("Smart Lighting Controller Armed."));
}

void loop() {
  int lightLevel = analogRead(LDR_PIN);
  bool motionDetected = (digitalRead(PIR_PIN) == HIGH);

  if (motionDetected) {
    lastMotionTime = millis();
    Serial.println(F("Motion Detected!"));
  }

  bool isDark = (lightLevel < DARK_THRESHOLD);
  bool isOccupied = (millis() - lastMotionTime < LIGHT_TIMEOUT);

  // Turn ON only if BOTH dark AND occupied
  if (isDark && isOccupied) {
    targetBrightness = 255;
  } else {
    targetBrightness = 0;
  }

  // Smooth fade transition
  if (currentBrightness < targetBrightness) {
    currentBrightness += 5;
    if (currentBrightness > targetBrightness) currentBrightness = targetBrightness;
  } else if (currentBrightness > targetBrightness) {
    currentBrightness -= 5;
    if (currentBrightness < targetBrightness) currentBrightness = targetBrightness;
  }

  analogWrite(LIGHT_PIN, currentBrightness);
  delay(20);
}
