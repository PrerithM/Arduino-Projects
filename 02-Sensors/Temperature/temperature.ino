/*
 * Module: DS18B20 1-Wire Digital Temperature Sensor
 * Description: Reads digital temperatures with 12-bit resolution.
 * Requires: OneWire and DallasTemperature libraries (Arduino Library Manager)
 * Part of: Arduino Projects Cookbook
 */

#include <OneWire.h>
#include <DallasTemperature.h>

const int ONE_WIRE_BUS = 4;

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setup() {
  Serial.begin(9600);
  sensors.begin();
  Serial.println(F("DS18B20 1-Wire Sensor Initialized."));
  Serial.print(F("Sensors found: "));
  Serial.println(sensors.getDeviceCount());
}

void loop() {
  sensors.requestTemperatures(); // Issue global temperature conversion command

  float tempC = sensors.getTempCByIndex(0);
  float tempF = DallasTemperature::toFahrenheit(tempC);

  if (tempC != DEVICE_DISCONNECTED_C) {
    Serial.print(F("Temperature: "));
    Serial.print(tempC, 2);
    Serial.print(F(" °C  |  "));
    Serial.print(tempF, 2);
    Serial.println(F(" °F"));
  } else {
    Serial.println(F("Error: DS18B20 disconnected!"));
  }

  delay(1000);
}
