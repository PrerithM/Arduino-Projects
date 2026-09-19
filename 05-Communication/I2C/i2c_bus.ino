/*
 * Module: I2C Master-Slave Communication (Wire Library)
 * Description: Demonstrates bidirectional multi-byte register reading and
 *              writing across a 2-wire shared I2C bus.
 * Part of: Arduino Projects Cookbook
 */

#include <Wire.h>

#define SLAVE_ADDR 0x08

void setup() {
  Wire.begin(); // Join I2C bus as Master
  Serial.begin(9600);
  Serial.println(F("I2C Master Ready."));
}

void loop() {
  // 1. Send Command to Slave
  Wire.beginTransmission(SLAVE_ADDR);
  Wire.write("PING");
  Wire.endTransmission();

  delay(50);

  // 2. Request 6 bytes of response data from Slave
  Wire.requestFrom(SLAVE_ADDR, 6);
  Serial.print(F("Received from Slave: "));
  while (Wire.available()) {
    char c = Wire.read();
    Serial.print(c);
  }
  Serial.println();

  delay(1000);
}
