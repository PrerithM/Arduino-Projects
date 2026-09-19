# Smart Perimeter Intruder Alarm & Access System

> A multi-zone security alarm combining ultrasonic distance tripwires, audible sirens, visual flashing strobes, and keypad disarming.

---

## 🎯 What You'll Learn
- Security state machines (DISARMED, ARMED, TRIPPED, ALARM)
- Non-blocking multi-tone siren synthesis
- Configuring countdown entry/exit grace period delays

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| Arduino Uno / Nano | 1 | Main board |
| Ultrasonic Sensor (HC-SR04) | 1 | Tripwire distance barrier |
| Piezo Buzzer / 12V Siren | 1 | Acoustic alarm sounder |
| Pushbutton or Keypad | 1 | Arm / Disarm interface |
| Red and Green LEDs | 2 | System armed/safe status indicators |
| Breadboard & Jumpers | 1 set | Connections |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `D9 & D10` | `TRIG & ECHO` | Ultrasonic Tripwire |
| `D8` | `Buzzer / Siren` | Audible Siren |
| `D2` | `Disarm Button` | Momentary Pushbutton (INPUT_PULLUP) |
| `D12` | `Green LED` | Status: DISARMED |
| `D13` | `Red LED` | Status: ARMED / ALARM |


---

## 📐 Circuit & Wiring Diagram

```text
+-----------------+              +----------------------+
    |   Arduino Uno   |              |  Multi-Zone Security |
    |                 |              |                      |
    |        D9 & D10 |<------------>| HC-SR04 Sonar Barrier|
    |              D8 |------------->| Piezo / 12V Siren    |
    |              D2 |<-------------| Disarm Pushbutton    |
    |       D12 & D13 |------------->| Green / Red LEDs     |
    +-----------------+              +----------------------+
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`security_alarm.ino`](./security_alarm.ino).

```cpp
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
```

---

## ⚙️ How It Works (Under the Hood)

The alarm engine runs a 4-stage Finite State Machine. When in the ARMED state, any acoustic reflection below 50cm transitions the system into the TRIPPED state. The user is given a 5-second grace window to push the disarm button before the full optical strobe and acoustic siren activate.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Integrate a 4x4 matrix keypad requiring a 4-digit PIN (e.g. '1234#') to disarm.
1. Add an IR remote control to arm/disarm from a distance.
1. Connect an ESP8266 or GSM SIM800L module to send SMS text alerts to your phone.

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [05-Communication/Bluetooth](../../05-Communication/Bluetooth/)**: Disarm automatically when your authorized smartphone connects.
- **Pair with [04-Displays/LCD](../../04-Displays/LCD/)**: Display entry countdown timer and breach logs.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
