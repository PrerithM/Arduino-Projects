/*
 * Module: High-Speed SPI (Serial Peripheral Interface)
 * Description: Communicates with SPI devices using the hardware SPI engine
 *              with dedicated Chip Select (CS) bus arbitration.
 * Part of: Arduino Projects Cookbook
 */

#include <SPI.h>

const int CS_PIN = 10;

void setup() {
  pinMode(CS_PIN, OUTPUT);
  digitalWrite(CS_PIN, HIGH); // Deselect device

  Serial.begin(9600);
  SPI.begin(); // Initialize SCK (13), MOSI (11), MISO (12)

  Serial.println(F("SPI Bus Initialized."));
}

byte sendSpiByte(byte dataOut) {
  // Select slave by pulling CS LOW
  digitalWrite(CS_PIN, LOW);

  // Transfer byte: sends dataOut while simultaneously receiving dataIn (Full Duplex)
  byte dataIn = SPI.transfer(dataOut);

  // Deselect slave
  digitalWrite(CS_PIN, HIGH);

  return dataIn;
}

void loop() {
  // Example SPI Transaction: send dummy command byte 0xAA
  SPI.beginTransaction(SPISettings(4000000, MSBFIRST, SPI_MODE0)); // 4MHz clock
  byte response = sendSpiByte(0xAA);
  SPI.endTransaction();

  Serial.print(F("SPI Byte Transferred. Response: 0x"));
  Serial.println(response, HEX);

  delay(1000);
}
