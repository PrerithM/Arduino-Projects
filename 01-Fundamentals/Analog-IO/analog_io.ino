/*
 * Module: Analog I/O & Continuous Voltage Measurement
 * Description: Reads a 10k potentiometer via ADC pin A0 with a 10-sample
 *              moving average filter to eliminate electrical noise.
 * Part of: Arduino Projects Cookbook
 */

const int ANALOG_PIN = A0;
const int NUM_READINGS = 10;

int readings[NUM_READINGS];      // Circular buffer for readings
int readIndex = 0;               // Current index in buffer
long total = 0;                  // Running total
int averageRaw = 0;              // Average ADC value

void setup() {
  Serial.begin(9600);
  
  // Initialize all buffer readings to 0
  for (int thisReading = 0; thisReading < NUM_READINGS; thisReading++) {
    readings[thisReading] = 0;
  }

  Serial.println(F("Analog Reading Initialized."));
  Serial.println(F("Raw (0-1023)\tVoltage (V)\tPercent (%)"));
}

void loop() {
  // Subtract the oldest reading from running total
  total = total - readings[readIndex];
  // Read from sensor
  readings[readIndex] = analogRead(ANALOG_PIN);
  // Add new reading to running total
  total = total + readings[readIndex];
  // Advance circular index
  readIndex = (readIndex + 1) % NUM_READINGS;

  // Calculate smoothed average
  averageRaw = total / NUM_READINGS;

  // Convert to voltage (0.00V - 5.00V) assuming standard 5V Vref
  float voltage = (averageRaw * 5.0) / 1023.0;
  // Convert to percentage (0 - 100%)
  int percentage = map(averageRaw, 0, 1023, 0, 100);

  Serial.print(averageRaw);
  Serial.print(F("\t\t"));
  Serial.print(voltage, 2);
  Serial.print(F(" V\t\t"));
  Serial.print(percentage);
  Serial.println(F(" %"));

  delay(100); // 10Hz sampling rate
}
