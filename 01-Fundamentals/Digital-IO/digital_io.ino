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
