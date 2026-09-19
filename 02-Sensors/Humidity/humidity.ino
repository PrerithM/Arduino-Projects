/*
 * Module: DHT11 / DHT22 Relative Humidity & Temperature
 * Description: Reads relative humidity (%RH) and ambient temperature,
 *              calculating the human Heat Index comfort score.
 * Requires: DHT sensor library by Adafruit
 * Part of: Arduino Projects Cookbook
 */

#include "DHT.h"

#define DHTPIN 5
#define DHTTYPE DHT11   // Set to DHT22 for higher accuracy AM2302

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
  Serial.println(F("DHT Environmental Sensor Active."));
}

void loop() {
  // Reading temperature or humidity takes about 250 milliseconds!
  float humidity = dht.readHumidity();
  float tempC = dht.readTemperature();
  float tempF = dht.readTemperature(true);

  if (isnan(humidity) || isnan(tempC) || isnan(tempF)) {
    Serial.println(F("Failed to read from DHT sensor! Check wiring."));
    delay(2000);
    return;
  }

  // Compute Heat Index in Fahrenheit and Celsius
  float hif = dht.computeHeatIndex(tempF, humidity);
  float hic = dht.computeHeatIndex(tempC, humidity, false);

  Serial.print(F("Humidity: "));
  Serial.print(humidity, 1);
  Serial.print(F(" %RH  |  Temp: "));
  Serial.print(tempC, 1);
  Serial.print(F(" °C  |  Heat Index: "));
  Serial.print(hic, 1);
  Serial.println(F(" °C"));

  delay(2000); // DHT11 minimum sampling interval is 1-2 seconds
}
