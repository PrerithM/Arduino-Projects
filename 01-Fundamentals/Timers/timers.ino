/*
 * Module: Non-Blocking Concurrent Timers & Multitasking
 * Description: Runs two independent LED flashers and a serial telemetry
 *              task at different frequencies with zero delay() bottlenecks.
 * Part of: Arduino Projects Cookbook
 */

struct TaskTimer {
  unsigned long previousMillis;
  unsigned long interval;
};

TaskTimer taskFast  = {0, 250};   // 4Hz toggle (250ms)
TaskTimer taskSlow  = {0, 1000};  // 1Hz toggle (1000ms)
TaskTimer taskTelemetry = {0, 2000}; // Report every 2s

const int PIN_FAST = 11;
const int PIN_SLOW = 12;

bool stateFast = false;
bool stateSlow = false;

void setup() {
  pinMode(PIN_FAST, OUTPUT);
  pinMode(PIN_SLOW, OUTPUT);
  Serial.begin(9600);
  Serial.println(F("Cooperative Multitasking Engine Started."));
}

void loop() {
  unsigned long now = millis();

  // Task 1: Fast Flash
  if (now - taskFast.previousMillis >= taskFast.interval) {
    taskFast.previousMillis = now;
    stateFast = !stateFast;
    digitalWrite(PIN_FAST, stateFast);
  }

  // Task 2: Slow Flash
  if (now - taskSlow.previousMillis >= taskSlow.interval) {
    taskSlow.previousMillis = now;
    stateSlow = !stateSlow;
    digitalWrite(PIN_SLOW, stateSlow);
  }

  // Task 3: Telemetry Stream
  if (now - taskTelemetry.previousMillis >= taskTelemetry.interval) {
    taskTelemetry.previousMillis = now;
    Serial.print(F("[UPTIME] "));
    Serial.print(now / 1000);
    Serial.print(F("s | Fast LED: "));
    Serial.print(stateFast ? "ON" : "OFF");
    Serial.print(F(" | Slow LED: "));
    Serial.println(stateSlow ? "ON" : "OFF");
  }

  // The loop is completely free to handle immediate sensor inputs here!
}
