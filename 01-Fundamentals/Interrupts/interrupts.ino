/*
 * Module: Hardware Interrupt Service Routine (ISR)
 * Description: Measures precise pulse triggers and rotary encoder ticks
 *              without polling inside the main loop().
 * Part of: Arduino Projects Cookbook
 */

const byte INTERRUPT_PIN = 2; // INT0 on Uno / Nano
const byte STATUS_LED    = 13;

// volatile tells the compiler that this variable can change unexpectedly
// inside an interrupt, preventing aggressive compiler optimization.
volatile unsigned long pulseCount = 0;
volatile bool newPulseFlag = false;

// Debouncing inside ISR
volatile unsigned long lastIsrMicros = 0;
const unsigned long DEBOUNCE_MICROS = 150000; // 150ms lock out for mechanical buttons

void isrTrigger() {
  unsigned long currentMicros = micros();
  if (currentMicros - lastIsrMicros > DEBOUNCE_MICROS) {
    pulseCount++;
    newPulseFlag = true;
    lastIsrMicros = currentMicros;
  }
}

void setup() {
  pinMode(INTERRUPT_PIN, INPUT_PULLUP);
  pinMode(STATUS_LED, OUTPUT);
  Serial.begin(9600);

  // Attach Interrupt: pin 2, ISR function, Trigger on FALLING edge
  attachInterrupt(digitalPinToInterrupt(INTERRUPT_PIN), isrTrigger, FALLING);

  Serial.println(F("Hardware Interrupt active on Pin D2 (FALLING edge)."));
}

void loop() {
  // Heavy computation simulation in loop()
  // Even if loop() is busy, the interrupt will NEVER be missed!
  delay(500);

  if (newPulseFlag) {
    // Disable interrupts briefly if reading multi-byte variables on 8-bit AVR
    noInterrupts();
    unsigned long currentCount = pulseCount;
    newPulseFlag = false;
    interrupts();

    Serial.print(F("Interrupt Caught! Total Events: "));
    Serial.println(currentCount);

    digitalWrite(STATUS_LED, !digitalRead(STATUS_LED));
  }
}
