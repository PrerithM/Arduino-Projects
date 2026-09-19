/*
 * Module: HC-05 Wireless Bluetooth Serial Interface
 * Description: Bi-directional wireless bridge allowing phone apps to control
 *              onboard pins and stream telemetry via Bluetooth SPP.
 * Part of: Arduino Projects Cookbook
 */

#include <SoftwareSerial.h>

const int BT_RX = 10;
const int BT_TX = 11;
const int LED_PIN = 13;

SoftwareSerial bluetooth(BT_RX, BT_TX); // RX, TX

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);       // Serial monitor on PC
  bluetooth.begin(9600);   // Default HC-05 baud rate

  Serial.println(F("Bluetooth Module Online. Pair with smartphone (PIN: 1234)."));
}

void loop() {
  // Read incoming commands from smartphone
  if (bluetooth.available()) {
    char cmd = bluetooth.read();
    Serial.print(F("Phone Sent: "));
    Serial.println(cmd);

    if (cmd == '1' || cmd == 'H') {
      digitalWrite(LED_PIN, HIGH);
      bluetooth.println(F("LED: ON"));
    } else if (cmd == '0' || cmd == 'L') {
      digitalWrite(LED_PIN, LOW);
      bluetooth.println(F("LED: OFF"));
    }
  }

  // Send data from PC keyboard over Bluetooth to phone
  if (Serial.available()) {
    char c = Serial.read();
    bluetooth.write(c);
  }
}
