/*
 * Module: SoftwareSerial Inter-Microcontroller UART
 * Description: Sends and receives structured packet messages between two
 *              Arduinos with packet framing delimiters.
 * Part of: Arduino Projects Cookbook
 */

#include <SoftwareSerial.h>

const byte RX_PIN = 10;
const byte TX_PIN = 11;

SoftwareSerial linkSerial(RX_PIN, TX_PIN); // RX, TX

void setup() {
  Serial.begin(9600);       // PC Debug Serial
  linkSerial.begin(9600);   // Inter-Arduino Link

  Serial.println(F("UART Inter-Board Link Active."));
  Serial.println(F("Type a message to send to the other Arduino:"));
}

void loop() {
  // Read from PC Serial Monitor and send to Remote Arduino
  if (Serial.available()) {
    char c = Serial.read();
    linkSerial.write(c);
  }

  // Read from Remote Arduino and print to PC Serial Monitor
  if (linkSerial.available()) {
    char c = linkSerial.read();
    Serial.write(c);
  }
}
