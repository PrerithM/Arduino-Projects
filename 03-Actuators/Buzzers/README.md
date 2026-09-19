# Audio Tones & Melodies (Active vs Passive Piezo Buzzers)

> Generate musical chimes, alarm sirens, and audio UI alerts with piezo tone frequencies.

---

## 🎯 What You'll Learn
- Active vs Passive buzzer differences (Fixed oscillator vs Frequency generator)
- Generating square wave audio frequencies with tone() and noTone()
- Mapping musical notes (C4, D4, E4...) and note duration timing

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| Arduino Uno / Nano | 1 | Main board |
| Passive Piezo Buzzer | 1 | Piezoelectric sounder element |
| 100Ω Resistor | 1 | Volume dampener / current protection |
| Breadboard & Jumpers | 1 set | Connections |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `D8` | `Buzzer Positive (+) via 100Ω` | Audio Frequency PWM Output |
| `GND` | `Buzzer Negative (-)` | Ground |


---

## 📐 Circuit & Wiring Diagram

```text
+-----------------+
    |   Arduino Uno   |
    |                 |
    |              D8 |--------[ 100Ω Resistor ]-----> ( + ) [ Piezo Buzzer ]
    |                 |                                      |
    |             GND |------------------------------------> ( - )
    +-----------------+
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`buzzer_tones.ino`](./buzzer_tones.ino).

```cpp
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
```

---

## ⚙️ How It Works (Under the Hood)

A piezoelectric buzzer contains a thin ceramic disk bonded to a metal diaphragm. When an alternating electric field is applied (via `tone()`), the piezoelectric material mechanically deforms, flexing back and forth at the exact frequency of the signal to produce pressure waves in the air that our ears hear as sound.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Transcribe and play the Star Wars Imperial March or Super Mario theme song.
1. Build an interactive Morse Code generator that beeps dots and dashes from serial text inputs.
1. Synthesize continuous multi-tone sirens using non-blocking timer loops.

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [02-Sensors/Ultrasonic](../../02-Sensors/Ultrasonic/)**: Build an audible vehicle reverse parking sensor that beeps with increasing frequency.
- **Pair with [06-Automation/Security](../../06-Automation/Security/)**: Loud audible deterrent alarm triggered by unauthorized motion.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
