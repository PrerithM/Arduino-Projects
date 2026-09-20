# 🕹️ Digital Input / Output & Software Debouncing

> **"Read clean mechanical pushbuttons using internal pull-up resistors and filter electrical contact bounce with non-blocking temporal hysteresis."**
>
> 🌐 **Interactive Lab:** Open [`index.html`](./index.html) in any browser to test the interactive pushbutton, mechanical bounce simulator, and real-time dual oscilloscope.

---

## 🎯 The Big Idea

Digital inputs are binary: an electrical voltage is either considered **HIGH (1)** or **LOW (0)**. However, physical buttons are made of springy metal contacts. When pressed, these contacts physically bounce against each other for several milliseconds before making a solid connection.

Without debouncing, a single human button press can trigger 10 to 30 rapid, invisible electrical pulses, causing an LED or counter to toggle wildly. This module teaches you how to use **internal pull-up resistors** to eliminate floating pins and **non-blocking software debouncing** with `millis()` to ensure one clean toggle per physical press.

---

## 💡 The Mental Model

1. **Floating Pins & Pull-Up Resistors**: Imagine a door that has no latch. A slight gust of wind will blow it open or shut unpredictably. That is a "floating" input pin. An internal pull-up resistor acts like a gentle rubber spring that holds the door closed (HIGH at 5V) until a human firmly pulls the handle to ground (LOW at 0V).
2. **Mechanical Contact Bounce**: When you drop a basketball on the floor, it does not stop moving instantly—it bounces several times before coming to rest. Inside a tactile switch, tiny copper leaves bounce against each other in the exact same way for 5 to 20 milliseconds upon impact.

---

## 🔌 Hardware Setup & Pinout

By enabling the internal pull-up resistor in software, you need **zero external resistors**:

| Arduino Pin | Button Terminal | State When Pressed | State When Released |
| :--- | :--- | :--- | :--- |
| **`Pin D2`** | Terminal 1 (Input) | **LOW (0V / 0)** | **HIGH (+5V / 1)** |
| **`GND`** | Terminal 2 (Return) | Common 0V reference | Common 0V reference |
| **`Pin D13`** | Onboard Built-in LED | Toggles state (ON/OFF) | Holds state |

```
                Arduino ATmega328P
               ┌──────────────────┐
               │  Internal Pullup │
               │     (~30kΩ)      │
               │   ┌───/\/\/\──── +5V
               │   │
     Pin D2 ───┴───o
                   │
                   ├───┐ Tactile Switch
                   │   │
                   └───┴───► GND (0V)
```

---

## 🔬 How the Hardware Works (Under the Hood)

### 1. Active-Low Logic Architecture
Because the internal resistor pulls Pin D2 up to +5V by default:
- When the button is **open (released)**, no current flows, and `digitalRead(2)` returns **HIGH**.
- When the button is **closed (pressed)**, Pin D2 is shorted directly to GND, and `digitalRead(2)` returns **LOW**.
This inverted logic is known in engineering as **Active-LOW**.

### 2. The 50ms Temporal Debounce Window
Microscopic contact bouncing completes within 5 to 20 milliseconds. By enforcing a **50ms stability window**:
1. When a change is detected on Pin D2, record the timestamp `lastDebounceTime = millis()`.
2. As the pin bounces between 0 and 1, the timer continuously resets.
3. Once the signal remains stable in the same state for a full 50ms, the software accepts it as a genuine user stroke.

### 3. Why Non-Blocking `millis()` Beats `delay(50)`
Calling `delay(50)` completely freezes the CPU clock, preventing the microcontroller from reading sensors, checking communications, or servicing emergency stops. Using `millis()` keeps the CPU running at full 16MHz speed.

---

## 💻 Line-by-Line Code Walkthrough

```cpp
/*
 * Module: Digital I/O with Pushbutton Debounce
 * Clean non-blocking software debouncing using millis()
 */

const int BUTTON_PIN = 2;   // Pushbutton connected to D2 and GND
const int LED_PIN    = 13;  // Onboard status LED on D13

int ledState = LOW;             // Current state of output LED
int buttonState;                // Verified stable reading
int lastButtonState = HIGH;     // Previous raw reading for edge detection

unsigned long lastDebounceTime = 0;     // Timestamp of last signal transition
const unsigned long debounceDelay = 50; // Required stability duration (ms)

void setup() {
  // 1. Enable internal 20k-50k pull-up resistor (pin is HIGH when open)
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  
  // 2. Configure output indicator
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, ledState);

  Serial.begin(9600);
  Serial.println(F("Digital I/O Ready. Pushbutton toggles LED D13."));
}

void loop() {
  // Read the instantaneous physical pin state
  int reading = digitalRead(BUTTON_PIN);

  // If signal transitioned (due to noise, bounce, or pressing), restart timer
  if (reading != lastButtonState) {
    lastDebounceTime = millis();
  }

  // Check if signal has remained unchanged longer than debounce threshold
  if ((millis() - lastDebounceTime) > debounceDelay) {
    // If verified state has changed:
    if (reading != buttonState) {
      buttonState = reading;

      // Trigger only on press stroke (Active LOW)
      if (buttonState == LOW) {
        ledState = !ledState; // Toggle binary state
        digitalWrite(LED_PIN, ledState);

        Serial.print(F("Button Pressed! LED is now: "));
        Serial.println(ledState ? F("ON") : F("OFF"));
      }
    }
  }

  // Preserve state for next iteration comparison
  lastButtonState = reading;
}
```

### Explanation Table

| Code Snippet | What It Tells Arduino to Do |
| :--- | :--- |
| `pinMode(2, INPUT_PULLUP)` | Activates internal gate resistor to +5V; pin never floats. |
| `reading != lastButtonState` | Detects any electrical transition (rising or falling edge). |
| `lastDebounceTime = millis()` | Records the exact millisecond mark when the electrical edge occurred. |
| `(millis() - lastDebounceTime) > 50` | Evaluates whether 50ms of quiet, bounce-free stability have elapsed. |
| `ledState = !ledState` | Inverts boolean logic: `HIGH` becomes `LOW`, and `LOW` becomes `HIGH`. |

---

## 🧪 Hands-On Experiments to Try

1. **Observe Mechanical Bounce**: Set `debounceDelay = 0`. Open the Serial Monitor and press the button 10 times. Notice how the counter registers 15 to 30 events due to raw mechanical bounce! Then set it back to `50` to see 100% clean filtering.
2. **Press-and-Hold Indicator**: Modify the code so that the LED stays lit *only while the button is held down*, and turns off the instant you release it.
3. **Double-Click Gesture**: Add a secondary timer that checks if a second button press arrives within 300ms of the first, creating a computer-style "double click".

---

## ⚠️ Common Mistakes & Troubleshooting

- **Floating Pin (Omitted INPUT_PULLUP)**: If you declare `pinMode(2, INPUT)` without an external resistor, hovering your hand near the breadboard will toggle the LED due to static electricity. Always use `INPUT_PULLUP`.
- **Button Wired on Same Contact Strip**: Tactile pushbuttons have 4 pins connected in internal pairs. If your LED stays permanently ON, rotate the button 90 degrees or wire across diagonally opposite corners.
- **Inverted Logic Confusion**: Remember: With `INPUT_PULLUP`, pressing the button produces `LOW (0)`, and releasing produces `HIGH (1)`.

---

## 🚀 What to Build Next

Digital debounced input is the fundamental interface for:
- **Game Controllers & Arcades** (joysticks and trigger buttons)
- **Machine Safety Stops** (industrial emergency E-Stop pushbuttons)
- **Rotary Encoder Push Switches** (menu navigation knobs)
