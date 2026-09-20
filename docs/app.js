/**
 * PRERITH.M — HARDWARE LAB
 * Interactive Core Application & Simulation Engines
 * 31 Fully Cataloged Repository Experiments Across 6 Disciplines
 */

// ==========================================================================
// 1. COMPREHENSIVE EXPERIMENT REPOSITORY DATASET (31 Modules)
// ==========================================================================

const EXPERIMENTS_DATA = [
  {
    "id": "exp-digital-io",
    "num": "EXP 001",
    "title": "Digital I/O & Switch Debounce",
    "category": "fundamentals",
    "difficulty": "beginner",
    "year": "2023",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "summary": "The fundamental building block of physical computing: controlling electrical current, internal pull-up physics, and mechanical contact debounce.",
    "problem": "Mechanical pushbuttons bounce microscopically on closure, causing false multi-triggering, and floating pins read unpredictable electrical noise.",
    "idea": "Activate ATmega328P internal 20k\u03a9 pull-up resistor (INPUT_PULLUP) to hold pin at 5V, and filter contact chatter with non-blocking millis() timestamp tracking.",
    "flow": [
      "SWITCH CONTACT",
      "INPUT_PULLUP VOLTAGE",
      "ATmega PIN REGISTER",
      "DEBOUNCE FILTER",
      "LED ANODE 5V"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "ATmega328P Digital Controller"
      },
      {
        "name": "5mm LED",
        "role": "Visual state indicator"
      },
      {
        "name": "220\u03a9 Resistor",
        "role": "Current-limiting diode protection"
      },
      {
        "name": "Tactile Pushbutton",
        "role": "Mechanical momentary switch"
      }
    ],
    "pinout": [
      {
        "mcu": "D13",
        "comp": "LED Anode (+)",
        "desc": "Current-limited output via 220\u03a9"
      },
      {
        "mcu": "D2",
        "comp": "Button Pin 1",
        "desc": "Configured as INPUT_PULLUP"
      },
      {
        "mcu": "GND",
        "comp": "Button Pin 2 & LED Cathode (-)",
        "desc": "Common ground reference"
      }
    ],
    "code": "const int BUTTON_PIN = 2;\nconst int LED_PIN    = 13;\n\nint ledState = LOW;\nint lastButtonState = HIGH;\nunsigned long lastDebounceTime = 0;\nconst unsigned long debounceDelay = 50;\n\nvoid setup() {\n  pinMode(BUTTON_PIN, INPUT_PULLUP);\n  pinMode(LED_PIN, OUTPUT);\n  digitalWrite(LED_PIN, ledState);\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  int reading = digitalRead(BUTTON_PIN);\n  if (reading != lastButtonState) {\n    lastDebounceTime = millis();\n  }\n  if ((millis() - lastDebounceTime) > debounceDelay) {\n    if (reading == LOW && lastButtonState == HIGH) {\n      ledState = !ledState;\n      digitalWrite(LED_PIN, ledState);\n    }\n  }\n  lastButtonState = reading;\n}",
    "githubPath": "01-Fundamentals/Digital-IO",
    "interactiveLabUrl": "fundamentals/digital-io.html",
    "lessons": [
      "Never leave a microcontroller input pin floating; it acts as an antenna picking up electromagnetic interference.",
      "Mechanical switches chatter for 5-20 milliseconds before settling.",
      "Register manipulation with DDRD, PORTD, and PIND provides single-clock-cycle execution."
    ],
    "tags": [
      "Fundamentals",
      "Digital-IO",
      "Debounce",
      "LED",
      "ATmega328P"
    ]
  },
  {
    "id": "exp-analog-io",
    "num": "EXP 002",
    "title": "Analog Sampling & ADC Quantization",
    "category": "fundamentals",
    "difficulty": "beginner",
    "year": "2023",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "interactiveLabUrl": "fundamentals/analog-io.html",
    "summary": "Reading continuous analog voltage potentials with 10-bit Successive Approximation ADC.",
    "problem": "Physical real-world voltages are continuous curves, but digital computers process discrete binary integers.",
    "idea": "Sample pin A0 using ATmega328P internal SAR ADC, mapping 0.0V\u20135.0V potential into 1024 discrete steps (0\u20131023) at ~4.88mV resolution.",
    "flow": [
      "POTENTIOMETER DIAL",
      "VARIABLE VOLTAGE DIVIDER",
      "ADC CAPACITOR SAMPLE",
      "QUANTIZATION (10-BIT)",
      "SERIAL PLOT"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "10-bit ADC Processor"
      },
      {
        "name": "10k\u03a9 Potentiometer",
        "role": "Variable voltage divider"
      },
      {
        "name": "LDR Photoresistor",
        "role": "Light-dependent resistance"
      }
    ],
    "pinout": [
      {
        "mcu": "5V",
        "comp": "Potentiometer Pin 1",
        "desc": "High voltage rail reference"
      },
      {
        "mcu": "A0",
        "comp": "Potentiometer Wiper (Pin 2)",
        "desc": "Analog signal voltage into ADC"
      },
      {
        "mcu": "GND",
        "comp": "Potentiometer Pin 3",
        "desc": "Ground reference"
      }
    ],
    "code": "const int POT_PIN = A0;\n\nvoid setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  int rawADC = analogRead(POT_PIN);\n  float voltage = rawADC * (5.0 / 1023.0);\n  \n  Serial.print(\"Raw: \");\n  Serial.print(rawADC);\n  Serial.print(\" | Voltage: \");\n  Serial.print(voltage, 2);\n  Serial.println(\" V\");\n  \n  delay(100);\n}",
    "githubPath": "01-Fundamentals/Analog-IO",
    "lessons": [
      "ADC resolution is 5.0V / 1024 steps = 4.882 mV per LSB unit.",
      "Input impedance into analog pins must remain below 10k\u03a9 to properly charge internal S/H capacitor.",
      "Oversampling and rolling averages attenuate high-frequency noise spikes."
    ],
    "tags": [
      "Fundamentals",
      "ADC",
      "Analog-IO",
      "Sensors",
      "Voltage"
    ]
  },
  {
    "id": "exp-pwm",
    "num": "EXP 003",
    "title": "Fast PWM & Duty Cycle Modulation",
    "category": "fundamentals",
    "difficulty": "beginner",
    "year": "2023",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "interactiveLabUrl": "fundamentals/pwm.html",
    "summary": "Synthesizing pseudo-analog voltages using 490Hz/980Hz high-speed square wave pulse width modulation.",
    "problem": "Arduino Uno has no true Digital-to-Analog Converter (DAC) output pins to generate intermediate voltages like 2.5V.",
    "idea": "Rapidly cycle digital pin between 0V and 5V. The average DC voltage equals VCC \u00d7 (Duty Cycle / 255).",
    "flow": [
      "PWM REGISTER (OCR0B)",
      "TIMER COUNTER COMPARE",
      "FAST SWITCHING (490Hz)",
      "AVERAGE VOLTAGE",
      "LED PHOSPHOR FADE"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "Hardware Timer PWM Engine"
      },
      {
        "name": "LED 5mm",
        "role": "Visual brightness demonstration"
      },
      {
        "name": "220\u03a9 Resistor",
        "role": "Current limiting resistor"
      }
    ],
    "pinout": [
      {
        "mcu": "D9 (PWM ~)",
        "comp": "LED Anode (+)",
        "desc": "Hardware PWM Channel 1A"
      },
      {
        "mcu": "GND",
        "comp": "LED Cathode (-)",
        "desc": "Ground"
      }
    ],
    "code": "const int PWM_PIN = 9;\n\nvoid setup() {\n  pinMode(PWM_PIN, OUTPUT);\n}\n\nvoid loop() {\n  // Fade in\n  for (int b = 0; b <= 255; b += 5) {\n    analogWrite(PWM_PIN, b);\n    delay(20);\n  }\n  // Fade out\n  for (int b = 255; b >= 0; b -= 5) {\n    analogWrite(PWM_PIN, b);\n    delay(20);\n  }\n}",
    "githubPath": "01-Fundamentals/PWM",
    "lessons": [
      "Human eye perceives light intensity logarithmically, not linearly (gamma correction improves perceived smoothness).",
      "Pins D5 and D6 run at 980 Hz (Timer0), while D9, D10, D11, D3 run at 490 Hz (Timer1 & Timer2).",
      "Inductive motor loads require PWM frequency tuning to avoid audible magnetic coil whine."
    ],
    "tags": [
      "Fundamentals",
      "PWM",
      "Timers",
      "LED",
      "Analog"
    ]
  },
  {
    "id": "exp-interrupts",
    "num": "EXP 004",
    "title": "Hardware Interrupts & ISR Subroutines",
    "category": "fundamentals",
    "difficulty": "intermediate",
    "year": "2023",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "interactiveLabUrl": "fundamentals/interrupts.html",
    "summary": "Sub-microsecond asynchronous event handling using dedicated hardware interrupt lines INT0 and INT1.",
    "problem": "Polled I/O loops miss fast high-frequency pulses (e.g., optical encoder notches, emergency stop triggers) while sleeping in delays.",
    "idea": "Configure ATmega hardware vector table to halt CPU execution on RISING/FALLING edge and jump directly into an Interrupt Service Routine (ISR).",
    "flow": [
      "HARDWARE PIN TRANSITION",
      "EDGE DETECTOR TRIGGER",
      "HALT INSTRUCTION PIPELINE",
      "EXECUTE ISR ROUTINE",
      "RESUME MAIN LOOP"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "Interrupt Controller (INT0/INT1)"
      },
      {
        "name": "Rotary Encoder / Switch",
        "role": "Asynchronous pulse trigger"
      },
      {
        "name": "Debounce Capacitor (100nF)",
        "role": "Hardware low-pass filter"
      }
    ],
    "pinout": [
      {
        "mcu": "D2 (INT0)",
        "comp": "Pulse Source Pin",
        "desc": "Hardware Interrupt Vector 0"
      },
      {
        "mcu": "D13",
        "comp": "Status LED",
        "desc": "Toggled inside or signaled from ISR"
      }
    ],
    "code": "const byte INTERRUPT_PIN = 2;\nconst byte LED_PIN = 13;\nvolatile byte state = LOW;\n\nvoid setup() {\n  pinMode(LED_PIN, OUTPUT);\n  pinMode(INTERRUPT_PIN, INPUT_PULLUP);\n  attachInterrupt(digitalPinToInterrupt(INTERRUPT_PIN), handleInterrupt, FALLING);\n}\n\nvoid loop() {\n  digitalWrite(LED_PIN, state);\n}\n\nvoid handleInterrupt() {\n  state = !state;\n}",
    "githubPath": "01-Fundamentals/Interrupts",
    "lessons": [
      "Variables shared between ISR and main execution loops MUST be marked with the 'volatile' type qualifier to prevent compiler register caching.",
      "ISRs must execute in microseconds; never call delay(), Serial.print(), or I2C functions inside an ISR.",
      "Disable interrupts globally with cli() and re-enable with sei() when reading multi-byte volatile variables."
    ],
    "tags": [
      "Fundamentals",
      "Interrupts",
      "ISR",
      "Embedded",
      "Low-Level"
    ]
  },
  {
    "id": "exp-timers",
    "num": "EXP 005",
    "title": "Hardware Timers & Prescaler Registers",
    "category": "fundamentals",
    "difficulty": "intermediate",
    "year": "2023",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "interactiveLabUrl": "fundamentals/timers.html",
    "summary": "Deep dive into 8-bit & 16-bit ATmega328P timer counters (Timer0, Timer1, Timer2) and prescaler clock dividers.",
    "problem": "millis() timing has ~1ms jitter and timer resolution limits precision periodic sampling (such as 44.1kHz audio or PID motor loops).",
    "idea": "Configure Timer1 in CTC (Clear Timer on Compare Match) mode, setting OCR1A to trigger precision ISR ticks every 100 microseconds.",
    "flow": [
      "16MHz SYSTEM OSCILLATOR",
      "PRESCALER DIVIDER (/64)",
      "TCNT1 REGISTER INCREMENT",
      "COMPARE MATCH OCR1A",
      "TIMER1_COMPA_vect ISR"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "ATmega328P Hardware Silicon"
      },
      {
        "name": "16MHz Quartz Crystal",
        "role": "Base system clock oscillator"
      }
    ],
    "pinout": [
      {
        "mcu": "Silicon Internal",
        "comp": "Timer1 Register",
        "desc": "16-bit Hardware Timer Counter"
      },
      {
        "mcu": "D13",
        "comp": "Oscilloscope Output",
        "desc": "Toggle test waveform pin"
      }
    ],
    "code": "void setup() {\n  pinMode(13, OUTPUT);\n  cli(); // Stop interrupts\n  \n  // Configure Timer1 for 1kHz compare match\n  TCCR1A = 0;\n  TCCR1B = 0;\n  TCNT1  = 0;\n  OCR1A = 249; // (16*10^6) / (1000*64) - 1\n  TCCR1B |= (1 << WGM12); // CTC mode\n  TCCR1B |= (1 << CS11) | (1 << CS10); // 64 prescaler\n  TIMSK1 |= (1 << OCIE1A); // Enable timer compare interrupt\n  \n  sei(); // Enable interrupts\n}\n\nISR(TIMER1_COMPA_vect) {\n  PORTB ^= (1 << PORTB5); // Direct register toggle Pin 13\n}\n\nvoid loop() {\n  // Main execution is completely decoupled from 1kHz timer tick!\n}",
    "githubPath": "01-Fundamentals/Timers",
    "lessons": [
      "Timer0 drives millis() and delay(); modifying Timer0 registers will disrupt Arduino standard timing functions.",
      "Timer1 is 16-bit (counts to 65,535), providing massive dynamic range for audio frequencies and precision servos.",
      "Direct register toggling via PINB/PORTB takes 1 clock cycle (62.5ns) vs digitalWrite's ~50 clock cycles."
    ],
    "tags": [
      "Fundamentals",
      "Timers",
      "Registers",
      "ATmega328P",
      "Assembly"
    ]
  },
  {
    "id": "exp-serial-comm",
    "num": "EXP 006",
    "title": "UART Serial Stream & Buffer Timing",
    "category": "fundamentals",
    "difficulty": "beginner",
    "year": "2023",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "interactiveLabUrl": "fundamentals/serial-communication.html",
    "summary": "Asynchronous serial communication using hardware USART, ring buffers, and ASCII protocol parsing.",
    "problem": "Debugging hardware without a screen or receiving incoming commands from a host computer in real-time.",
    "idea": "Transmit 8-bit data packets framed with start and stop bits over TX/RX lines at 9600 to 115200 baud.",
    "flow": [
      "BYTE IN MEMORY",
      "USART DATA REGISTER (UDR0)",
      "SERIAL SHIFT REGISTER",
      "TX PIN (D1)",
      "USB-UART BRIDGE (ATmega16U2)"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "Hardware USART Engine"
      },
      {
        "name": "USB Cable",
        "role": "Host PC Communication"
      }
    ],
    "pinout": [
      {
        "mcu": "D0 (RX)",
        "comp": "Host TX",
        "desc": "Serial Data In (Ring Buffer 64-byte)"
      },
      {
        "mcu": "D1 (TX)",
        "comp": "Host RX",
        "desc": "Serial Data Out"
      }
    ],
    "code": "void setup() {\n  Serial.begin(115200);\n  while (!Serial);\n  Serial.println(F(\"UART Engine Online @ 115200 Baud.\"));\n}\n\nvoid loop() {\n  if (Serial.available() > 0) {\n    char cmd = Serial.read();\n    if (cmd == '1') {\n      digitalWrite(13, HIGH);\n      Serial.println(F(\"ACK: LED ON\"));\n    } else if (cmd == '0') {\n      digitalWrite(13, LOW);\n      Serial.println(F(\"ACK: LED OFF\"));\n    }\n  }\n}",
    "githubPath": "01-Fundamentals/Serial-Communication",
    "lessons": [
      "The Arduino Serial receive buffer is 64 bytes; failing to poll it before it overflows drops incoming characters.",
      "115200 baud transmits 1 byte every ~86.8\u00b5s; print strings consume execution time if baud is too slow.",
      "Using the F() macro puts static string literals into Flash PROGMEM instead of consuming precious 2KB SRAM."
    ],
    "tags": [
      "Fundamentals",
      "UART",
      "Serial",
      "Debugging",
      "Protocol"
    ]
  },
  {
    "id": "exp-ultrasonic",
    "num": "EXP 007",
    "title": "Ultrasonic Distance Sonar (HC-SR04)",
    "category": "sensors",
    "difficulty": "beginner",
    "year": "2024",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "summary": "Measuring distances with speed-of-sound physics using 40kHz acoustic pulses.",
    "problem": "Determining proximity and distance without physical mechanical contact.",
    "idea": "Emit a 10\u00b5s ultrasonic burst, measure echo return flight time, and calculate distance = (Time \u00d7 0.0343) / 2.",
    "flow": [
      "TRIGGER PULSE (10\u00b5s)",
      "40kHz ACOUSTIC BURST",
      "TARGET REFLECTION",
      "ECHO PIN HIGH",
      "DISTANCE CALC"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "Pulse timing & calculation"
      },
      {
        "name": "HC-SR04 Module",
        "role": "Piezo transmitter & receiver pair"
      },
      {
        "name": "Piezo Buzzer",
        "role": "Auditory proximity indicator"
      }
    ],
    "pinout": [
      {
        "mcu": "5V",
        "comp": "VCC",
        "desc": "Power Supply"
      },
      {
        "mcu": "GND",
        "comp": "GND",
        "desc": "Ground reference"
      },
      {
        "mcu": "D9",
        "comp": "TRIG",
        "desc": "Trigger pulse output"
      },
      {
        "mcu": "D10",
        "comp": "ECHO",
        "desc": "Echo duration input"
      }
    ],
    "code": "const int TRIG_PIN = 9;\nconst int ECHO_PIN = 10;\n\nvoid setup() {\n  pinMode(TRIG_PIN, OUTPUT);\n  pinMode(ECHO_PIN, INPUT);\n  Serial.begin(9600);\n}\n\nfloat readDistanceCm() {\n  digitalWrite(TRIG_PIN, LOW);\n  delayMicroseconds(2);\n  digitalWrite(TRIG_PIN, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(TRIG_PIN, LOW);\n\n  unsigned long duration = pulseIn(ECHO_PIN, HIGH, 30000);\n  if (duration == 0) return -1.0;\n  return (duration * 0.0343) / 2.0;\n}\n\nvoid loop() {\n  float dist = readDistanceCm();\n  if (dist > 0) {\n    Serial.print(\"Dist: \");\n    Serial.print(dist, 1);\n    Serial.println(\" cm\");\n  }\n  delay(100);\n}",
    "githubPath": "02-Sensors/Ultrasonic",
    "lessons": [
      "Speed of sound varies with air temperature: v = 331.3 + (0.606 \u00d7 T).",
      "Pulse timeout parameter in pulseIn() is vital to prevent hanging the main loop if an echo never returns.",
      "A 2\u00b5s LOW settling period before firing prevents false trigger bounces."
    ],
    "tags": [
      "Sensors",
      "HC-SR04",
      "Physics",
      "Ultrasonic",
      "Sound"
    ]
  },
  {
    "id": "exp-distance",
    "num": "EXP 008",
    "title": "Time-of-Flight Laser Distance (VL53L0X)",
    "category": "sensors",
    "difficulty": "intermediate",
    "year": "2024",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "summary": "Millimeter-precision photon flight measurement using 940nm VCSEL laser ranging.",
    "problem": "Ultrasonic sensors suffer from wide acoustic beam cones (15\u00b0) and bounce failures on soft fabrics or angled walls.",
    "idea": "Emit invisible 940nm laser photons and time their return flight using Single Photon Avalanche Diodes (SPAD array) over I2C.",
    "flow": [
      "VCSEL LASER EMITTER",
      "PHOTON FLIGHT TIME",
      "SPAD ARRAY DETECTOR",
      "INTERNAL DSP",
      "I2C REGISTER READ"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "I2C Bus Controller"
      },
      {
        "name": "VL53L0X ToF Module",
        "role": "Laser rangefinder IC"
      },
      {
        "name": "10k\u03a9 Pull-up Resistors",
        "role": "I2C Bus pullups"
      }
    ],
    "pinout": [
      {
        "mcu": "5V / 3.3V",
        "comp": "VIN",
        "desc": "Power (Onboard LDO)"
      },
      {
        "mcu": "GND",
        "comp": "GND",
        "desc": "Ground reference"
      },
      {
        "mcu": "A4 (SDA)",
        "comp": "SDA",
        "desc": "I2C Serial Data"
      },
      {
        "mcu": "A5 (SCL)",
        "comp": "SCL",
        "desc": "I2C Serial Clock"
      }
    ],
    "code": "#include <Wire.h>\n#include \"Adafruit_VL53L0X.h\"\n\nAdafruit_VL53L0X lox = Adafruit_VL53L0X();\n\nvoid setup() {\n  Serial.begin(115200);\n  Wire.begin();\n  if (!lox.begin()) {\n    Serial.println(F(\"Failed to boot VL53L0X!\"));\n    while (1);\n  }\n}\n\nvoid loop() {\n  VL53L0X_RangingMeasurementData_t measure;\n  lox.rangingTest(&measure, false);\n  if (measure.RangeStatus != 4) {\n    Serial.print(\"Distance: \");\n    Serial.print(measure.RangeMilliMeter);\n    Serial.println(\" mm\");\n  }\n  delay(100);\n}",
    "githubPath": "02-Sensors/Distance",
    "lessons": [
      "Laser time-of-flight eliminates acoustic beam divergence errors, measuring narrow millimeter spots.",
      "Extreme ambient sunlight can flood the SPAD array, reducing indoor 2m range to ~1m outdoors.",
      "Address conflicts on I2C can be solved by toggling the XSHUT shutdown pin to reassign addresses dynamically."
    ],
    "tags": [
      "Sensors",
      "Laser",
      "ToF",
      "I2C",
      "Distance"
    ]
  },
  {
    "id": "exp-dht11",
    "num": "EXP 009",
    "title": "DHT11 Temperature & Humidity Bus",
    "category": "sensors",
    "difficulty": "beginner",
    "year": "2024",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "summary": "Single-wire custom digital protocol decoding relative humidity and ambient temperature.",
    "problem": "Reading both relative humidity and ambient temperature reliably with low pin overhead.",
    "idea": "Initiate communication with 18ms LOW pulse; read 40-bit packet containing relative humidity, temperature, and checksum.",
    "flow": [
      "START PULSE (18ms LOW)",
      "SENSOR ACK (80\u00b5s)",
      "40-BIT STREAM",
      "PARITY CHECKSUM",
      "CELSIUS & %RH"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "Single-wire decoder"
      },
      {
        "name": "DHT11 Module",
        "role": "Capacitive humidity & NTC thermistor"
      },
      {
        "name": "4.7k\u03a9 Resistor",
        "role": "Data line pull-up"
      }
    ],
    "pinout": [
      {
        "mcu": "5V",
        "comp": "VCC",
        "desc": "Power"
      },
      {
        "mcu": "D2",
        "comp": "DATA",
        "desc": "Bidirectional single-wire bus"
      },
      {
        "mcu": "GND",
        "comp": "GND",
        "desc": "Ground"
      }
    ],
    "code": "#include \"DHT.h\"\n#define DHTPIN 2\n#define DHTTYPE DHT11\n\nDHT dht(DHTPIN, DHTTYPE);\n\nvoid setup() {\n  Serial.begin(9600);\n  dht.begin();\n}\n\nvoid loop() {\n  delay(2000); // 1Hz sampling max\n  float h = dht.readHumidity();\n  float t = dht.readTemperature();\n  if (isnan(h) || isnan(t)) return;\n  Serial.print(\"Humidity: \"); Serial.print(h); Serial.print(\" % | \");\n  Serial.print(\"Temp: \"); Serial.print(t); Serial.println(\" C\");\n}",
    "githubPath": "02-Sensors/Humidity",
    "lessons": [
      "DHT11 requires at least 1-2 seconds between read cycles due to slow capacitive sensor physics.",
      "The custom single-wire protocol timing (50\u00b5s vs 70\u00b5s pulses) must be decoded with microsecond interrupts.",
      "Checksum validation byte prevents erroneous reads caused by noise on long breadboard wire jumpers."
    ],
    "tags": [
      "Sensors",
      "DHT11",
      "Temperature",
      "Humidity",
      "Single-Wire"
    ]
  },
  {
    "id": "exp-imu",
    "num": "EXP 010",
    "title": "MPU6050 6-Axis Gyro & Accelerometer",
    "category": "sensors",
    "difficulty": "intermediate",
    "year": "2024",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "summary": "Sampling angular velocity and linear acceleration vectors over high-speed I2C with complementary filtering.",
    "problem": "Accelerometers are noisy during vibration; gyroscopes drift continuously over time without absolute reference.",
    "idea": "Combine high-frequency rate gyro integration with low-frequency gravity vector accelerometer using a complementary filter: Angle = 0.98 \u00d7 (Angle + Gyro \u00d7 dt) + 0.02 \u00d7 Accel.",
    "flow": [
      "MEMS PIEZO COMB",
      "CORIOLIS FORCE",
      "16-BIT ADC SAMPLES",
      "COMPLEMENTARY FILTER",
      "PITCH & ROLL ANGLE"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "Sensor Fusion Processor"
      },
      {
        "name": "MPU-6050 Module",
        "role": "6-Axis MEMS MotionTracking"
      },
      {
        "name": "OLED / Serial Plotter",
        "role": "Visual orientation feedback"
      }
    ],
    "pinout": [
      {
        "mcu": "5V",
        "comp": "VCC",
        "desc": "Power (Module has 3.3V LDO)"
      },
      {
        "mcu": "GND",
        "comp": "GND",
        "desc": "Ground"
      },
      {
        "mcu": "A4 (SDA)",
        "comp": "SDA",
        "desc": "I2C Serial Data"
      },
      {
        "mcu": "A5 (SCL)",
        "comp": "SCL",
        "desc": "I2C Serial Clock"
      },
      {
        "mcu": "D2",
        "comp": "INT",
        "desc": "Data Ready Hardware Interrupt"
      }
    ],
    "code": "#include <Wire.h>\nconst int MPU_ADDR = 0x68;\n\nint16_t AcX, AcY, AcZ, Tmp, GyX, GyY, GyZ;\n\nvoid setup() {\n  Wire.begin();\n  Wire.beginTransmission(MPU_ADDR);\n  Wire.write(0x6B); // PWR_MGMT_1 register\n  Wire.write(0);    // Wake up MPU-6050\n  Wire.endTransmission(true);\n  Serial.begin(115200);\n}\n\nvoid loop() {\n  Wire.beginTransmission(MPU_ADDR);\n  Wire.write(0x3B); // Starting with register 0x3B (ACCEL_XOUT_H)\n  Wire.endTransmission(false);\n  Wire.requestFrom(MPU_ADDR, 14, true);\n\n  AcX = Wire.read()<<8 | Wire.read();\n  AcY = Wire.read()<<8 | Wire.read();\n  AcZ = Wire.read()<<8 | Wire.read();\n  Tmp = Wire.read()<<8 | Wire.read();\n  GyX = Wire.read()<<8 | Wire.read();\n  GyY = Wire.read()<<8 | Wire.read();\n  GyZ = Wire.read()<<8 | Wire.read();\n\n  Serial.print(\"Pitch: \"); Serial.print(AcX);\n  Serial.print(\" | Roll: \"); Serial.println(AcY);\n  delay(50);\n}",
    "githubPath": "02-Sensors/IMU",
    "lessons": [
      "MEMS silicon beams deform under acceleration, varying capacitive combs read by internal 16-bit ADCs.",
      "Gyroscopes drift constantly; sensor fusion (Complementary or Kalman filter) is required for stable orientation.",
      "Register 0x6B must be initialized with 0 to wake the MPU6050 from its default low-power sleep state."
    ],
    "tags": [
      "Sensors",
      "IMU",
      "MPU6050",
      "I2C",
      "Robotics"
    ]
  },
  {
    "id": "exp-ir-sensor",
    "num": "EXP 011",
    "title": "Infrared Proximity & Reflectance",
    "category": "sensors",
    "difficulty": "beginner",
    "year": "2024",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "summary": "Detecting obstacle proximity and surface contrast using active infrared optical reflection.",
    "problem": "Fast obstacle avoidance in robots requires sub-millisecond reaction without acoustic echo wait times.",
    "idea": "Emit 940nm infrared light from an LED; phototransistor detects reflected light, evaluated against onboard comparator potentiometer threshold.",
    "flow": [
      "IR EMITTING LED",
      "OBJECT REFLECTION",
      "PHOTOTRANSISTOR",
      "LM393 COMPARATOR",
      "DIGITAL OUT LOW"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "Collision interrupt handler"
      },
      {
        "name": "IR Proximity Sensor",
        "role": "Optical transceiver pair"
      },
      {
        "name": "Trimpot",
        "role": "Sensitivity calibration"
      }
    ],
    "pinout": [
      {
        "mcu": "5V",
        "comp": "VCC",
        "desc": "Power supply"
      },
      {
        "mcu": "GND",
        "comp": "GND",
        "desc": "Ground"
      },
      {
        "mcu": "D3",
        "comp": "OUT",
        "desc": "Active LOW obstacle output"
      }
    ],
    "code": "const int IR_PIN  = 3;\nconst int LED_PIN = 13;\n\nvoid setup() {\n  pinMode(IR_PIN, INPUT);\n  pinMode(LED_PIN, OUTPUT);\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  int obstacle = (digitalRead(IR_PIN) == LOW);\n  digitalWrite(LED_PIN, obstacle ? HIGH : LOW);\n  if (obstacle) {\n    Serial.println(F(\"OBSTACLE DETECTED!\"));\n  }\n  delay(50);\n}",
    "githubPath": "02-Sensors/IR",
    "lessons": [
      "Dark matte black surfaces absorb IR light, causing sensors to fail to detect black objects.",
      "Most IR sensor modules output active-LOW due to open-collector comparator stages.",
      "Ambient fluorescent and incandescent lighting emits IR noise that can cause false triggers."
    ],
    "tags": [
      "Sensors",
      "IR",
      "Optical",
      "Robotics",
      "Proximity"
    ]
  },
  {
    "id": "exp-light",
    "num": "EXP 012",
    "title": "LDR Ambient Light Sensing & Calibration",
    "category": "sensors",
    "difficulty": "beginner",
    "year": "2024",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "summary": "Calibrating cadmium-sulfide photoresistors with hysteresis for smart adaptive illumination.",
    "problem": "Fixed threshold switches chatter rapidly on and off when ambient light wavers near threshold.",
    "idea": "Dynamically calibrate min/max ambient bounds on startup, and implement Schmitt-trigger hysteresis thresholds (20% ON, 30% OFF).",
    "flow": [
      "PHOTONS STRIKE CdS",
      "VALENCE ELECTRONS FREED",
      "RESISTANCE DROPS",
      "VOLTAGE DIVIDER SIGNAL",
      "HYSTERESIS ENGINE"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "ADC & Hysteresis Controller"
      },
      {
        "name": "LDR Photoresistor",
        "role": "Light-variable resistance"
      },
      {
        "name": "10k\u03a9 Resistor",
        "role": "Fixed voltage divider leg"
      }
    ],
    "pinout": [
      {
        "mcu": "5V",
        "comp": "LDR Pin 1",
        "desc": "High reference rail"
      },
      {
        "mcu": "A1",
        "comp": "LDR Pin 2 / 10k Resistor",
        "desc": "Analog divider node"
      },
      {
        "mcu": "GND",
        "comp": "10k Resistor Pin 2",
        "desc": "Ground rail"
      }
    ],
    "code": "const int LDR_PIN = A1;\nconst int LED_PIN = 13;\n\nint sensorMin = 1023;\nint sensorMax = 0;\n\nvoid setup() {\n  pinMode(LED_PIN, OUTPUT);\n  Serial.begin(9600);\n  while (millis() < 5000) {\n    int val = analogRead(LDR_PIN);\n    if (val < sensorMin) sensorMin = val;\n    if (val > sensorMax) sensorMax = val;\n  }\n}\n\nvoid loop() {\n  int raw = constrain(analogRead(LDR_PIN), sensorMin, sensorMax);\n  int lightPct = map(raw, sensorMin, sensorMax, 0, 100);\n  \n  if (lightPct < 20) {\n    digitalWrite(LED_PIN, HIGH);\n  } else if (lightPct > 30) {\n    digitalWrite(LED_PIN, LOW);\n  }\n  delay(100);\n}",
    "githubPath": "02-Sensors/Light",
    "lessons": [
      "Photoresistor resistance is inversely proportional to lux illumination: R = R0 \u00d7 (Lux)^-\u03b3.",
      "Hysteresis is essential in every automation threshold to prevent relay and contact chatter.",
      "Startup auto-calibration accommodates rooms with different natural sunlight and lamp types."
    ],
    "tags": [
      "Sensors",
      "LDR",
      "Analog",
      "Calibration",
      "Automation"
    ]
  },
  {
    "id": "exp-temperature",
    "num": "EXP 013",
    "title": "Analog Temperature Sensor & Voltage Conversion",
    "category": "sensors",
    "difficulty": "beginner",
    "year": "2024",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "summary": "Converting linear 10mV/\u00b0C analog voltages into precise temperature measurements.",
    "problem": "Accurately computing degrees Celsius from continuous microvolt potential shifts without digital sensor libraries.",
    "idea": "Sample LM35/TMP36 output: Vout = (ADC \u00d7 5.0 / 1024.0). Temperature \u00b0C = (Vout - 0.5) \u00d7 100.0.",
    "flow": [
      "SILICON JUNCTION VOLTAGE",
      "ANALOG PIN A0",
      "ADC 10-BIT QUANTIZATION",
      "VOLTAGE CONVERSION",
      "CELSIUS TEMPERATURE"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "ADC Controller"
      },
      {
        "name": "TMP36 / LM35 Sensor",
        "role": "Linear precision thermal sensor"
      },
      {
        "name": "0.1\u00b5F Capacitor",
        "role": "Power decoupling filter"
      }
    ],
    "pinout": [
      {
        "mcu": "5V",
        "comp": "Pin 1 (Vs)",
        "desc": "Regulated VCC"
      },
      {
        "mcu": "A0",
        "comp": "Pin 2 (Vout)",
        "desc": "Analog temperature signal"
      },
      {
        "mcu": "GND",
        "comp": "Pin 3 (GND)",
        "desc": "Ground"
      }
    ],
    "code": "const int TEMP_PIN = A0;\n\nvoid setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  int raw = analogRead(TEMP_PIN);\n  float voltage = raw * (5.0 / 1024.0);\n  float tempC = (voltage - 0.5) * 100.0;\n  \n  Serial.print(\"Voltage: \"); Serial.print(voltage, 3);\n  Serial.print(\" V | Temp: \"); Serial.print(tempC, 1);\n  Serial.println(\" deg C\");\n  delay(500);\n}",
    "githubPath": "02-Sensors/Temperature",
    "lessons": [
      "TMP36 outputs 500mV at 0\u00b0C with a linear 10mV/\u00b0C slope, eliminating negative supply voltage requirements.",
      "Switching the ADC reference to internal 1.1V (analogReference(INTERNAL)) increases resolution from 4.88mV to 1.07mV per step.",
      "Thermal mass causes delay in sensor stabilization when temperature changes abruptly."
    ],
    "tags": [
      "Sensors",
      "Temperature",
      "Analog",
      "Physics",
      "Thermodynamics"
    ]
  },
  {
    "id": "exp-leds",
    "num": "EXP 014",
    "title": "Multiplexed LED Sequences & PWM Breathing",
    "category": "actuators",
    "difficulty": "beginner",
    "year": "2023",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "summary": "Generating complex breathing lighting effects and shift register animations with Ohm's law current budgeting.",
    "problem": "Powering multiple LEDs simultaneously exceeds Arduino pin (40mA) and total package (200mA) current limits.",
    "idea": "Calculate individual resistor values: R = (VCC - V_forward) / I_led. Time-multiplex LED activations asynchronously.",
    "flow": [
      "CLOCK TICK",
      "DUTY CYCLE TABLE",
      "PORT REGISTER WRITE",
      "CURRENT-LIMIT RESISTOR",
      "LED DIODE LUMINESCENCE"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "Sequencer Engine"
      },
      {
        "name": "5x Red & Green LEDs",
        "role": "Bar graph array"
      },
      {
        "name": "5x 220\u03a9 Resistors",
        "role": "Independent current limiters"
      }
    ],
    "pinout": [
      {
        "mcu": "D8-D12",
        "comp": "LED Anodes (+)",
        "desc": "5 discrete digital outputs"
      },
      {
        "mcu": "GND",
        "comp": "Cathodes (-)",
        "desc": "Common ground bus"
      }
    ],
    "code": "const int ledPins[] = {8, 9, 10, 11, 12};\nconst int numPins = 5;\n\nvoid setup() {\n  for (int i = 0; i < numPins; i++) {\n    pinMode(ledPins[i], OUTPUT);\n  }\n}\n\nvoid loop() {\n  for (int i = 0; i < numPins; i++) {\n    digitalWrite(ledPins[i], HIGH);\n    delay(80);\n    digitalWrite(ledPins[i], LOW);\n  }\n  for (int i = numPins - 2; i > 0; i--) {\n    digitalWrite(ledPins[i], HIGH);\n    delay(80);\n    digitalWrite(ledPins[i], LOW);\n  }\n}",
    "githubPath": "03-Actuators/LEDs",
    "lessons": [
      "Never share a single resistor across multiple LEDs in parallel; forward voltages differ and cause uneven brightness.",
      "ATmega328P total current sourced across all VCC/GND pins combined must not exceed 200mA.",
      "Charlieplexing allows N pins to drive N \u00d7 (N - 1) LEDs using tri-state GPIO logic."
    ],
    "tags": [
      "Actuators",
      "LED",
      "Multiplexing",
      "PWM",
      "Electronics"
    ]
  },
  {
    "id": "exp-buzzers",
    "num": "EXP 015",
    "title": "Piezo Buzzer Frequencies & Melody Synthesis",
    "category": "actuators",
    "difficulty": "beginner",
    "year": "2023",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "summary": "Synthesizing musical scale melodies and alarm cadences using the hardware tone() frequency generator.",
    "problem": "Piezo buzzers require precise 50% duty cycle square wave frequencies to excite acoustic crystal resonance.",
    "idea": "Leverage Timer2 hardware CTC mode via tone(pin, frequency, duration) to emit exact musical pitches without blocking.",
    "flow": [
      "PITCH FREQUENCY (Hz)",
      "TIMER2 CTC WAVEFORM",
      "PIEZO CERAMIC DISK",
      "ACOUSTIC VIBRATION",
      "AUDIBLE MELODY"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "Audio Tone Generator"
      },
      {
        "name": "Passive Piezo Buzzer",
        "role": "Acoustic transducer"
      },
      {
        "name": "100\u03a9 Resistor",
        "role": "Volume and current buffer"
      }
    ],
    "pinout": [
      {
        "mcu": "D8",
        "comp": "Buzzer (+)",
        "desc": "Frequency Output"
      },
      {
        "mcu": "GND",
        "comp": "Buzzer (-)",
        "desc": "Ground"
      }
    ],
    "code": "#define NOTE_C4 262\n#define NOTE_G4 392\n#define NOTE_A4 440\n#define NOTE_C5 523\n\nconst int BUZZER_PIN = 8;\nint melody[] = {NOTE_C4, NOTE_G4, NOTE_A4, NOTE_C5};\nint noteDurations[] = {4, 4, 4, 2};\n\nvoid setup() {\n  for (int thisNote = 0; thisNote < 4; thisNote++) {\n    int noteDuration = 1000 / noteDurations[thisNote];\n    tone(BUZZER_PIN, melody[thisNote], noteDuration);\n    int pauseBetweenNotes = noteDuration * 1.30;\n    delay(pauseBetweenNotes);\n    noTone(BUZZER_PIN);\n  }\n}\n\nvoid loop() {}",
    "githubPath": "03-Actuators/Buzzers",
    "lessons": [
      "Active buzzers have an internal oscillator (only need DC voltage), while passive buzzers require an AC audio wave.",
      "The tone() library claims Timer2, which disables PWM capability on digital pins D3 and D11.",
      "Piezo elements generate high voltage spikes when physically struck (piezoelectric effect); a damping resistor protects the pin."
    ],
    "tags": [
      "Actuators",
      "Buzzer",
      "Audio",
      "Music",
      "Frequency"
    ]
  },
  {
    "id": "exp-servo",
    "num": "EXP 016",
    "title": "SG90 Micro Servo Position Kinematics",
    "category": "actuators",
    "difficulty": "beginner",
    "year": "2024",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "summary": "Precision angular shaft control (0\u00b0\u2013180\u00b0) using 50Hz PWM pulse duration modulation.",
    "problem": "Controlling mechanical angles precisely without complex external gearboxes or encoder feedback loops.",
    "idea": "Generate a 50Hz (20ms frame) pulse wave where pulse width corresponds to angle: 1000\u00b5s = 0\u00b0, 1500\u00b5s = 90\u00b0, 2000\u00b5s = 180\u00b0.",
    "flow": [
      "ANGLE REQUEST (90\u00b0)",
      "PULSE WIDTH (1500\u00b5s)",
      "SERVO INTERNAL POTENTIOMETER",
      "ERROR AMPLIFIER",
      "DC MOTOR TORQUE"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "Pulse Width Modulator"
      },
      {
        "name": "TowerPro SG90",
        "role": "9g Micro Servo Motor"
      },
      {
        "name": "100\u00b5F Capacitor",
        "role": "Current spike buffer"
      }
    ],
    "pinout": [
      {
        "mcu": "5V",
        "comp": "Red Wire (+)",
        "desc": "Servo Power (Prefer external supply)"
      },
      {
        "mcu": "GND",
        "comp": "Brown Wire (-)",
        "desc": "Common Ground"
      },
      {
        "mcu": "D9",
        "comp": "Orange Wire (Signal)",
        "desc": "50Hz Control PWM"
      }
    ],
    "code": "#include <Servo.h>\n\nServo myServo;\n\nvoid setup() {\n  myServo.attach(9);\n}\n\nvoid loop() {\n  // Sweep from 0 to 180 degrees\n  for (int pos = 0; pos <= 180; pos += 1) {\n    myServo.write(pos);\n    delay(15);\n  }\n  for (int pos = 180; pos >= 0; pos -= 1) {\n    myServo.write(pos);\n    delay(15);\n  }\n}",
    "githubPath": "03-Actuators/Servo",
    "lessons": [
      "Servos draw high stall current (up to 500mA each); powering multiple servos directly from Arduino 5V resets the board.",
      "The Arduino Servo library uses Timer1, which disables analogWrite() PWM on pins 9 and 10.",
      "Mechanical limits of cheap servos often range from 10\u00b0 to 170\u00b0 rather than a true 0\u00b0 to 180\u00b0."
    ],
    "tags": [
      "Actuators",
      "Servo",
      "Motors",
      "PWM",
      "Robotics"
    ]
  },
  {
    "id": "exp-dc-motors",
    "num": "EXP 017",
    "title": "DC Motor Speed & L298N Dual H-Bridge",
    "category": "actuators",
    "difficulty": "intermediate",
    "year": "2024",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "summary": "Bi-directional high-current motor control with PWM speed regulation and flyback back-EMF protection.",
    "problem": "Microcontroller pins cannot supply the 500mA\u20132A current required to drive DC motor coils, nor reverse voltage polarity.",
    "idea": "Use an H-bridge transistor array (L298N) to cross-switch current directions across motor terminals, controlling speed with PWM.",
    "flow": [
      "DIRECTION SIGNALS (IN1/IN2)",
      "PWM SPEED (ENA)",
      "H-BRIDGE TRANSISTORS",
      "MOTOR ROTATION",
      "FLYBACK DIODE DISSIPATION"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "Direction & PWM Controller"
      },
      {
        "name": "L298N Dual H-Bridge",
        "role": "Power amplification stage"
      },
      {
        "name": "TT DC Gearmotor",
        "role": "Electromechanical actuator"
      },
      {
        "name": "External Battery Pack (9V)",
        "role": "Motor power rail"
      }
    ],
    "pinout": [
      {
        "mcu": "D5",
        "comp": "ENA",
        "desc": "PWM Speed Control"
      },
      {
        "mcu": "D7",
        "comp": "IN1",
        "desc": "Motor Direction Forward"
      },
      {
        "mcu": "D8",
        "comp": "IN2",
        "desc": "Motor Direction Reverse"
      },
      {
        "mcu": "GND",
        "comp": "GND",
        "desc": "Common Ground Reference"
      }
    ],
    "code": "const int ENA = 5;\nconst int IN1 = 7;\nconst int IN2 = 8;\n\nvoid setup() {\n  pinMode(ENA, OUTPUT);\n  pinMode(IN1, OUTPUT);\n  pinMode(IN2, OUTPUT);\n}\n\nvoid setMotor(int speed, bool forward) {\n  analogWrite(ENA, constrain(speed, 0, 255));\n  digitalWrite(IN1, forward ? HIGH : LOW);\n  digitalWrite(IN2, forward ? LOW : HIGH);\n}\n\nvoid loop() {\n  setMotor(200, true);\n  delay(2000);\n  setMotor(0, true);\n  delay(500);\n  setMotor(200, false);\n  delay(2000);\n  setMotor(0, false);\n  delay(500);\n}",
    "githubPath": "03-Actuators/DC-Motors",
    "lessons": [
      "When a motor coil shuts off, magnetic collapse creates massive reverse voltage spikes (back-EMF); flyback diodes prevent silicon destruction.",
      "Logic ground and motor ground MUST be tied together for clean reference potentials, but power rails must remain isolated.",
      "BJT H-bridges like L298N drop ~2V as heat; modern MOSFET drivers (e.g. TB6612FNG) offer far higher efficiency."
    ],
    "tags": [
      "Actuators",
      "Motors",
      "H-Bridge",
      "L298N",
      "Power"
    ]
  },
  {
    "id": "exp-stepper",
    "num": "EXP 018",
    "title": "28BYJ-48 Stepper Wave Drive & Indexing",
    "category": "actuators",
    "difficulty": "intermediate",
    "year": "2024",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "summary": "Discrete angular indexing and open-loop positional locking using 4-phase unipolar stepper motor stepping.",
    "problem": "DC motors coast and lack precise rotational stepping without high-resolution optical shaft encoders.",
    "idea": "Sequentially energize 4 internal stator electromagnetic coils (A, B, C, D) using a ULN2003 Darlington array, advancing rotor in exact 5.625\u00b0/64 gear-reduced microsteps.",
    "flow": [
      "PHASE STEP SEQUENCER",
      "ULN2003 DARLINGTON ARRAY",
      "STATOR COILS ENERGIZED",
      "ROTOR GEAR ALIGNMENT",
      "LOCKED POSITION SHAFT"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "Step phase sequencer"
      },
      {
        "name": "28BYJ-48 Stepper",
        "role": "4-phase unipolar stepper (64:1 reduction)"
      },
      {
        "name": "ULN2003 Driver Board",
        "role": "High-current Darlington transistor array"
      }
    ],
    "pinout": [
      {
        "mcu": "D8, D9, D10, D11",
        "comp": "IN1, IN2, IN3, IN4",
        "desc": "Phase Stepping Output Pins"
      },
      {
        "mcu": "5V / GND",
        "comp": "Power Pins",
        "desc": "Coil power (external 5V recommended)"
      }
    ],
    "code": "#include <Stepper.h>\n\nconst int STEPS_PER_REV = 2048; // 32 steps * 64 gear reduction\nStepper myStepper(STEPS_PER_REV, 8, 10, 9, 11);\n\nvoid setup() {\n  myStepper.setSpeed(10); // 10 RPM\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  Serial.println(F(\"Clockwise Revolution...\"));\n  myStepper.step(STEPS_PER_REV);\n  delay(1000);\n  \n  Serial.println(F(\"Counter-Clockwise Revolution...\"));\n  myStepper.step(-STEPS_PER_REV);\n  delay(1000);\n}",
    "githubPath": "03-Actuators/Stepper-Motors",
    "lessons": [
      "The 28BYJ-48 gear reduction ratio is not exactly 64:1 (actual gear train ratio is 63.68395:1 or ~2038 steps/rev).",
      "Full-step drive provides maximum torque, whereas half-stepping doubles positional resolution and eliminates resonance vibration.",
      "Steppers draw full holding current continuously even when stationary; turn off coils when stationary if torque locking is not needed."
    ],
    "tags": [
      "Actuators",
      "Stepper",
      "ULN2003",
      "Motors",
      "Precision"
    ]
  },
  {
    "id": "exp-relays",
    "num": "EXP 019",
    "title": "Optocoupled Relay & AC Load Switching",
    "category": "actuators",
    "difficulty": "intermediate",
    "year": "2024",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "summary": "Galvanically isolated switching of high-voltage external AC and DC appliances using electromagnetic relay coils.",
    "problem": "Switching mains voltage (110V/230V AC) directly with low-voltage 5V digital pins is hazardous and destroys silicon.",
    "idea": "Use an internal infrared LED to optically trigger a phototransistor (optocoupler), completely isolating the microcontroller ground from high-power loads.",
    "flow": [
      "5V LOGIC LOW",
      "OPTOCOUPLER LED FIRES",
      "PNP TRANSISTOR CONDUCTS",
      "RELAY COIL ENERGIZED",
      "MECHANICAL CONTACT CLOSURE"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "Safe Logic Controller"
      },
      {
        "name": "5V Relay Module",
        "role": "Electromechanical switch with optoisolation"
      },
      {
        "name": "Appliance Load",
        "role": "Light bulb or AC appliance"
      }
    ],
    "pinout": [
      {
        "mcu": "5V",
        "comp": "VCC",
        "desc": "Optocoupler supply"
      },
      {
        "mcu": "GND",
        "comp": "GND",
        "desc": "Logic Ground"
      },
      {
        "mcu": "D4",
        "comp": "IN",
        "desc": "Active-LOW control pin"
      }
    ],
    "code": "const int RELAY_PIN = 4;\nconst int RELAY_ON  = LOW;  // Active-LOW relay\nconst int RELAY_OFF = HIGH;\n\nvoid setup() {\n  pinMode(RELAY_PIN, OUTPUT);\n  digitalWrite(RELAY_PIN, RELAY_OFF);\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  digitalWrite(RELAY_PIN, RELAY_ON);\n  Serial.println(F(\"Relay: ENERGIZED (Load ON)\"));\n  delay(3000);\n  \n  digitalWrite(RELAY_PIN, RELAY_OFF);\n  Serial.println(F(\"Relay: DE-ENERGIZED (Load OFF)\"));\n  delay(3000);\n}",
    "githubPath": "03-Actuators/Relays",
    "lessons": [
      "Most commercial relay modules are ACTIVE-LOW (writing LOW energizes the coil).",
      "Remove the JD-VCC jumper on relay boards to completely isolate relay coil power from the Arduino 5V rail.",
      "Never touch high-voltage AC mains wiring without proper grounding, fuses, and insulated enclosures."
    ],
    "tags": [
      "Actuators",
      "Relay",
      "Isolation",
      "Automation",
      "Power"
    ]
  },
  {
    "id": "exp-7segment",
    "num": "EXP 020",
    "title": "Time-Multiplexed 7-Segment Display",
    "category": "displays",
    "difficulty": "intermediate",
    "year": "2024",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "summary": "Controlling multiple numerical digit tubes with persistence-of-vision time-division multiplexing.",
    "problem": "A 4-digit 7-segment display has 32 individual LED segments, which exceeds available Arduino Uno I/O pins.",
    "idea": "Tie matching segments (A\u2013G) together in parallel and strobe digit common cathode pins sequentially at >60Hz to exploit human persistence of vision.",
    "flow": [
      "DECIMAL VALUE",
      "BITMASK LOOKUP TABLE",
      "SEGMENT PORT WRITE",
      "ENABLE DIGIT CATHODE",
      "PERSISTENCE OF VISION"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "Time multiplexing processor"
      },
      {
        "name": "7-Segment 4-Digit Display",
        "role": "Common cathode LED module"
      },
      {
        "name": "8x 220\u03a9 Resistors",
        "role": "Current limiting for segments A-G, DP"
      }
    ],
    "pinout": [
      {
        "mcu": "D2-D8",
        "comp": "Segments A-G",
        "desc": "Anode control lines via 220\u03a9"
      },
      {
        "mcu": "D9-D12",
        "comp": "Digits 1-4",
        "desc": "Common Cathode control lines"
      }
    ],
    "code": "const byte digitCodes[10] = {\n  0b00111111, // 0\n  0b00000110, // 1\n  0b01011011, // 2\n  0b01001111, // 3\n  0b01100110, // 4\n  0b01101101, // 5\n  0b01111101, // 6\n  0b00000111, // 7\n  0b01111111, // 8\n  0b01101111  // 9\n};\n\nvoid setup() {\n  for (int p = 2; p <= 12; p++) pinMode(p, OUTPUT);\n}\n\nvoid loop() {\n  // Strobe digits rapidly\n}",
    "githubPath": "04-Displays/7-Segment",
    "lessons": [
      "Human eye retina retains image pulses for ~10ms; switching digits at >100Hz makes all 4 digits appear solid.",
      "Resistors must be on segment lines, not common cathode lines, or digits will change brightness depending on number of lit segments.",
      "Using a shift register (74HC595) reduces required pin count from 12 down to just 3 pins."
    ],
    "tags": [
      "Displays",
      "7-Segment",
      "Multiplexing",
      "Hardware",
      "POV"
    ]
  },
  {
    "id": "exp-lcd",
    "num": "EXP 021",
    "title": "HD44780 16x2 Character LCD Interface",
    "category": "displays",
    "difficulty": "beginner",
    "year": "2024",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "summary": "Driving alphanumeric liquid crystal matrices via 4-bit parallel buses and custom character CGRAM.",
    "problem": "Viewing live telemetry without needing an attached computer serial monitor window.",
    "idea": "Initialize HD44780 controller into 4-bit nibble mode to render two rows of 16 characters with custom bitmap icons.",
    "flow": [
      "CHARACTER STRING",
      "ASCII NIBBLE SPLIT",
      "RS & ENABLE CLOCKING",
      "CGRAM PATTERN GENERATION",
      "LIQUID CRYSTAL TWIST"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "Bus Controller"
      },
      {
        "name": "16x2 LCD Display",
        "role": "Hitachi HD44780 controller"
      },
      {
        "name": "10k\u03a9 Potentiometer",
        "role": "Contrast bias adjuster"
      },
      {
        "name": "220\u03a9 Resistor",
        "role": "Backlight current limiter"
      }
    ],
    "pinout": [
      {
        "mcu": "D12",
        "comp": "RS",
        "desc": "Register Select (Command vs Data)"
      },
      {
        "mcu": "D11",
        "comp": "E",
        "desc": "Enable Strobe Clock"
      },
      {
        "mcu": "D5, D4, D3, D2",
        "comp": "D4, D5, D6, D7",
        "desc": "High Nibble Data Bus"
      },
      {
        "mcu": "5V / GND",
        "comp": "VSS / VDD / A / K",
        "desc": "Logic & Backlight Power"
      }
    ],
    "code": "#include <LiquidCrystal.h>\n\nconst int rs = 12, en = 11, d4 = 5, d5 = 4, d6 = 3, d7 = 2;\nLiquidCrystal lcd(rs, en, d4, d5, d6, d7);\n\nvoid setup() {\n  lcd.begin(16, 2);\n  lcd.print(\"HARDWARE LAB\");\n  lcd.setCursor(0, 1);\n  lcd.print(\"ONLINE & READY\");\n}\n\nvoid loop() {\n  lcd.setCursor(11, 1);\n  lcd.print(millis() / 1000);\n}",
    "githubPath": "04-Displays/LCD",
    "lessons": [
      "Contrast pin V0 requires ~0.5V-1.0V; leaving V0 floating or at 5V causes characters to be completely invisible.",
      "4-bit mode halves wiring requirements (from 8 data pins to 4) with virtually zero human-visible latency difference.",
      "An I2C PCF8574 backpack reduces LCD wiring down to just 2 pins (SDA & SCL)."
    ],
    "tags": [
      "Displays",
      "LCD",
      "HD44780",
      "Parallel",
      "Telemetry"
    ]
  },
  {
    "id": "exp-serial-monitor",
    "num": "EXP 022",
    "title": "Serial Plotter Waveforms & Telemetry Stream",
    "category": "displays",
    "difficulty": "beginner",
    "year": "2024",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "summary": "Generating multi-variable labeled telemetry streams that render as colored real-time graphs in the Arduino Serial Plotter.",
    "problem": "Viewing raw numbers in text makes it difficult to spot noise, resonance oscillations, or filter phase shifts.",
    "idea": "Format comma-separated numerical values with text header tags: 'SineWave:50,FilteredAverage:42' for automatic multi-trace real-time plotting.",
    "flow": [
      "MATHEMATICAL GENERATOR",
      "LOW-PASS FILTER",
      "CSV STREAM FORMATTER",
      "UART BUFFER TRANSMIT",
      "SERIAL PLOTTER GRAPH"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "Signal processing & math"
      },
      {
        "name": "Host PC",
        "role": "Arduino IDE Serial Plotter"
      }
    ],
    "pinout": [
      {
        "mcu": "USB Port",
        "comp": "Virtual COM",
        "desc": "115200 Baud Data Stream"
      }
    ],
    "code": "float phase = 0.0;\n\nvoid setup() {\n  Serial.begin(115200);\n  Serial.println(F(\"SineWave,NoisySignal,FilteredAverage\"));\n}\n\nvoid loop() {\n  float sineVal = sin(phase) * 50.0;\n  float noisy = sineVal + random(-15, 15);\n  \n  static float filtered = 0.0;\n  filtered = (filtered * 0.85) + (noisy * 0.15);\n  \n  Serial.print(sineVal); Serial.print(\",\");\n  Serial.print(noisy); Serial.print(\",\");\n  Serial.println(filtered);\n  \n  phase += 0.1;\n  delay(30);\n}",
    "githubPath": "04-Displays/Serial-Monitor",
    "lessons": [
      "The Arduino Serial Plotter automatically scales axes; keep reference upper and lower bounds to prevent erratic jumps.",
      "Higher baud rates (115200) prevent UART transmission delays from slowing down fast sampling algorithms.",
      "First-order exponential moving average filters provide efficient real-time smoothing without heavy math libraries."
    ],
    "tags": [
      "Displays",
      "Serial",
      "Plotter",
      "Waveforms",
      "Telemetry"
    ]
  },
  {
    "id": "exp-bluetooth",
    "num": "EXP 023",
    "title": "HC-05 Bluetooth SPP Wireless Telemetry",
    "category": "communication",
    "difficulty": "intermediate",
    "year": "2024",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "summary": "Wireless 2.4GHz Serial Port Profile (SPP) bi-directional communication with smartphones and PCs.",
    "problem": "Cables tether robots and data loggers, preventing remote command and mobile telemetry.",
    "idea": "Bridge UART serial bytes transparently over 2.4GHz Bluetooth RF using an HC-05 transceiver module with AT command configuration.",
    "flow": [
      "SMARTPHONE APP",
      "BLUETOOTH RF PACKET",
      "HC-05 BASEBAND",
      "UART RX PIN",
      "COMMAND DISPATCHER"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "Host MCU Controller"
      },
      {
        "name": "HC-05 Bluetooth Module",
        "role": "2.4GHz SPP Transceiver"
      },
      {
        "name": "Voltage Divider (1k\u03a9 / 2k\u03a9)",
        "role": "3.3V RX logic protection"
      }
    ],
    "pinout": [
      {
        "mcu": "5V",
        "comp": "VCC",
        "desc": "Power Supply"
      },
      {
        "mcu": "GND",
        "comp": "GND",
        "desc": "Ground"
      },
      {
        "mcu": "D10 (RX)",
        "comp": "TXD",
        "desc": "From HC-05 (5V Safe)"
      },
      {
        "mcu": "D11 (TX)",
        "comp": "RXD",
        "desc": "To HC-05 (via 1k/2k Divider)"
      }
    ],
    "code": "#include <SoftwareSerial.h>\n\nSoftwareSerial btSerial(10, 11); // RX, TX\n\nvoid setup() {\n  Serial.begin(9600);\n  btSerial.begin(9600);\n  Serial.println(F(\"Bluetooth Link Ready.\"));\n}\n\nvoid loop() {\n  if (btSerial.available()) {\n    char c = btSerial.read();\n    Serial.write(c);\n  }\n  if (Serial.available()) {\n    char c = Serial.read();\n    btSerial.write(c);\n  }\n}",
    "githubPath": "05-Communication/Bluetooth",
    "lessons": [
      "The HC-05 RX pin is 3.3V logic; connecting directly to a 5V Arduino TX pin can degrade or destroy the radio chip.",
      "Entering AT command mode requires holding the onboard KEY pin HIGH during power-up at 38400 baud.",
      "Wireless packet transmission introduces 15-40ms latency; protocols must account for packet fragmentation."
    ],
    "tags": [
      "Communication",
      "Bluetooth",
      "Wireless",
      "UART",
      "HC-05"
    ]
  },
  {
    "id": "exp-i2c",
    "num": "EXP 024",
    "title": "I2C Two-Wire Inter-Integrated Circuit Bus",
    "category": "communication",
    "difficulty": "intermediate",
    "year": "2024",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "summary": "Master-slave bidirectional communication over a shared 2-wire open-drain bus with 7-bit addressing.",
    "problem": "Connecting dozens of sensors and displays individually consumes all available microcontroller pins.",
    "idea": "Share two lines (SDA and SCL) across up to 127 devices using open-drain bus architecture and pull-up resistors.",
    "flow": [
      "START CONDITION (SDA LOW)",
      "7-BIT ADDRESS + R/W",
      "SLAVE ACK BIT",
      "8-BIT REGISTER DATA",
      "STOP CONDITION"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "I2C Master"
      },
      {
        "name": "Secondary Arduino / Sensor",
        "role": "I2C Slave (Addr 0x08)"
      },
      {
        "name": "2x 4.7k\u03a9 Resistors",
        "role": "Bus pull-up resistors"
      }
    ],
    "pinout": [
      {
        "mcu": "A4",
        "comp": "SDA",
        "desc": "Serial Data Line"
      },
      {
        "mcu": "A5",
        "comp": "SCL",
        "desc": "Serial Clock Line"
      },
      {
        "mcu": "GND",
        "comp": "GND",
        "desc": "Common Ground Reference"
      }
    ],
    "code": "#include <Wire.h>\n#define SLAVE_ADDR 0x08\n\nvoid setup() {\n  Wire.begin(); // Master mode\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  Wire.beginTransmission(SLAVE_ADDR);\n  Wire.write(\"PING\");\n  Wire.endTransmission();\n  \n  delay(50);\n  Wire.requestFrom(SLAVE_ADDR, 4);\n  while (Wire.available()) {\n    char c = Wire.read();\n    Serial.print(c);\n  }\n  Serial.println();\n  delay(1000);\n}",
    "githubPath": "05-Communication/I2C",
    "lessons": [
      "I2C is an open-drain bus: devices can only pull lines LOW; external pull-up resistors pull them HIGH.",
      "Bus capacitance limits wire length to ~1-2 meters before rise-time degradation corrupts clock transitions.",
      "Clock stretching allows slower slave devices to hold SCL LOW while preparing register data."
    ],
    "tags": [
      "Communication",
      "I2C",
      "Wire",
      "Protocols",
      "Bus"
    ]
  },
  {
    "id": "exp-spi",
    "num": "EXP 025",
    "title": "SPI High-Speed Synchronous Peripheral Bus",
    "category": "communication",
    "difficulty": "intermediate",
    "year": "2024",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "summary": "Full-duplex synchronous data streaming at up to 8 MHz clock speeds using dedicated chip-select lines.",
    "problem": "I2C 400kHz speed is too slow for graphic displays, high-speed SD cards, and fast audio DACs.",
    "idea": "Transmit data simultaneously in both directions on separate MOSI and MISO lines, synchronized by a master SCK clock.",
    "flow": [
      "SELECT SLAVE (CS LOW)",
      "SCK CLOCK TICK (8MHz)",
      "MOSI DATA SHIFT OUT",
      "MISO DATA SHIFT IN",
      "DESELECT SLAVE (CS HIGH)"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "Hardware SPI Master"
      },
      {
        "name": "SPI Device / Secondary MCU",
        "role": "SPI Slave"
      },
      {
        "name": "Decoupling Cap",
        "role": "High-frequency noise filter"
      }
    ],
    "pinout": [
      {
        "mcu": "D13",
        "comp": "SCK",
        "desc": "Hardware Serial Clock"
      },
      {
        "mcu": "D11",
        "comp": "MOSI",
        "desc": "Master Out Slave In"
      },
      {
        "mcu": "D12",
        "comp": "MISO",
        "desc": "Master In Slave Out"
      },
      {
        "mcu": "D10",
        "comp": "CS / SS",
        "desc": "Chip Select (Active LOW)"
      }
    ],
    "code": "#include <SPI.h>\n\nconst int CS_PIN = 10;\n\nvoid setup() {\n  pinMode(CS_PIN, OUTPUT);\n  digitalWrite(CS_PIN, HIGH);\n  SPI.begin();\n  Serial.begin(9600);\n}\n\nbyte transferByte(byte dataOut) {\n  digitalWrite(CS_PIN, LOW);\n  byte dataIn = SPI.transfer(dataOut);\n  digitalWrite(CS_PIN, HIGH);\n  return dataIn;\n}\n\nvoid loop() {\n  byte resp = transferByte(0xAA);\n  Serial.print(\"SPI Resp: 0x\");\n  Serial.println(resp, HEX);\n  delay(1000);\n}",
    "githubPath": "05-Communication/SPI",
    "lessons": [
      "SPI operates in full duplex: every byte sent out automatically shifts a byte back in simultaneously.",
      "SPI has 4 modes based on Clock Polarity (CPOL) and Clock Phase (CPHA); mismatch causes corrupt reads.",
      "Unlike I2C, SPI requires a dedicated CS (Chip Select) wire for each peripheral on the bus."
    ],
    "tags": [
      "Communication",
      "SPI",
      "High-Speed",
      "Full-Duplex",
      "Protocols"
    ]
  },
  {
    "id": "exp-uart",
    "num": "EXP 026",
    "title": "SoftwareSerial Multi-Port Asynchronous UART",
    "category": "communication",
    "difficulty": "intermediate",
    "year": "2024",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "summary": "Emulating additional hardware UART serial ports using pin-change interrupts and bit-banging timing.",
    "problem": "Arduino Uno has only 1 hardware serial port (pins 0 & 1), which is already claimed by the USB programming cable.",
    "idea": "Bit-bang UART packet timing on general-purpose digital pins using SoftwareSerial to talk simultaneously to GPS, Bluetooth, or modems.",
    "flow": [
      "PIN CHANGE INTERRUPT",
      "START BIT DETECTED",
      "BIT TIME SAMPLING DELAY",
      "BYTE ASSEMBLY",
      "SERIAL BUFFER STORE"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "Bit-banging controller"
      },
      {
        "name": "Serial GPS / Modem Module",
        "role": "Auxiliary UART peripheral"
      }
    ],
    "pinout": [
      {
        "mcu": "D10",
        "comp": "RX",
        "desc": "SoftwareSerial Receive (Pin Change Interrupt)"
      },
      {
        "mcu": "D11",
        "comp": "TX",
        "desc": "SoftwareSerial Transmit"
      }
    ],
    "code": "#include <SoftwareSerial.h>\n\nSoftwareSerial myPort(10, 11); // RX, TX\n\nvoid setup() {\n  Serial.begin(9600);    // Host PC\n  myPort.begin(9600);    // External Module\n  Serial.println(F(\"Dual UART Bridge Active.\"));\n}\n\nvoid loop() {\n  if (myPort.available()) {\n    Serial.write(myPort.read());\n  }\n  if (Serial.available()) {\n    myPort.write(Serial.read());\n  }\n}",
    "githubPath": "05-Communication/UART",
    "lessons": [
      "SoftwareSerial disables interrupts during byte transmission, which can disrupt servo timing and millis() precision.",
      "SoftwareSerial is unreliable above 38400 baud due to instruction cycle timing limitations on 16MHz AVR chips.",
      "Only one SoftwareSerial instance can listen for incoming bytes at any given moment."
    ],
    "tags": [
      "Communication",
      "UART",
      "SoftwareSerial",
      "Bit-Banging",
      "Telemetry"
    ]
  },
  {
    "id": "exp-wifi-iot",
    "num": "EXP 027",
    "title": "ESP8266 Wi-Fi Network & HTTP Telemetry",
    "category": "communication",
    "difficulty": "advanced",
    "year": "2024",
    "platform": "Arduino UNO + ESP8266",
    "language": "C++",
    "status": "COMPLETED",
    "summary": "Connecting physical hardware to local 802.11 b/g/n wireless networks and publishing sensor data via HTTP REST.",
    "problem": "Accessing real-time sensor metrics globally over the internet without expensive cellular modems.",
    "idea": "Interface AT-command firmware on an ESP8266 Wi-Fi co-processor to join LAN access points and send HTTP GET/POST telemetry payloads.",
    "flow": [
      "SENSOR MEASUREMENT",
      "AT+CIPSTART TCP CONNECTION",
      "HTTP POST PAYLOAD",
      "ROUTER 802.11 TRANSMISSION",
      "CLOUD DASHBOARD"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "Master Sensor Poller"
      },
      {
        "name": "ESP8266 ESP-01",
        "role": "Wi-Fi Co-Processor"
      },
      {
        "name": "3.3V Dedicated Regulator",
        "role": "Peak 300mA RF current supply"
      }
    ],
    "pinout": [
      {
        "mcu": "3.3V (Ext)",
        "comp": "VCC & CH_PD",
        "desc": "Power (Must supply >250mA)"
      },
      {
        "mcu": "GND",
        "comp": "GND",
        "desc": "Common Ground"
      },
      {
        "mcu": "D6 (RX)",
        "comp": "TX",
        "desc": "ESP8266 UART Out"
      },
      {
        "mcu": "D7 (TX)",
        "comp": "RX",
        "desc": "ESP8266 UART In (via 3.3V divider)"
      }
    ],
    "code": "#include <SoftwareSerial.h>\nSoftwareSerial espSerial(6, 7); // RX, TX\n\nvoid setup() {\n  Serial.begin(9600);\n  espSerial.begin(9600);\n  Serial.println(F(\"Connecting to WiFi...\"));\n  espSerial.println(\"AT+RST\");\n  delay(1000);\n  espSerial.println(\"AT+CWMODE=1\");\n  delay(500);\n  espSerial.println(\"AT+CWJAP=\\\"SSID\\\",\\\"PASSWORD\\\"\");\n}\n\nvoid loop() {\n  if (espSerial.available()) {\n    Serial.write(espSerial.read());\n  }\n}",
    "githubPath": "05-Communication/WiFi",
    "lessons": [
      "The ESP8266 draws brief 200-300mA current spikes during RF packet bursts; powering it from the Arduino Uno 3.3V rail causes brownouts.",
      "The ESP8266 RX pin is NOT 5V tolerant; a resistor divider or level shifter is mandatory.",
      "TCP connections require timeout handling to prevent firmware locks if the access point drops."
    ],
    "tags": [
      "Communication",
      "IoT",
      "WiFi",
      "ESP8266",
      "Cloud"
    ]
  },
  {
    "id": "exp-greenhouse",
    "num": "EXP 028",
    "title": "Closed-Loop Greenhouse Environment Automation",
    "category": "automation",
    "difficulty": "intermediate",
    "year": "2024",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "summary": "Autonomous greenhouse climate regulation: soil moisture irrigation, humidity monitoring, and LCD state updates.",
    "problem": "Plants perish from under-watering or over-watering when dependent on manual scheduled human maintenance.",
    "idea": "Read capacitive/resistive soil moisture and DHT11 air humidity. If soil falls below 35%, activate 5V water pump relay for 3 seconds with a 30-minute lockout.",
    "flow": [
      "SOIL RESISTANCE READ",
      "THRESHOLD COMPARATOR",
      "RELAY COIL ENERGIZED",
      "SUBMERSIBLE WATER PUMP",
      "HYDRATION LEVEL RESTORED"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "Autonomous System Brain"
      },
      {
        "name": "Soil Moisture Probe",
        "role": "Root-zone conductivity measurement"
      },
      {
        "name": "5V Submersible Pump",
        "role": "Water irrigation actuator"
      },
      {
        "name": "16x2 I2C LCD",
        "role": "Live environmental dashboard"
      }
    ],
    "pinout": [
      {
        "mcu": "A0",
        "comp": "Soil Probe",
        "desc": "Analog Soil Moisture"
      },
      {
        "mcu": "D4",
        "comp": "Relay Module IN",
        "desc": "Water Pump Relay Trigger"
      },
      {
        "mcu": "D5",
        "comp": "DHT11 DATA",
        "desc": "Ambient Humidity Sensor"
      },
      {
        "mcu": "A4/A5",
        "comp": "LCD SDA/SCL",
        "desc": "I2C Dashboard Display"
      }
    ],
    "code": "const int SOIL_PIN = A0;\nconst int PUMP_PIN = 4;\nconst int DRY_THRESHOLD = 35; // %\nunsigned long lastWaterTime = 0;\nconst unsigned long LOCKOUT = 1800000; // 30 min\n\nvoid setup() {\n  pinMode(PUMP_PIN, OUTPUT);\n  digitalWrite(PUMP_PIN, HIGH); // OFF (Active Low)\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  int raw = analogRead(SOIL_PIN);\n  int moisture = map(raw, 1023, 300, 0, 100);\n  \n  if (moisture < DRY_THRESHOLD && (millis() - lastWaterTime > LOCKOUT)) {\n    Serial.println(F(\"Soil dry! Pumping water...\"));\n    digitalWrite(PUMP_PIN, LOW); // ON\n    delay(3000);\n    digitalWrite(PUMP_PIN, HIGH); // OFF\n    lastWaterTime = millis();\n  }\n  delay(1000);\n}",
    "githubPath": "06-Automation/Environment-Monitoring",
    "lessons": [
      "DC soil probes corrode quickly from electrolysis if powered continuously; power probe only during measurement pulses.",
      "Lockout timeouts prevent flooded soil caused by slow water dispersion through dry soil particles.",
      "Inductive flyback diodes across the pump motor terminals protect the relay and microcontroller."
    ],
    "tags": [
      "Automation",
      "Greenhouse",
      "Irrigation",
      "Sensors",
      "Relay"
    ]
  },
  {
    "id": "exp-rover",
    "num": "EXP 029",
    "title": "Autonomous Obstacle Evasion Mobile Rover",
    "category": "automation",
    "difficulty": "advanced",
    "year": "2025",
    "platform": "Arduino UNO + Dual Motor Chassis",
    "language": "C++",
    "status": "COMPLETED",
    "summary": "Autonomous differential drive robot chassis with sweeping sonar turret and spatial path planning.",
    "problem": "Mobile platforms collide with walls and become trapped in dead-ends without reactive spatial awareness.",
    "idea": "Mount HC-SR04 sonar on an SG90 servo turret; sweep 30\u00b0\u2013150\u00b0 upon detecting obstacles under 20cm, selecting the path with maximum clearance.",
    "flow": [
      "SONAR FORWARD RANGING",
      "OBSTACLE DETECTED (<20cm)",
      "TURRET SWEEPS LEFT & RIGHT",
      "CLEARANCE PATH SELECTED",
      "L298N DIFFERENTIAL TURN"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "Kinematics & Navigation Brain"
      },
      {
        "name": "L298N Dual H-Bridge",
        "role": "DC Motor Power Driver"
      },
      {
        "name": "HC-SR04 Sonar",
        "role": "Distance sensing"
      },
      {
        "name": "SG90 Micro Servo",
        "role": "Panning radar turret"
      },
      {
        "name": "2x DC Gearmotors",
        "role": "Differential drive wheels"
      }
    ],
    "pinout": [
      {
        "mcu": "D5, D6",
        "comp": "L298N ENA, ENB",
        "desc": "PWM Speed Regulation"
      },
      {
        "mcu": "D7, D8",
        "comp": "L298N IN1, IN2",
        "desc": "Left Motor Direction"
      },
      {
        "mcu": "D9, D10",
        "comp": "HC-SR04 TRIG, ECHO",
        "desc": "Sonar Transceiver"
      },
      {
        "mcu": "D11",
        "comp": "SG90 PWM",
        "desc": "Turret Angle Servo"
      }
    ],
    "code": "#include <Servo.h>\n\nconst int TRIG_PIN = 9, ECHO_PIN = 10;\nconst int LEFT_PWM = 5, RIGHT_PWM = 6;\nServo turret;\n\nvoid setup() {\n  pinMode(TRIG_PIN, OUTPUT);\n  pinMode(ECHO_PIN, INPUT);\n  pinMode(LEFT_PWM, OUTPUT);\n  pinMode(RIGHT_PWM, OUTPUT);\n  turret.attach(11);\n  turret.write(90);\n}\n\nfloat getDist() {\n  digitalWrite(TRIG_PIN, LOW); delayMicroseconds(2);\n  digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10);\n  digitalWrite(TRIG_PIN, LOW);\n  long dur = pulseIn(ECHO_PIN, HIGH, 25000);\n  return (dur == 0) ? 999.0 : (dur * 0.0343) / 2.0;\n}\n\nvoid loop() {\n  if (getDist() < 20.0) {\n    analogWrite(LEFT_PWM, 0); analogWrite(RIGHT_PWM, 0);\n    turret.write(30); delay(300);\n    float r = getDist();\n    turret.write(150); delay(300);\n    float l = getDist();\n    turret.write(90);\n    if (l > r) {\n      analogWrite(LEFT_PWM, 0); analogWrite(RIGHT_PWM, 180);\n    } else {\n      analogWrite(LEFT_PWM, 180); analogWrite(RIGHT_PWM, 0);\n    }\n    delay(400);\n  } else {\n    analogWrite(LEFT_PWM, 200); analogWrite(RIGHT_PWM, 200);\n  }\n}",
    "githubPath": "06-Automation/Motor-Automation",
    "lessons": [
      "Motor back-EMF resets the microcontroller without independent power supplies and flyback diode isolation.",
      "Dead reckoning orientation drifts over time; sensor fusion with encoders or compass improves accuracy.",
      "Stopping and scanning before turning drastically reduces collisions compared to turning blindly."
    ],
    "tags": [
      "Automation",
      "Robotics",
      "HC-SR04",
      "Motors",
      "AI"
    ]
  },
  {
    "id": "exp-security-alarm",
    "num": "EXP 030",
    "title": "Multi-Zone Anti-Intruder Security Alarm",
    "category": "automation",
    "difficulty": "intermediate",
    "year": "2024",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "summary": "Dual-sensor intruder detection with PIR pyroelectric motion, sonar boundary tripwires, and audio sirens.",
    "problem": "Single sensor alarms trigger frequent false alarms from air currents or thermal shifts.",
    "idea": "Require concurrent verification: PIR detects biological body heat while HC-SR04 confirms physical boundary entry before arming siren.",
    "flow": [
      "PIR THERMAL DETECTION",
      "SONAR DISTANCE TRIPWIRE",
      "CONCURRENT VERIFICATION",
      "STROBE LED ACTUATION",
      "120dB ALARM SIREN"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "Security Controller"
      },
      {
        "name": "PIR Motion Sensor",
        "role": "Passive Infrared thermal detection"
      },
      {
        "name": "HC-SR04 Sonar",
        "role": "Threshold laser/acoustic tripwire"
      },
      {
        "name": "Piezo Siren",
        "role": "Auditory alarm"
      },
      {
        "name": "Red Strobe LED",
        "role": "Visual warning"
      }
    ],
    "pinout": [
      {
        "mcu": "D2",
        "comp": "PIR Out",
        "desc": "Hardware Interrupt Motion Line"
      },
      {
        "mcu": "D7, D8",
        "comp": "Sonar TRIG/ECHO",
        "desc": "Doorway threshold distance"
      },
      {
        "mcu": "D11",
        "comp": "Piezo Siren",
        "desc": "Frequency Alarm Tone"
      },
      {
        "mcu": "D12",
        "comp": "Strobe LED",
        "desc": "Flashing Red Beacon"
      }
    ],
    "code": "const int PIR_PIN = 2;\nconst int BUZZER_PIN = 11;\nconst int STROBE_PIN = 12;\n\nvoid setup() {\n  pinMode(PIR_PIN, INPUT);\n  pinMode(BUZZER_PIN, OUTPUT);\n  pinMode(STROBE_PIN, OUTPUT);\n  Serial.begin(9600);\n  Serial.println(F(\"Alarm Armed.\"));\n}\n\nvoid loop() {\n  if (digitalRead(PIR_PIN) == HIGH) {\n    Serial.println(F(\"INTRUSION DETECTED!\"));\n    for (int i = 0; i < 5; i++) {\n      digitalWrite(STROBE_PIN, HIGH);\n      tone(BUZZER_PIN, 1000, 100);\n      delay(150);\n      digitalWrite(STROBE_PIN, LOW);\n      tone(BUZZER_PIN, 500, 100);\n      delay(150);\n    }\n  }\n}",
    "githubPath": "06-Automation/Security",
    "lessons": [
      "PIR sensors require a 30-60 second quiescent settling time upon power-up to establish ambient infrared baselines.",
      "Sensor fusion (PIR + Ultrasonic) virtually eliminates false triggers from insect movement or HVAC drafts.",
      "Tamper switches and watchdog timers ensure alarm systems recover automatically from attempted line disconnects."
    ],
    "tags": [
      "Automation",
      "Security",
      "PIR",
      "Alarm",
      "Sensors"
    ]
  },
  {
    "id": "exp-smart-lighting",
    "num": "EXP 031",
    "title": "Ambient Responsive Smart Lighting System",
    "category": "automation",
    "difficulty": "beginner",
    "year": "2024",
    "platform": "Arduino UNO",
    "language": "C++",
    "status": "COMPLETED",
    "summary": "Adaptive room lighting combining LDR photocell light levels with PIR presence detection and PWM soft fading.",
    "problem": "Automated lights turn on during daylight hours or shut off abruptly while people are still in the room.",
    "idea": "Evaluate boolean logic: IF (Ambient Light < Dark Threshold) AND (Motion Detected) THEN fade LED to 100% via PWM with a 10-second activity countdown.",
    "flow": [
      "LDR LIGHT SENSOR",
      "PIR PRESENCE DETECTOR",
      "BOOLEAN DECISION GATE",
      "SOFT PWM EXPONENTIAL FADE",
      "AUTOMATIC SLEEP TIMER"
    ],
    "components": [
      {
        "name": "Arduino Uno",
        "role": "Smart Lighting Controller"
      },
      {
        "name": "LDR Light Sensor",
        "role": "Ambient lux measurement"
      },
      {
        "name": "PIR Motion Sensor",
        "role": "Human presence detection"
      },
      {
        "name": "High-Power LED Array",
        "role": "PWM dimmable lighting"
      }
    ],
    "pinout": [
      {
        "mcu": "A0",
        "comp": "LDR Wiper",
        "desc": "Ambient Light Reading"
      },
      {
        "mcu": "D2",
        "comp": "PIR Out",
        "desc": "Motion Detection"
      },
      {
        "mcu": "D9 (PWM)",
        "comp": "LED Driver",
        "desc": "Smooth PWM Brightness Modulation"
      }
    ],
    "code": "const int PIR_PIN   = 2;\nconst int LDR_PIN   = A0;\nconst int LIGHT_PIN = 9;\n\nconst int DARK_THRESHOLD = 300;\nconst unsigned long LIGHT_TIMEOUT = 10000;\n\nunsigned long lastMotionTime = 0;\nint currentBrightness = 0;\n\nvoid setup() {\n  pinMode(PIR_PIN, INPUT);\n  pinMode(LIGHT_PIN, OUTPUT);\n}\n\nvoid loop() {\n  int lightLevel = analogRead(LDR_PIN);\n  int motion = digitalRead(PIR_PIN);\n  \n  if (motion == HIGH) lastMotionTime = millis();\n  \n  bool isDark = (lightLevel < DARK_THRESHOLD);\n  bool isOccupied = (millis() - lastMotionTime < LIGHT_TIMEOUT);\n  \n  int target = (isDark && isOccupied) ? 255 : 0;\n  \n  if (currentBrightness < target) currentBrightness += 5;\n  if (currentBrightness > target) currentBrightness -= 5;\n  \n  analogWrite(LIGHT_PIN, currentBrightness);\n  delay(20);\n}",
    "githubPath": "06-Automation/Smart-Lighting",
    "lessons": [
      "Smooth PWM fading prevents the jarring sensory shock of abrupt light switching.",
      "Activity timeout timers prevent room blackouts when users sit still while reading or working.",
      "Optical shielding of the LDR prevents the lamp's own light output from creating an oscillation loop."
    ],
    "tags": [
      "Automation",
      "Smart-Home",
      "Lighting",
      "PWM",
      "Sensors"
    ]
  }
];


// Filter gallery from external buttons (e.g. Learning Paths)
window.filterGallery = function (category) {
  const projectsSec = document.getElementById("projects");
  if (projectsSec) {
    projectsSec.scrollIntoView({ behavior: 'smooth' });
  }
  const filterTabs = document.querySelectorAll(".filter-tab");
  filterTabs.forEach(tab => {
    if (tab.dataset.filter === category) {
      tab.click();
    }
  });
};
// ==========================================================================
// 2. DOM INITIALIZATION
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  initProjectGallery();
  initTechnologyMap();
  initSandboxSimulator();
  initSearchOmniModal();
  initHeroBoardAnimation();
  updateExperimentCounters();
});

function updateExperimentCounters() {
  const countEl = document.getElementById("metric-exp-count");
  if (countEl) {
    countEl.textContent = `${EXPERIMENTS_DATA.length}+`;
  }
}

// ==========================================================================
// 3. PROJECT GALLERY RENDERER & FILTERS
// ==========================================================================

function initProjectGallery() {
  const container = document.getElementById("projects-container");
  const filterTabs = document.querySelectorAll(".filter-tab");
  const searchInput = document.getElementById("project-search-input");
  const clearSearchBtn = document.getElementById("clear-search-btn");

  let currentCategory = "all";
  let searchQuery = "";

  function render() {
    if (!container) return;

    const filtered = EXPERIMENTS_DATA.filter(item => {
      const matchCat = (currentCategory === "all") || (item.category === currentCategory);
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q)) ||
        item.components.some(c => c.name.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <i class="fa-solid fa-microchip" style="font-size: 2.5rem; margin-bottom: 16px; opacity: 0.4;"></i>
          <h3 style="color: var(--text-primary); margin-bottom: 8px;">No experiments found</h3>
          <p>Try searching for a different sensor, keyword, or clear your filters.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(exp => {
      const hasLab = !!exp.interactiveLabUrl;
      return `
      <article class="glass-panel experiment-card ${hasLab ? 'has-interactive-lab' : ''}" onclick="handleCardClick(event, '${exp.id}', '${exp.interactiveLabUrl || ''}')">
        <div class="card-top-meta">
          <span class="exp-number">${exp.num}</span>
          <div style="display: flex; gap: 6px; align-items: center;">
            ${hasLab ? `<span class="lab-pill-badge" title="Live Interactive Simulator Available"><i class="fa-solid fa-bolt"></i> Lab ↗</span>` : ''}
            <span class="exp-difficulty ${exp.difficulty}">${exp.difficulty}</span>
          </div>
        </div>

        <div>
          <h3 class="exp-title">${exp.title}</h3>
          <p class="exp-snippet">${exp.summary}</p>
        </div>

        <div class="card-schematic-thumb">
          <div class="thumb-signal-flow">
            <i class="fa-solid fa-arrow-right-arrow-left"></i>
            <span>${exp.flow[0]} → ${exp.flow[exp.flow.length - 1]}</span>
          </div>
          <span style="color: var(--text-muted);">${exp.platform}</span>
        </div>

        <div class="card-footer-meta">
          <div class="card-tags">
            ${exp.tags.slice(0, 3).map(t => `<span class="card-tag-pill">${t}</span>`).join('')}
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <button class="inspect-specs-btn" onclick="event.stopPropagation(); openExperimentModal('${exp.id}')" title="Inspect schematic, pinout, and source code">
              <i class="fa-solid fa-file-code"></i> Specs
            </button>
            <span class="view-link">
              <span>${hasLab ? 'Open Lab' : 'Inspect'}</span>
              <i class="fa-solid ${hasLab ? 'fa-arrow-up-right-from-square' : 'fa-arrow-right'}"></i>
            </span>
          </div>
        </div>
      </article>
    `}).join('');
  }

  filterTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      filterTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentCategory = tab.dataset.filter;
      render();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      if (clearSearchBtn) {
        clearSearchBtn.style.display = searchQuery ? "block" : "none";
      }
      render();
    });
  }

  if (clearSearchBtn && searchInput) {
    clearSearchBtn.addEventListener("click", () => {
      searchInput.value = "";
      searchQuery = "";
      clearSearchBtn.style.display = "none";
      render();
    });
  }

  document.querySelectorAll(".btn-open-exp").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openExperimentModal(btn.dataset.id);
    });
  });

  render();
}

// Global card click handler: opens interactive lab in new tab if available, or opens inspector modal
window.handleCardClick = function (event, id, labUrl) {
  if (labUrl) {
    window.open(labUrl, '_blank');
  } else {
    openExperimentModal(id);
  }
};

// ==========================================================================
// 4. TECHNOLOGY STACK MAP INTERACTIVITY
// ==========================================================================

function initTechnologyMap() {
  const chips = document.querySelectorAll(".comp-chip");
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const compName = chip.dataset.component;
      chips.forEach(c => c.classList.remove("active-chip"));
      chip.classList.add("active-chip");

      const searchInput = document.getElementById("project-search-input");
      if (searchInput) {
        searchInput.value = compName;
        searchInput.dispatchEvent(new Event("input"));
      }

      const projSec = document.getElementById("projects");
      if (projSec) {
        projSec.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

// ==========================================================================
// 5. MODAL EXPERIMENT READER
// ==========================================================================

window.openExperimentModal = function (id) {
  const exp = EXPERIMENTS_DATA.find(e => e.id === id);
  if (!exp) return;

  const modal = document.getElementById("experiment-modal");
  const container = document.getElementById("modal-content-container");
  if (!modal || !container) return;

  container.innerHTML = `
    <button class="modal-close-btn" onclick="closeExperimentModal()" aria-label="Close modal">
      <i class="fa-solid fa-xmark"></i>
    </button>

    <div class="modal-header-meta">
      <div class="modal-meta-cell">
        <span class="modal-meta-label">ID</span>
        <span class="modal-meta-val">${exp.num}</span>
      </div>
      <div class="modal-meta-cell">
        <span class="modal-meta-label">STATUS</span>
        <span class="modal-meta-val" style="color: var(--accent-pcb-green);">${exp.status}</span>
      </div>
      <div class="modal-meta-cell">
        <span class="modal-meta-label">PLATFORM</span>
        <span class="modal-meta-val">${exp.platform}</span>
      </div>
      <div class="modal-meta-cell">
        <span class="modal-meta-label">LANGUAGE</span>
        <span class="modal-meta-val">${exp.language}</span>
      </div>
      <div class="modal-meta-cell">
        <span class="modal-meta-label">DIFFICULTY</span>
        <span class="modal-meta-val" style="color: var(--accent-electric); text-transform: uppercase;">${exp.difficulty}</span>
      </div>
    </div>

    <h2 class="modal-project-title">${exp.title}</h2>
    <p class="modal-project-summary">${exp.summary}</p>

    ${exp.interactiveLabUrl ? `
      <div class="modal-interactive-banner" style="display: flex; justify-content: space-between; align-items: center; background: linear-gradient(90deg, rgba(255, 90, 54, 0.14), rgba(57, 215, 255, 0.08)); border: 1px solid rgba(255, 90, 54, 0.35); border-radius: var(--radius-md); padding: 14px 18px; margin: 16px 0 24px; gap: 16px; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(255, 90, 54, 0.2); display: flex; align-items: center; justify-content: center; color: #ff7253; flex-shrink: 0;">
            <i class="fa-solid fa-flask-vial" style="font-size: 1.1rem;"></i>
          </div>
          <div>
            <div style="color: var(--text-primary); font-weight: 600; font-size: 0.95rem;">Interactive Simulator Available</div>
            <div style="color: var(--text-muted); font-size: 0.8rem;">Explore real-time signal graphs, circuit dials, and interactive virtual hardware.</div>
          </div>
        </div>
        <a href="${exp.interactiveLabUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="background: #ff5a36; border: none; white-space: nowrap; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-bolt"></i>
          <span>Launch Interactive Lab</span>
          <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.65rem;"></i>
        </a>
      </div>
    ` : ''}

    <div class="modal-block">
      <h3 class="modal-block-title"><i class="fa-solid fa-circle-question"></i> The Problem & Hypothesis</h3>
      <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 12px;">
        <strong>The Problem:</strong> ${exp.problem}
      </p>
      <p style="color: var(--text-secondary); line-height: 1.6;">
        <strong>The Engineering Idea:</strong> ${exp.idea}
      </p>
    </div>

    <div class="modal-block">
      <h3 class="modal-block-title"><i class="fa-solid fa-network-wired"></i> Physical Signal Flow</h3>
      <div class="signal-flow-diagram">
        ${exp.flow.map((node, i) => `
          <div class="flow-node ${i === 2 ? 'highlight-node' : ''}">${node}</div>
          ${i < exp.flow.length - 1 ? '<i class="fa-solid fa-chevron-right flow-arrow"></i>' : ''}
        `).join('')}
      </div>
    </div>

    <div class="modal-block">
      <h3 class="modal-block-title"><i class="fa-solid fa-plug"></i> Hardware Pin Connections</h3>
      <table class="pinout-table">
        <thead>
          <tr>
            <th>Arduino Pin</th>
            <th>Component Pin</th>
            <th>Signal Description</th>
          </tr>
        </thead>
        <tbody>
          ${exp.pinout.map(p => `
            <tr>
              <td><span class="pin-code">${p.mcu}</span></td>
              <td><strong>${p.comp}</strong></td>
              <td>${p.desc}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="modal-block">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; gap: 12px; flex-wrap: wrap;">
        <h3 class="modal-block-title" style="margin-bottom: 0;"><i class="fa-solid fa-code"></i> Arduino C++ Sketch</h3>
        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          ${exp.interactiveLabUrl ? `
            <a href="${exp.interactiveLabUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="background: linear-gradient(135deg, #ff5a36, #ff7a55); border: none; font-weight: 600;">
              <i class="fa-solid fa-bolt"></i>
              <span>Launch Lab</span>
              <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.65rem;"></i>
            </a>
          ` : ''}
          <a href="https://github.com/PrerithM/Arduino-Projects/tree/main/${exp.githubPath}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
            <i class="fa-brands fa-github"></i>
            <span>Open on GitHub</span>
            <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.65rem;"></i>
          </a>
        </div>
      </div>
      
      <div class="code-container">
        <div class="code-header">
          <span>sketch.ino</span>
          <button class="code-copy-btn" onclick="copyModalCode()"><i class="fa-regular fa-copy"></i> Copy Code</button>
        </div>
        <pre class="code-block"><code id="modal-code-text">${escapeHtml(exp.code)}</code></pre>
      </div>
    </div>

    <div class="modal-block">
      <h3 class="modal-block-title"><i class="fa-solid fa-graduation-cap"></i> What This Experiment Taught Me</h3>
      <ul class="lessons-list">
        ${exp.lessons.map((lesson, idx) => `
          <li class="lesson-item">
            <span class="lesson-num">0${idx + 1} ─</span>
            <span class="lesson-txt">${lesson}</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
};

window.closeExperimentModal = function () {
  const modal = document.getElementById("experiment-modal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
};

window.copyModalCode = function () {
  const codeEl = document.getElementById("modal-code-text");
  if (!codeEl) return;
  navigator.clipboard.writeText(codeEl.textContent).then(() => {
    const btn = document.querySelector(".code-copy-btn");
    if (btn) {
      btn.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
      setTimeout(() => {
        btn.innerHTML = `<i class="fa-regular fa-copy"></i> Copy Code`;
      }, 2000);
    }
  });
};

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeExperimentModal();
    closeSearchModal();
  }
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    e.preventDefault();
    openSearchModal();
  }
});

const modalOverlay = document.getElementById("experiment-modal");
if (modalOverlay) {
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeExperimentModal();
    }
  });
}

// ==========================================================================
// 6. VIRTUAL HARDWARE PLAYGROUND SIMULATOR
// ==========================================================================

let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playBuzzerTone(freq, duration = 0.08) {
  const soundCheckbox = document.getElementById("sb-sound-enable");
  if (!soundCheckbox || !soundCheckbox.checked) return;

  try {
    initAudio();
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    console.warn("Audio unavailable:", err);
  }
}

function initSandboxSimulator() {
  const distSlider = document.getElementById("sb-dist-slider");
  const potSlider = document.getElementById("sb-pot-slider");
  const lightSlider = document.getElementById("sb-light-slider");

  const distVal = document.getElementById("sb-dist-val");
  const potVal = document.getElementById("sb-pot-val");
  const lightVal = document.getElementById("sb-light-val");

  const lcdLine1 = document.getElementById("lcd-line-1");
  const lcdLine2 = document.getElementById("lcd-line-2");
  const servoArm = document.getElementById("sb-servo-arm");
  const servoAngle = document.getElementById("sb-servo-angle");
  const fanIcon = document.getElementById("sb-fan-icon");
  const rpmVal = document.getElementById("sb-rpm-val");

  const ledSafe = document.getElementById("led-safe");
  const ledWarn = document.getElementById("led-warn");
  const ledDanger = document.getElementById("led-danger");
  const proximityState = document.getElementById("sb-proximity-state");
  const serialLog = document.getElementById("sb-serial-log");

  function updateSimulation() {
    const dist = parseFloat(distSlider?.value || 25);
    const pot = parseInt(potSlider?.value || 512);
    const light = parseInt(lightSlider?.value || 780);

    if (distVal) distVal.textContent = `${dist.toFixed(1)} cm`;
    const echoMicroseconds = Math.round((dist * 2) / 0.0343);

    const volts = ((pot / 1023) * 5.0).toFixed(2);
    const pwmVal = Math.round((pot / 1023) * 255);
    const pwmPct = ((pwmVal / 255) * 100).toFixed(1);
    if (potVal) potVal.textContent = `${pot} (${volts}V)`;

    if (lightVal) {
      if (light < 200) lightVal.textContent = `Dark (${light} lux)`;
      else if (light < 600) lightVal.textContent = `Dim (${light} lux)`;
      else lightVal.textContent = `Bright (${light} lux)`;
    }

    if (lcdLine1) lcdLine1.textContent = `DIST: ${dist < 100 ? '0' : ''}${dist.toFixed(1)} cm`;
    if (lcdLine2) lcdLine2.textContent = `PWM: ${pwmVal} (${pwmPct}%)`;

    const angle = Math.round((pot / 1023) * 180);
    if (servoArm) servoArm.style.transform = `rotate(${angle - 90}deg)`;
    if (servoAngle) servoAngle.textContent = `${angle}°`;

    const rpm = Math.round((pwmVal / 255) * 2500);
    if (rpmVal) rpmVal.textContent = `${rpm} RPM`;
    if (fanIcon) {
      fanIcon.style.animationDuration = pwmVal > 10 ? `${(256 - pwmVal) / 150 + 0.1}s` : "0s";
    }

    ledSafe?.classList.remove("active");
    ledWarn?.classList.remove("active");
    ledDanger?.classList.remove("active");

    if (dist < 15) {
      ledDanger?.classList.add("active");
      if (proximityState) {
        proximityState.textContent = "STOP!";
        proximityState.style.color = "#E34B4B";
      }
      playBuzzerTone(880, 0.05);
    } else if (dist < 50) {
      ledWarn?.classList.add("active");
      if (proximityState) {
        proximityState.textContent = "CAUTION";
        proximityState.style.color = "#FFB224";
      }
      playBuzzerTone(440, 0.04);
    } else {
      ledSafe?.classList.add("active");
      if (proximityState) {
        proximityState.textContent = "SAFE";
        proximityState.style.color = "#35C98A";
      }
    }

    if (serialLog) {
      const now = new Date();
      const timeStr = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(now.getMilliseconds() / 100))}`;
      serialLog.innerHTML = `[${timeStr}] Sonar: ${dist.toFixed(1)}cm | Echo: ${echoMicroseconds}µs | PWM: ${pwmVal}<br>` + serialLog.innerHTML.split("<br>").slice(0, 4).join("<br>");
    }
  }

  [distSlider, potSlider, lightSlider].forEach(input => {
    if (input) input.addEventListener("input", updateSimulation);
  });

  updateSimulation();
}

// ==========================================================================
// 7. OMNI SEARCH MODAL
// ==========================================================================

function initSearchOmniModal() {
  const searchBtn = document.getElementById("search-btn");
  const searchModal = document.getElementById("search-modal");
  const closeBtn = document.getElementById("close-search-modal");
  const input = document.getElementById("omni-search-input");
  const resultsList = document.getElementById("omni-search-results");

  if (searchBtn) searchBtn.addEventListener("click", openSearchModal);
  if (closeBtn) closeBtn.addEventListener("click", closeSearchModal);

  if (input && resultsList) {
    input.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        resultsList.innerHTML = `<p style="padding: 16px; color: var(--text-muted); font-size: 0.85rem;">Start typing to search projects, sensors, code, and hardware concepts...</p>`;
        return;
      }

      const hits = EXPERIMENTS_DATA.filter(exp =>
        exp.title.toLowerCase().includes(q) ||
        exp.summary.toLowerCase().includes(q) ||
        exp.tags.some(t => t.toLowerCase().includes(q)) ||
        exp.components.some(c => c.name.toLowerCase().includes(q))
      );

      if (hits.length === 0) {
        resultsList.innerHTML = `<p style="padding: 16px; color: var(--text-muted); font-size: 0.85rem;">No matches found for "${escapeHtml(q)}"</p>`;
        return;
      }

      resultsList.innerHTML = hits.map(hit => `
        <div class="search-hit-item" onclick="handleCardClick(event, '${hit.id}', '${hit.interactiveLabUrl || ''}'); closeSearchModal();">
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
            <div class="search-hit-title">${hit.num}: ${hit.title}</div>
            ${hit.interactiveLabUrl ? `<span class="lab-pill-badge" style="font-size: 0.6rem; padding: 1px 6px;"><i class="fa-solid fa-bolt"></i> Lab ↗</span>` : ''}
          </div>
          <div class="search-hit-sub">${hit.summary}</div>
        </div>
      `).join('');
    });
  }
}

window.openSearchModal = function () {
  const modal = document.getElementById("search-modal");
  const input = document.getElementById("omni-search-input");
  if (modal) {
    modal.classList.add("active");
    if (input) {
      input.value = "";
      input.focus();
      input.dispatchEvent(new Event("input"));
    }
  }
};

window.closeSearchModal = function () {
  const modal = document.getElementById("search-modal");
  if (modal) modal.classList.remove("active");
};

// ==========================================================================
// 8. HERO BOARD ANIMATION
// ==========================================================================

function initHeroBoardAnimation() {
  const rxLed = document.getElementById("hero-rx-led");
  const txLed = document.getElementById("hero-tx-led");

  setInterval(() => {
    if (rxLed) {
      rxLed.style.opacity = Math.random() > 0.4 ? "1" : "0.2";
    }
    if (txLed) {
      txLed.style.opacity = Math.random() > 0.5 ? "1" : "0.2";
    }
  }, 180);
}
