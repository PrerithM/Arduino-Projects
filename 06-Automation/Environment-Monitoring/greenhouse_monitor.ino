/*
 * Project: Smart Greenhouse Climate & Soil Moisture Monitor
 * Description: Monitors air temp, humidity, and soil moisture to automatically
 *              trigger water pump irrigation and update an LCD screen.
 * Requires: DHT sensor library, LiquidCrystal_I2C
 * Part of: Arduino Projects Cookbook
 */

#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "DHT.h"

#define DHTPIN 5
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

LiquidCrystal_I2C lcd(0x27, 16, 2);

const int SOIL_PIN  = A0;
const int PUMP_PIN  = 4;

const int SOIL_DRY_THRESHOLD = 35; // Water when soil drops below 35%
const int PUMP_DURATION_MS   = 3000; // Run pump for 3 seconds

unsigned long lastWaterTime = 0;
const unsigned long WATER_COOLDOWN = 60000; // Minimum 1 minute between watering

void setup() {
  pinMode(PUMP_PIN, OUTPUT);
  digitalWrite(PUMP_PIN, HIGH); // Relay OFF (Active LOW)

  Serial.begin(9600);
  dht.begin();
  lcd.init();
  lcd.backlight();

  lcd.setCursor(0, 0);
  lcd.print(F("GREENHOUSE READY"));
  delay(1500);
  lcd.clear();
}

void loop() {
  float hum = dht.readHumidity();
  float temp = dht.readTemperature();
  int rawSoil = analogRead(SOIL_PIN);
  
  // Map raw analog reading (e.g. 1023 dry, 300 wet) to 0 - 100% moisture
  int soilPercent = map(constrain(rawSoil, 300, 1023), 1023, 300, 0, 100);

  // Update LCD Screen
  lcd.setCursor(0, 0);
  lcd.print(F("T:"));
  lcd.print((int)temp);
  lcd.print(F("C H:"));
  lcd.print((int)hum);
  lcd.print(F("% Soil:"));
  lcd.print(soilPercent);
  lcd.print(F("% "));

  lcd.setCursor(0, 1);
  if (digitalRead(PUMP_PIN) == LOW) {
    lcd.print(F("PUMP: WATERING! "));
  } else {
    lcd.print(F("PUMP: STANDBY   "));
  }

  // Automated Watering Logic
  if (soilPercent < SOIL_DRY_THRESHOLD && (millis() - lastWaterTime > WATER_COOLDOWN)) {
    Serial.println(F("Soil is dry! Triggering irrigation pump..."));
    digitalWrite(PUMP_PIN, LOW); // Turn pump ON
    delay(PUMP_DURATION_MS);
    digitalWrite(PUMP_PIN, HIGH); // Turn pump OFF
    lastWaterTime = millis();
  }

  delay(1000);
}
