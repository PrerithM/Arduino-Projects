# Smart Adaptive Lighting & Automatic Nightlight

> An intelligent lighting system that measures ambient light with an LDR and detects human motion with PIR to smoothly illuminate spaces only when needed.

---

## 🎯 What You'll Learn
- Fusing multiple sensors (LDR ambient light + PIR motion)
- Implementing timeout counters to keep lights on during continuous activity
- Smooth PWM transition fading vs harsh sudden relay switching

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| Arduino Uno / Nano | 1 | Main board |
| PIR Motion Sensor (HC-SR501) | 1 | Infrared human motion detector |
| Photoresistor (LDR) + 10kΩ Resistor | 1 each | Ambient light sensor |
| LED Strip or Relay + 12V Lamp | 1 | Target illumination load |
| Breadboard & Jumpers | 1 set | Connections |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `D2` | `PIR Motion Out` | Motion Trigger Input |
| `A0` | `LDR Voltage Divider` | Ambient Light Analog Input |
| `D9 (~PWM)` | `LED Strip Driver / Relay` | Light Output Control |


---

## 📐 Circuit & Wiring Diagram

```text
+-----------------+              +----------------------+
    |   Arduino Uno   |              |  HC-SR501 PIR Motion |
    |                 |              |                      |
    |              D2 |<-------------| OUT (Motion)         |
    |              A0 |<--[ LDR/10k ]| (Light Level)        |
    |        D9 (PWM) |------------->| [ LED Strip / Relay] |
    |        5V & GND |=============>| Power Rails          |
    +-----------------+              +----------------------+
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`smart_lighting.ino`](./smart_lighting.ino).

```cpp
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
```

---

## ⚙️ How It Works (Under the Hood)

The system continuously monitors two independent conditions: physical occupancy (via the PIR pyroelectric sensor detecting changes in thermal infrared emissions from warm human bodies) and ambient darkness (via the LDR). Fusing both inputs ensures lighting is never wastefully powered during daylight hours.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Add an ambient light auto-dimming mode that adjusts lamp brightness proportionally to room darkness.
1. Integrate an I2C LCD displaying energy saved statistics and active run hours.
1. Add Bluetooth or Wi-Fi override capability to force lights ON/OFF.

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [03-Actuators/Relays](../../03-Actuators/Relays/)**: Control 120V/240V ceiling lamps instead of low-voltage LEDs.
- **Pair with [04-Displays/LCD](../../04-Displays/LCD/)**: Display current room status and countdown timers.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
