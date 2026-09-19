/*
 * Module: Piezo Buzzer Melodies & Alert Synthesizer
 * Description: Synthesizes musical melodies and audible alarm tones
 *              using the Arduino tone() frequency generator.
 * Part of: Arduino Projects Cookbook
 */

// Musical note frequencies (Hz)
#define NOTE_C4  262
#define NOTE_D4  294
#define NOTE_E4  330
#define NOTE_F4  349
#define NOTE_G4  392
#define NOTE_A4  440
#define NOTE_B4  494
#define NOTE_C5  523

const int BUZZER_PIN = 8;

// Melody note sequence
int melody[] = {
  NOTE_C4, NOTE_G4, NOTE_A4, NOTE_G4, 0, NOTE_B4, NOTE_C5
};

// Note durations: 4 = quarter note, 8 = eighth note, etc.
int noteDurations[] = {
  4, 8, 8, 4, 4, 4, 2
};

void playStartupMelody() {
  for (int thisNote = 0; thisNote < 7; thisNote++) {
    int noteDuration = 1000 / noteDurations[thisNote];
    if (melody[thisNote] != 0) {
      tone(BUZZER_PIN, melody[thisNote], noteDuration);
    }
    // To distinguish notes, set a brief pause between them (duration + 30%)
    int pauseBetweenNotes = noteDuration * 1.30;
    delay(pauseBetweenNotes);
    noTone(BUZZER_PIN);
  }
}

void playAlarmSiren() {
  for (int freq = 400; freq <= 1200; freq += 20) {
    tone(BUZZER_PIN, freq);
    delay(10);
  }
  for (int freq = 1200; freq >= 400; freq -= 20) {
    tone(BUZZER_PIN, freq);
    delay(10);
  }
}

void setup() {
  Serial.begin(9600);
  Serial.println(F("Playing Startup Chime..."));
  playStartupMelody();
}

void loop() {
  // Uncomment below to test emergency siren
  // playAlarmSiren();
}
