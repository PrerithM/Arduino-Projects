/*
 * Module: Serial Communication & Interactive CLI
 * Description: Parses multi-character text commands from the Serial Monitor
 *              to configure onboard hardware and query telemetry.
 * Part of: Arduino Projects Cookbook
 */

const int STATUS_LED = 13;
String inputString = "";
bool stringComplete = false;

void setup() {
  pinMode(STATUS_LED, OUTPUT);
  Serial.begin(115200); // Fast modern baud rate
  inputString.reserve(64);

  Serial.println(F("========================================"));
  Serial.println(F("      ARDUINO CLI ENGINE v1.0           "));
  Serial.println(F(" Available Commands:                    "));
  Serial.println(F("   LED ON     - Turn pin 13 ON          "));
  Serial.println(F("   LED OFF    - Turn pin 13 OFF         "));
  Serial.println(F("   READ A0    - Sample analog pin A0    "));
  Serial.println(F("   PING       - Return PONG & uptime    "));
  Serial.println(F("========================================"));
  Serial.print(F("> "));
}

void loop() {
  // Check if a complete command line has arrived
  if (stringComplete) {
    inputString.trim(); // Strip trailing \r and \n

    if (inputString.equalsIgnoreCase("LED ON")) {
      digitalWrite(STATUS_LED, HIGH);
      Serial.println(F("OK: LED set to HIGH"));
    } else if (inputString.equalsIgnoreCase("LED OFF")) {
      digitalWrite(STATUS_LED, LOW);
      Serial.println(F("OK: LED set to LOW"));
    } else if (inputString.equalsIgnoreCase("READ A0")) {
      int val = analogRead(A0);
      float v = (val * 5.0) / 1023.0;
      Serial.print(F("ANALOG A0: "));
      Serial.print(val);
      Serial.print(F(" ("));
      Serial.print(v, 2);
      Serial.println(F("V)"));
    } else if (inputString.equalsIgnoreCase("PING")) {
      Serial.print(F("PONG (Uptime: "));
      Serial.print(millis() / 1000);
      Serial.println(F("s)"));
    } else if (inputString.length() > 0) {
      Serial.print(F("ERR: Unknown command '"));
      Serial.print(inputString);
      Serial.println(F("'"));
    }

    // Reset buffer for next command
    inputString = "";
    stringComplete = false;
    Serial.print(F("> "));
  }
}

// Built-in Arduino serial event handler called between loop() iterations
void serialEvent() {
  while (Serial.available()) {
    char inChar = (char)Serial.read();
    if (inChar == '\n') {
      stringComplete = true;
    } else if (inChar != '\r') {
      inputString += inChar;
    }
  }
}
