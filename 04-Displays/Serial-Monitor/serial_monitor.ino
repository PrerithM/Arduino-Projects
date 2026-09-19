/*
 * Module: Serial Monitor & Multi-Channel Serial Plotter
 * Description: Generates multi-variable labeled telemetry streams that
 *              render as colored real-time graphs in the Arduino Serial Plotter.
 * Part of: Arduino Projects Cookbook
 */

float phase = 0.0;

void setup() {
  Serial.begin(115200);
  // Print legend headers for the Serial Plotter
  Serial.println(F("SineWave,CosineWave,NoiseSignal,FilteredAverage"));
}

void loop() {
  // Generate test signals
  float sineVal = sin(phase) * 50.0;
  float cosVal  = cos(phase) * 50.0;
  float noisySignal = sineVal + (random(-15, 15));

  // Running low-pass filter
  static float filtered = 0.0;
  filtered = (filtered * 0.85) + (noisySignal * 0.15);

  // Format: "VarName1:Value1,VarName2:Value2" or "Val1,Val2,Val3"
  Serial.print(F("Sine:"));
  Serial.print(sineVal);
  Serial.print(F(","));
  Serial.print(F("Cosine:"));
  Serial.print(cosVal);
  Serial.print(F(","));
  Serial.print(F("Noisy:"));
  Serial.print(noisySignal);
  Serial.print(F(","));
  Serial.print(F("Filtered:"));
  Serial.println(filtered);

  phase += 0.05;
  delay(30); // ~33 Hz update rate for silky smooth plotting
}
