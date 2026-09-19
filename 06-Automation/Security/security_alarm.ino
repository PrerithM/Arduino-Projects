/*
 * Project: Smart Perimeter Security & Intruder Alarm System
 * Description: Implements an armed security perimeter with ultrasonic
 *              distance tripwire, flashing strobes, and audible sirens.
 * Part of: Arduino Projects Cookbook
 */

enum SystemState { DISARMED, ARMED, TRIPPED, ALARM };
SystemState currentState = DISARMED;

const int TRIG_PIN   = 9;
const int ECHO_PIN   = 10;
const int BUZZER_PIN = 8;
const int BUTTON_PIN = 2;
const int LED_GREEN  = 12;
const int LED_RED    = 13;

const float TRIP_DISTANCE_CM = 50.0; // Trigger if object closer than 50cm
unsigned long tripStartTime = 0;
const unsigned long GRACE_PERIOD_MS = 5000; // 5 seconds to disarm

float getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  unsigned long duration = pulseIn(ECHO_PIN, HIGH, 25000);
  if (duration == 0) return 999.0;
  return (duration * 0.0343) / 2.0;
}

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_RED, OUTPUT);

  Serial.begin(9600);
  Serial.println(F("Security System Armed. Press Button to Toggle Arm/Disarm."));
}

void loop() {
  // Button toggle
  static bool lastBtn = HIGH;
  bool btn = digitalRead(BUTTON_PIN);
  if (btn == LOW && lastBtn == HIGH) {
    if (currentState == DISARMED) {
      currentState = ARMED;
      Serial.println(F(">>> SYSTEM ARMED <<<"));
      tone(BUZZER_PIN, 1000, 200);
    } else {
      currentState = DISARMED;
      noTone(BUZZER_PIN);
      Serial.println(F(">>> SYSTEM DISARMED <<<"));
      tone(BUZZER_PIN, 500, 200);
    }
    delay(200); // Simple debounce
  }
  lastBtn = btn;

  // State Logic
  switch (currentState) {
    case DISARMED:
      digitalWrite(LED_GREEN, HIGH);
      digitalWrite(LED_RED, LOW);
      noTone(BUZZER_PIN);
      break;

    case ARMED:
      digitalWrite(LED_GREEN, LOW);
      digitalWrite(LED_RED, HIGH);
      {
        float d = getDistance();
        if (d > 0 && d < TRIP_DISTANCE_CM) {
          currentState = TRIPPED;
          tripStartTime = millis();
          Serial.println(F("WARNING: Perimeter Breached! Enter pass code..."));
        }
      }
      break;

    case TRIPPED:
      // Grace period warning beeps
      digitalWrite(LED_RED, (millis() / 250) % 2);
      tone(BUZZER_PIN, 800, 100);
      if (millis() - tripStartTime > GRACE_PERIOD_MS) {
        currentState = ALARM;
        Serial.println(F("ALARM TRIGGERED: INTRUDER CONFIRMED!"));
      }
      break;

    case ALARM:
      // High-low police siren
      digitalWrite(LED_RED, (millis() / 100) % 2);
      digitalWrite(LED_GREEN, !digitalRead(LED_RED));
      if ((millis() / 300) % 2) {
        tone(BUZZER_PIN, 1200);
      } else {
        tone(BUZZER_PIN, 600);
      }
      break;
  }
}
