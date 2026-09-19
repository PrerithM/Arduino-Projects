/*
 * Module: 5V Optoisolated Relay Module
 * Description: Switches high-power external loads with safe optocoupler
 *              isolation and duty-cycle interval timing.
 * Part of: Arduino Projects Cookbook
 */

const int RELAY_PIN = 4;

// NOTE: Most relay modules are ACTIVE LOW (writing LOW energizes the coil)
const int RELAY_ON  = LOW;
const int RELAY_OFF = HIGH;

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, RELAY_OFF); // Ensure relay starts in safe OFF state

  Serial.begin(9600);
  Serial.println(F("Relay Controller Armed and Safe."));
}

void loop() {
  Serial.println(F("Relay: ENERGIZING COIL (Switch Closed - Load ON)"));
  digitalWrite(RELAY_PIN, RELAY_ON);
  delay(3000);

  Serial.println(F("Relay: DE-ENERGIZING COIL (Switch Open - Load OFF)"));
  digitalWrite(RELAY_PIN, RELAY_OFF);
  delay(3000);
}
