# Digital Input / Output (Pushbutton & LED)

> Control electronic states (HIGH/LOW) to read pushbuttons with internal pullups and switch LEDs on and off with debouncing.

---

## 🎯 What You'll Learn
- Configuring pins with pinMode() as INPUT_PULLUP and OUTPUT
- Reading digital states with digitalRead() and driving states with digitalWrite()
- Software pushbutton debouncing without delay blocking

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| Arduino Uno / Nano | 1 | Main microcontroller board |
| Pushbutton Switch | 1 | Momentary tactile button |
| LED (5mm) | 1 | Standard indicator LED (e.g., Green/Red) |
| Current-limiting Resistor | 1 | 220Ω to 330Ω resistor for LED |
| Breadboard & Jumper Wires | 1 set | Solderless prototyping board and wires |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `D2` | `Pushbutton Leg A` | Digital Input with INPUT_PULLUP (Active LOW) |
| `GND` | `Pushbutton Leg B` | Ground reference for pushbutton |
| `D13` | `LED Anode (+ via 220Ω)` | Digital Output control signal |
| `GND` | `LED Cathode (-)` | Common ground connection |


---

## 📐 Circuit & Wiring Diagram

```text
+-----------------+
    |   Arduino Uno   |
    |                 |
    |             D13 |--------[ 220Ω Resistor ]----->| (LED) ----+
    |                 |                               (Anode/Cathode) |
    |             D2  |--------+                                  |
    |                 |        |                                  |
    |             GND |--------+----------------------------------+
    +-----------------+        |
                           [ Pushbutton ]
                               |
                              GND
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`digital_io.ino`](./digital_io.ino).

```cpp
/*
 * Module: Digital I/O with Pushbutton Debounce
 * Description: Reads a momentary pushbutton using internal pull-up resistors
 *              and toggles an LED with clean software debouncing.
 * Part of: Arduino Projects Cookbook
 */

const int BUTTON_PIN = 2;   // Pushbutton connected between pin D2 and GND
const int LED_PIN    = 13;  // LED connected to pin D13 (and onboard LED)

int ledState = LOW;             // Current state of the LED
int buttonState;                // Current reading from the input pin
int lastButtonState = HIGH;     // Previous reading from the input pin

unsigned long lastDebounceTime = 0;  // Last time the output pin was toggled
const unsigned long debounceDelay = 50; // Debounce threshold in milliseconds

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP); // Enable internal ~20k-50k pull-up resistor
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, ledState);

  Serial.begin(9600);
  Serial.println(F("Digital I/O Ready. Press the pushbutton to toggle LED."));
}

void loop() {
  int reading = digitalRead(BUTTON_PIN);

  // If the switch changed due to noise or pressing, reset debounce timer
  if (reading != lastButtonState) {
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > debounceDelay) {
    // If the reading has stayed stable longer than debounceDelay, accept it
    if (reading != buttonState) {
      buttonState = reading;

      // When button is pressed down (LOW because of active-low pull-up)
      if (buttonState == LOW) {
        ledState = !ledState;
        digitalWrite(LED_PIN, ledState);
        Serial.print(F("Button Pressed! LED is now: "));
        Serial.println(ledState ? F("ON") : F("OFF"));
      }
    }
  }

  lastButtonState = reading;
}
```

---

## ⚙️ How It Works (Under the Hood)

The ATmega328P microcontroller has internal pull-up resistors. When using `INPUT_PULLUP`, the pin is pulled HIGH (+5V) by default. Pressing the button shorts pin D2 to ground (LOW). Mechanical contacts bounce rapidly for 5-20ms when pressed; the non-blocking `millis()` timer ignores fluctuations until the state remains steady for over 50ms.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Add a second button to turn the LED OFF explicitly while the first only turns it ON.
1. Implement a double-click detection feature to flash the LED rapidly.
1. Extend the sketch to create a 3-stage brightness state using software toggle.

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [03-Actuators/Relays](../../03-Actuators/Relays/)**: Replace the LED output pin with a relay module to control 120V/240V appliances.
- **Pair with [03-Actuators/Buzzers](../../03-Actuators/Buzzers/)**: Add an audible tactile feedback click each time the button registers a press.
- **Pair with [04-Displays/LCD](../../04-Displays/LCD/)**: Display the total button click count and uptime on a 16x2 LCD screen.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
