/*
 * Module: Ambient Light Sensing (LDR Voltage Divider)
 * Description: Calibrates ambient room light on startup and triggers
 *              automatic nightlight activation with hysteresis.
 * Part of: Arduino Projects Cookbook
 */

const int LDR_PIN = A1;
const int NIGHTLIGHT_PIN = 13;

int sensorMin = 1023;
int sensorMax = 0;

void setup() {
  pinMode(NIGHTLIGHT_PIN, OUTPUT);
  Serial.begin(9600);

  Serial.println(F("Calibrating LDR for 5 seconds... Cover and shine light!"));
  // 5-second calibration window
  while (millis() < 5000) {
    int val = analogRead(LDR_PIN);
    if (val < sensorMin) sensorMin = val;
    if (val > sensorMax) sensorMax = val;
  }

  Serial.print(F("Calibration Done. Min: "));
  Serial.print(sensorMin);
  Serial.print(F(" | Max: "));
  Serial.println(sensorMax);
}

void loop() {
  int rawValue = analogRead(LDR_PIN);
  
  // Constrain and map reading to 0 - 100% light intensity
  rawValue = constrain(rawValue, sensorMin, sensorMax);
  int lightPercent = map(rawValue, sensorMin, sensorMax, 0, 100);

  Serial.print(F("Light Level: "));
  Serial.print(lightPercent);
  Serial.println(F(" %"));

  // Nightlight threshold with hysteresis (turn on below 20%, turn off above 30%)
  if (lightPercent < 20) {
    digitalWrite(NIGHTLIGHT_PIN, HIGH);
  } else if (lightPercent > 30) {
    digitalWrite(NIGHTLIGHT_PIN, LOW);
  }

  delay(200);
}
