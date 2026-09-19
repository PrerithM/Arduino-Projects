// Auto-generated full cookbook data
const CATEGORIES_DATA = [
  {
    "id": "01-Fundamentals",
    "title": "Fundamentals",
    "icon": "\u26a1",
    "badge": "Core Concepts",
    "image": "assets/images/cat-fundamentals.jpg",
    "desc": "Digital & Analog I/O, PWM dimming, hardware interrupts, non-blocking timers, and UART CLI."
  },
  {
    "id": "02-Sensors",
    "title": "Sensors",
    "icon": "\ud83d\udce1",
    "badge": "Environmental",
    "image": "assets/images/cat-sensors.jpg",
    "desc": "Acoustic sonar, infrared reflection, precision temperature, humidity, ambient light, IMU, and laser ToF."
  },
  {
    "id": "03-Actuators",
    "title": "Actuators",
    "icon": "\u2699\ufe0f",
    "badge": "Motion & Power",
    "image": "assets/images/cat-actuators.jpg",
    "desc": "NeoPixel LED arrays, precision RC servos, dual H-Bridge DC motors, steppers, optoisolated relays, and buzzers."
  },
  {
    "id": "04-Displays",
    "title": "Displays",
    "icon": "\ud83d\udda5\ufe0f",
    "badge": "Visual UI",
    "image": "assets/images/cat-displays.jpg",
    "desc": "16x2 I2C character LCDs, 4-digit 7-segment digital meters, and multi-channel real-time serial plotting."
  },
  {
    "id": "05-Communication",
    "title": "Communication",
    "icon": "\ud83c\udf10",
    "badge": "Protocols & IoT",
    "image": "assets/images/cat-communication.jpg",
    "desc": "SoftwareSerial UART, multi-drop I2C bus, high-speed SPI bus, Bluetooth SPP telemetry, and Wi-Fi web servers."
  },
  {
    "id": "06-Automation",
    "title": "Automation",
    "icon": "\ud83e\udd16",
    "badge": "Complete Systems",
    "image": "assets/images/cat-automation.jpg",
    "desc": "Adaptive smart lighting, multi-zone security alarms, smart greenhouse irrigation, and autonomous obstacle-avoiding rovers."
  }
];
const PROJECTS_DATA = [
  {
    "id": "proj-01",
    "categoryId": "01-Fundamentals",
    "categoryTitle": "Fundamentals",
    "categoryIcon": "\u26a1",
    "categoryBadge": "Core Concepts",
    "folder": "Digital-IO",
    "title": "Digital Input / Output (Pushbutton & LED)",
    "hook": "Control electronic states (HIGH/LOW) to read pushbuttons with internal pullups and switch LEDs on and off with debouncing.",
    "sketchName": "digital_io.ino",
    "learn": [
      "Configuring pins with pinMode() as INPUT_PULLUP and OUTPUT",
      "Reading digital states with digitalRead() and driving states with digitalWrite()",
      "Software pushbutton debouncing without delay blocking"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "1",
        "Main microcontroller board"
      ],
      [
        "Pushbutton Switch",
        "1",
        "Momentary tactile button"
      ],
      [
        "LED (5mm)",
        "1",
        "Standard indicator LED (e.g., Green/Red)"
      ],
      [
        "Current-limiting Resistor",
        "1",
        "220\u03a9 to 330\u03a9 resistor for LED"
      ],
      [
        "Breadboard & Jumper Wires",
        "1 set",
        "Solderless prototyping board and wires"
      ]
    ],
    "pins": [
      [
        "D2",
        "Pushbutton Leg A",
        "Digital Input with INPUT_PULLUP (Active LOW)"
      ],
      [
        "GND",
        "Pushbutton Leg B",
        "Ground reference for pushbutton"
      ],
      [
        "D13",
        "LED Anode (+ via 220\u03a9)",
        "Digital Output control signal"
      ],
      [
        "GND",
        "LED Cathode (-)",
        "Common ground connection"
      ]
    ],
    "asciiDiagram": "+-----------------+\n    |   Arduino Uno   |\n    |                 |\n    |             D13 |--------[ 220\u03a9 Resistor ]----->| (LED) ----+\n    |                 |                               (Anode/Cathode) |\n    |             D2  |--------+                                  |\n    |                 |        |                                  |\n    |             GND |--------+----------------------------------+\n    +-----------------+        |\n                           [ Pushbutton ]\n                               |\n                              GND",
    "code": "/*\n * Module: Digital I/O with Pushbutton Debounce\n * Description: Reads a momentary pushbutton using internal pull-up resistors\n *              and toggles an LED with clean software debouncing.\n * Part of: Arduino Projects Cookbook\n */\n\nconst int BUTTON_PIN = 2;   // Pushbutton connected between pin D2 and GND\nconst int LED_PIN    = 13;  // LED connected to pin D13 (and onboard LED)\n\nint ledState = LOW;             // Current state of the LED\nint buttonState;                // Current reading from the input pin\nint lastButtonState = HIGH;     // Previous reading from the input pin\n\nunsigned long lastDebounceTime = 0;  // Last time the output pin was toggled\nconst unsigned long debounceDelay = 50; // Debounce threshold in milliseconds\n\nvoid setup() {\n  pinMode(BUTTON_PIN, INPUT_PULLUP); // Enable internal ~20k-50k pull-up resistor\n  pinMode(LED_PIN, OUTPUT);\n  digitalWrite(LED_PIN, ledState);\n\n  Serial.begin(9600);\n  Serial.println(F(\"Digital I/O Ready. Press the pushbutton to toggle LED.\"));\n}\n\nvoid loop() {\n  int reading = digitalRead(BUTTON_PIN);\n\n  // If the switch changed due to noise or pressing, reset debounce timer\n  if (reading != lastButtonState) {\n    lastDebounceTime = millis();\n  }\n\n  if ((millis() - lastDebounceTime) > debounceDelay) {\n    // If the reading has stayed stable longer than debounceDelay, accept it\n    if (reading != buttonState) {\n      buttonState = reading;\n\n      // When button is pressed down (LOW because of active-low pull-up)\n      if (buttonState == LOW) {\n        ledState = !ledState;\n        digitalWrite(LED_PIN, ledState);\n        Serial.print(F(\"Button Pressed! LED is now: \"));\n        Serial.println(ledState ? F(\"ON\") : F(\"OFF\"));\n      }\n    }\n  }\n\n  lastButtonState = reading;\n}",
    "howItWorks": "The ATmega328P microcontroller has internal pull-up resistors. When using `INPUT_PULLUP`, the pin is pulled HIGH (+5V) by default. Pressing the button shorts pin D2 to ground (LOW). Mechanical contacts bounce rapidly for 5-20ms when pressed; the non-blocking `millis()` timer ignores fluctuations until the state remains steady for over 50ms.",
    "challenges": [
      "Add a second button to turn the LED OFF explicitly while the first only turns it ON.",
      "Implement a double-click detection feature to flash the LED rapidly.",
      "Extend the sketch to create a 3-stage brightness state using software toggle."
    ],
    "combinations": [
      [
        "03-Actuators/Relays",
        "Replace the LED output pin with a relay module to control 120V/240V appliances."
      ],
      [
        "03-Actuators/Buzzers",
        "Add an audible tactile feedback click each time the button registers a press."
      ],
      [
        "04-Displays/LCD",
        "Display the total button click count and uptime on a 16x2 LCD screen."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/01-Fundamentals/Digital-IO"
  },
  {
    "id": "proj-02",
    "categoryId": "01-Fundamentals",
    "categoryTitle": "Fundamentals",
    "categoryIcon": "\u26a1",
    "categoryBadge": "Core Concepts",
    "folder": "Analog-IO",
    "title": "Analog Input / Output (Potentiometer & Voltage Mapping)",
    "hook": "Read continuous real-world voltage levels using the 10-bit Analog-to-Digital Converter (ADC) and convert raw values to volts and percentage.",
    "sketchName": "analog_io.ino",
    "learn": [
      "Understanding 10-bit ADC resolution (0 - 1023 corresponds to 0V - 5V)",
      "Scaling analog readings with map() and float calculations",
      "Mitigating ADC noise with software rolling-average smoothing"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "1",
        "Main board"
      ],
      [
        "Potentiometer (10k\u03a9)",
        "1",
        "Rotary linear potentiometer"
      ],
      [
        "Breadboard & Jumper Wires",
        "1 set",
        "Connections"
      ]
    ],
    "pins": [
      [
        "5V",
        "Potentiometer Pin 1 (Outer)",
        "+5V Power rail"
      ],
      [
        "A0",
        "Potentiometer Pin 2 (Wiper)",
        "Analog Voltage Input"
      ],
      [
        "GND",
        "Potentiometer Pin 3 (Outer)",
        "Ground rail"
      ]
    ],
    "asciiDiagram": "+-----------------+\n    |   Arduino Uno   |\n    |                 |\n    |              5V |---------+ (Outer Leg 1)\n    |                 |         |\n    |              A0 |-------[ 10k\u03a9 Potentiometer (Wiper) ]\n    |                 |         |\n    |             GND |---------+ (Outer Leg 3)\n    +-----------------+",
    "code": "/*\n * Module: Analog I/O & Continuous Voltage Measurement\n * Description: Reads a 10k potentiometer via ADC pin A0 with a 10-sample\n *              moving average filter to eliminate electrical noise.\n * Part of: Arduino Projects Cookbook\n */\n\nconst int ANALOG_PIN = A0;\nconst int NUM_READINGS = 10;\n\nint readings[NUM_READINGS];      // Circular buffer for readings\nint readIndex = 0;               // Current index in buffer\nlong total = 0;                  // Running total\nint averageRaw = 0;              // Average ADC value\n\nvoid setup() {\n  Serial.begin(9600);\n  \n  // Initialize all buffer readings to 0\n  for (int thisReading = 0; thisReading < NUM_READINGS; thisReading++) {\n    readings[thisReading] = 0;\n  }\n\n  Serial.println(F(\"Analog Reading Initialized.\"));\n  Serial.println(F(\"Raw (0-1023)\\tVoltage (V)\\tPercent (%)\"));\n}\n\nvoid loop() {\n  // Subtract the oldest reading from running total\n  total = total - readings[readIndex];\n  // Read from sensor\n  readings[readIndex] = analogRead(ANALOG_PIN);\n  // Add new reading to running total\n  total = total + readings[readIndex];\n  // Advance circular index\n  readIndex = (readIndex + 1) % NUM_READINGS;\n\n  // Calculate smoothed average\n  averageRaw = total / NUM_READINGS;\n\n  // Convert to voltage (0.00V - 5.00V) assuming standard 5V Vref\n  float voltage = (averageRaw * 5.0) / 1023.0;\n  // Convert to percentage (0 - 100%)\n  int percentage = map(averageRaw, 0, 1023, 0, 100);\n\n  Serial.print(averageRaw);\n  Serial.print(F(\"\\t\\t\"));\n  Serial.print(voltage, 2);\n  Serial.print(F(\" V\\t\\t\"));\n  Serial.print(percentage);\n  Serial.println(F(\" %\"));\n\n  delay(100); // 10Hz sampling rate\n}",
    "howItWorks": "The Arduino ADC measures voltages between 0V and 5V relative to AREF. 10-bit resolution provides 2^10 = 1024 discrete steps (approx 4.88mV per step). The 10-sample moving window reduces high-frequency EMI noise from breadboard jumpers and unstable power rails.",
    "challenges": [
      "Use analogReference(INTERNAL) to measure lower voltages (1.1V ref on Uno) with higher resolution.",
      "Trigger visual threshold alerts when the voltage exceeds 3.5V.",
      "Calibrate non-linear responses using piecewise linear interpolation."
    ],
    "combinations": [
      [
        "01-Fundamentals/PWM",
        "Feed the analog percentage directly into analogWrite() to control LED fading or motor speed."
      ],
      [
        "03-Actuators/Servo",
        "Map the 0-1023 range directly to 0-180 degrees for manual servo joystick positioning."
      ],
      [
        "04-Displays/7-Segment",
        "Output the measured voltage to a 4-digit 7-segment display."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/01-Fundamentals/Analog-IO"
  },
  {
    "id": "proj-03",
    "categoryId": "01-Fundamentals",
    "categoryTitle": "Fundamentals",
    "categoryIcon": "\u26a1",
    "categoryBadge": "Core Concepts",
    "folder": "PWM",
    "title": "Pulse Width Modulation (PWM Fading & Motor Speed)",
    "hook": "Simulate analog output voltages on digital pins by rapidly pulsing square waves with variable duty cycles.",
    "sketchName": "pwm.ino",
    "learn": [
      "How duty cycle translates to perceived DC voltage (0 - 255 = 0% - 100%)",
      "Identifying hardware PWM pins on Arduino Uno (Pins 3, 5, 6, 9, 10, 11)",
      "Creating smooth non-linear gamma-corrected breathing effects"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "1",
        "Main board"
      ],
      [
        "LED (5mm or 10mm)",
        "1",
        "High brightness LED"
      ],
      [
        "220\u03a9 Resistor",
        "1",
        "Current limiting resistor"
      ],
      [
        "Breadboard & Jumper Wires",
        "1 set",
        "Connections"
      ]
    ],
    "pins": [
      [
        "D9 (~PWM)",
        "LED Anode (+ through 220\u03a9)",
        "PWM Signal Output"
      ],
      [
        "GND",
        "LED Cathode (-)",
        "Ground rail"
      ]
    ],
    "asciiDiagram": "+-----------------+\n    |   Arduino Uno   |\n    |                 |\n    |        D9 (~PWM)|--------[ 220\u03a9 Resistor ]----->| (LED) ----+\n    |                 |                               (Anode/Cathode) |\n    |             GND |-----------------------------------------------+\n    +-----------------+",
    "code": "/*\n * Module: Pulse Width Modulation (PWM) & Breathing Glow\n * Description: Implements a non-blocking organic breathing LED pulse\n *              using a trigonometric sine-wave lookup for natural perception.\n * Part of: Arduino Projects Cookbook\n */\n\nconst int PWM_PIN = 9; // Pin 9 supports ~490Hz 8-bit timer PWM\n\nunsigned long previousMillis = 0;\nconst long interval = 20; // 50 updates per second\n\nfloat angle = 0.0;\n\nvoid setup() {\n  pinMode(PWM_PIN, OUTPUT);\n  Serial.begin(9600);\n  Serial.println(F(\"PWM Breathing Controller Started on Pin 9.\"));\n}\n\nvoid loop() {\n  unsigned long currentMillis = millis();\n\n  if (currentMillis - previousMillis >= interval) {\n    previousMillis = currentMillis;\n\n    // Human eye responds logarithmically to light brightness.\n    // A sine wave provides smooth deceleration at peaks and troughs.\n    float sinVal = (sin(angle) + 1.0) / 2.0; // Scale -1..1 to 0.0..1.0\n    int brightness = (int)(pow(sinVal, 2.2) * 255.0); // Gamma 2.2 correction\n\n    analogWrite(PWM_PIN, brightness);\n\n    angle += 0.04;\n    if (angle >= 2 * PI) {\n      angle = 0.0;\n    }\n  }\n}",
    "howItWorks": "Arduino pins cannot output true analog voltages without an external DAC. Instead, `analogWrite()` switches the pin between 0V and 5V at approximately 490 Hz (or 980 Hz on pins 5/6). The proportion of ON time vs OFF time (the duty cycle) determines the average power delivered. Because human vision perceives brightness logarithmically, applying a gamma exponent (2.2) ensures perceived brightness changes smoothly.",
    "challenges": [
      "Change the breathing speed based on an external analog sensor value.",
      "Directly configure ATmega Timer1 registers (TCCR1A / TCCR1B) to generate a 25kHz PWM signal for quiet fan control.",
      "Create an RGB mood light blending Red, Green, and Blue over three PWM channels."
    ],
    "combinations": [
      [
        "03-Actuators/DC-Motors",
        "Control DC motor rotational velocity using an H-Bridge enable pin tied to PWM."
      ],
      [
        "02-Sensors/Light",
        "Automatically adjust room ambient lighting in response to LDR readings."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/01-Fundamentals/PWM"
  },
  {
    "id": "proj-04",
    "categoryId": "01-Fundamentals",
    "categoryTitle": "Fundamentals",
    "categoryIcon": "\u26a1",
    "categoryBadge": "Core Concepts",
    "folder": "Interrupts",
    "title": "Hardware Interrupts (Zero-Latency Event Handling)",
    "hook": "Trap critical hardware events instantaneously without polling or missing microsecond-level triggers.",
    "sketchName": "interrupts.ino",
    "learn": [
      "Configuring external interrupts with attachInterrupt() on pins D2 and D3",
      "Interrupt Service Routine (ISR) best practices: keep it fast, avoid delay() and Serial prints",
      "Proper usage of the volatile keyword for thread-safe memory sharing"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "1",
        "Main board"
      ],
      [
        "Pushbutton or Optical Interrupter",
        "1",
        "Trigger device"
      ],
      [
        "10k\u03a9 Pull-down Resistor",
        "1",
        "If using active-high (or use internal pullup)"
      ],
      [
        "Breadboard & Jumper Wires",
        "1 set",
        "Connections"
      ]
    ],
    "pins": [
      [
        "D2 (INT0)",
        "Signal Pin",
        "Interrupt Trigger Input (FALLING / RISING)"
      ],
      [
        "GND",
        "Button Leg",
        "Active Low ground link"
      ]
    ],
    "asciiDiagram": "+-----------------+\n    |   Arduino Uno   |\n    |                 |\n    |       D2 (INT0) |--------+\n    |                 |        |\n    |             GND |--------+------------------+\n    +-----------------+        |                  |\n                           [ Pushbutton ]      [ GND ]",
    "code": "/*\n * Module: Hardware Interrupt Service Routine (ISR)\n * Description: Measures precise pulse triggers and rotary encoder ticks\n *              without polling inside the main loop().\n * Part of: Arduino Projects Cookbook\n */\n\nconst byte INTERRUPT_PIN = 2; // INT0 on Uno / Nano\nconst byte STATUS_LED    = 13;\n\n// volatile tells the compiler that this variable can change unexpectedly\n// inside an interrupt, preventing aggressive compiler optimization.\nvolatile unsigned long pulseCount = 0;\nvolatile bool newPulseFlag = false;\n\n// Debouncing inside ISR\nvolatile unsigned long lastIsrMicros = 0;\nconst unsigned long DEBOUNCE_MICROS = 150000; // 150ms lock out for mechanical buttons\n\nvoid isrTrigger() {\n  unsigned long currentMicros = micros();\n  if (currentMicros - lastIsrMicros > DEBOUNCE_MICROS) {\n    pulseCount++;\n    newPulseFlag = true;\n    lastIsrMicros = currentMicros;\n  }\n}\n\nvoid setup() {\n  pinMode(INTERRUPT_PIN, INPUT_PULLUP);\n  pinMode(STATUS_LED, OUTPUT);\n  Serial.begin(9600);\n\n  // Attach Interrupt: pin 2, ISR function, Trigger on FALLING edge\n  attachInterrupt(digitalPinToInterrupt(INTERRUPT_PIN), isrTrigger, FALLING);\n\n  Serial.println(F(\"Hardware Interrupt active on Pin D2 (FALLING edge).\"));\n}\n\nvoid loop() {\n  // Heavy computation simulation in loop()\n  // Even if loop() is busy, the interrupt will NEVER be missed!\n  delay(500);\n\n  if (newPulseFlag) {\n    // Disable interrupts briefly if reading multi-byte variables on 8-bit AVR\n    noInterrupts();\n    unsigned long currentCount = pulseCount;\n    newPulseFlag = false;\n    interrupts();\n\n    Serial.print(F(\"Interrupt Caught! Total Events: \"));\n    Serial.println(currentCount);\n\n    digitalWrite(STATUS_LED, !digitalRead(STATUS_LED));\n  }\n}",
    "howItWorks": "When the voltage on D2 transitions from HIGH to LOW, the AVR CPU pauses whatever instruction it is currently executing in `loop()`, saves the program counter to the stack, jumps to the ISR address vector, executes the code, and immediately resumes normal execution.",
    "challenges": [
      "Attach a rotary encoder with both channels (A on D2, B on D3) to detect directional CW/CCW rotation.",
      "Build a high-speed tachometer measuring RPM of a spinning motor wheel using an optical sensor.",
      "Use pin change interrupts (PCINT) on any arbitrary Arduino pin."
    ],
    "combinations": [
      [
        "06-Automation/Security",
        "Trigger instant panic alarms when security tripwires or reed switches break."
      ],
      [
        "02-Sensors/Ultrasonic",
        "Capture exact microsecond echo return edges with zero latency."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/01-Fundamentals/Interrupts"
  },
  {
    "id": "proj-05",
    "categoryId": "01-Fundamentals",
    "categoryTitle": "Fundamentals",
    "categoryIcon": "\u26a1",
    "categoryBadge": "Core Concepts",
    "folder": "Timers",
    "title": "Hardware Timers & Non-Blocking State Machines",
    "hook": "Eliminate delay() completely to run multiple simultaneous tasks concurrently on single-core microcontrollers.",
    "sketchName": "timers.ino",
    "learn": [
      "Why delay() stalls the CPU and ruins responsive robotics",
      "Building cooperative multitasking loops using millis() timestamps",
      "Designing robust finite state machines (FSM)"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "1",
        "Main board"
      ],
      [
        "LED 1 (Red)",
        "1",
        "Fast heartbeat indicator"
      ],
      [
        "LED 2 (Green)",
        "1",
        "Slow status indicator"
      ],
      [
        "220\u03a9 Resistors",
        "2",
        "Current limiting"
      ],
      [
        "Breadboard & Jumpers",
        "1 set",
        "Connections"
      ]
    ],
    "pins": [
      [
        "D11",
        "Red LED (220\u03a9 to Anode)",
        "Blinks at 2Hz (250ms toggle)"
      ],
      [
        "D12",
        "Green LED (220\u03a9 to Anode)",
        "Blinks at 0.5Hz (1000ms toggle)"
      ],
      [
        "GND",
        "Cathodes",
        "Common Ground"
      ]
    ],
    "asciiDiagram": "+-----------------+\n    |   Arduino Uno   |\n    |                 |\n    |             D11 |---[ 220\u03a9 ]--->| (Red LED)   ---+\n    |             D12 |---[ 220\u03a9 ]--->| (Green LED) -+\n    |                 |                              |\n    |             GND |------------------------------+\n    +-----------------+",
    "code": "/*\n * Module: Non-Blocking Concurrent Timers & Multitasking\n * Description: Runs two independent LED flashers and a serial telemetry\n *              task at different frequencies with zero delay() bottlenecks.\n * Part of: Arduino Projects Cookbook\n */\n\nstruct TaskTimer {\n  unsigned long previousMillis;\n  unsigned long interval;\n};\n\nTaskTimer taskFast  = {0, 250};   // 4Hz toggle (250ms)\nTaskTimer taskSlow  = {0, 1000};  // 1Hz toggle (1000ms)\nTaskTimer taskTelemetry = {0, 2000}; // Report every 2s\n\nconst int PIN_FAST = 11;\nconst int PIN_SLOW = 12;\n\nbool stateFast = false;\nbool stateSlow = false;\n\nvoid setup() {\n  pinMode(PIN_FAST, OUTPUT);\n  pinMode(PIN_SLOW, OUTPUT);\n  Serial.begin(9600);\n  Serial.println(F(\"Cooperative Multitasking Engine Started.\"));\n}\n\nvoid loop() {\n  unsigned long now = millis();\n\n  // Task 1: Fast Flash\n  if (now - taskFast.previousMillis >= taskFast.interval) {\n    taskFast.previousMillis = now;\n    stateFast = !stateFast;\n    digitalWrite(PIN_FAST, stateFast);\n  }\n\n  // Task 2: Slow Flash\n  if (now - taskSlow.previousMillis >= taskSlow.interval) {\n    taskSlow.previousMillis = now;\n    stateSlow = !stateSlow;\n    digitalWrite(PIN_SLOW, stateSlow);\n  }\n\n  // Task 3: Telemetry Stream\n  if (now - taskTelemetry.previousMillis >= taskTelemetry.interval) {\n    taskTelemetry.previousMillis = now;\n    Serial.print(F(\"[UPTIME] \"));\n    Serial.print(now / 1000);\n    Serial.print(F(\"s | Fast LED: \"));\n    Serial.print(stateFast ? \"ON\" : \"OFF\");\n    Serial.print(F(\" | Slow LED: \"));\n    Serial.println(stateSlow ? \"ON\" : \"OFF\");\n  }\n\n  // The loop is completely free to handle immediate sensor inputs here!\n}",
    "howItWorks": "The ATmega328P Timer0 runs continuously in the background, incrementing an internal counter every millisecond. `millis()` returns this 32-bit unsigned integer (which overflows only after ~49.7 days). By subtracting `now - previousMillis >= interval`, subtraction with unsigned arithmetic handles rollover seamlessly.",
    "challenges": [
      "Add an automatic timeout feature that shuts off an actuator after 10 seconds of inactivity.",
      "Create a dynamic rate scheduler where one task adjusts the frequency of another.",
      "Implement a lightweight state machine (IDLE -> ARMED -> TRIGGERED -> COOLDOWN)."
    ],
    "combinations": [
      [
        "06-Automation/Environment-Monitoring",
        "Sample temperature every 5 minutes while polling buttons every 20ms and updating LCD every 1 second."
      ],
      [
        "03-Actuators/Servo",
        "Create smooth multi-point robotic sweep trajectories without blocking."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/01-Fundamentals/Timers"
  },
  {
    "id": "proj-06",
    "categoryId": "01-Fundamentals",
    "categoryTitle": "Fundamentals",
    "categoryIcon": "\u26a1",
    "categoryBadge": "Core Concepts",
    "folder": "Serial-Communication",
    "title": "Serial Communication (UART Command Line Interface)",
    "hook": "Transmit telemetry, parse incoming ASCII commands, and control your Arduino in real-time from your computer terminal.",
    "sketchName": "serial_communication.ino",
    "learn": [
      "Baud rates, UART framing (8N1), and hardware buffers",
      "Non-blocking line-by-line serial command parsing using readBytesUntil() or char buffers",
      "Structuring human-readable and JSON-formatted diagnostic logs"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "1",
        "Main board"
      ],
      [
        "USB Cable",
        "1",
        "Serial communication link to PC"
      ]
    ],
    "pins": [
      [
        "USB / D0 (RX)",
        "PC TX",
        "Receives data from computer"
      ],
      [
        "USB / D1 (TX)",
        "PC RX",
        "Transmits data to computer"
      ]
    ],
    "asciiDiagram": "+-----------------+        USB Cable         +--------------------+\n    |   Arduino Uno   |<========================>| Computer / Laptop  |\n    |                 |   (Virtual COM Port)     |  (Serial Monitor   |\n    |      D0 (RX)    |                          |   @ 115200 Baud)   |\n    |      D1 (TX)    |                          +--------------------+\n    +-----------------+",
    "code": "/*\n * Module: Serial Communication & Interactive CLI\n * Description: Parses multi-character text commands from the Serial Monitor\n *              to configure onboard hardware and query telemetry.\n * Part of: Arduino Projects Cookbook\n */\n\nconst int STATUS_LED = 13;\nString inputString = \"\";\nbool stringComplete = false;\n\nvoid setup() {\n  pinMode(STATUS_LED, OUTPUT);\n  Serial.begin(115200); // Fast modern baud rate\n  inputString.reserve(64);\n\n  Serial.println(F(\"========================================\"));\n  Serial.println(F(\"      ARDUINO CLI ENGINE v1.0           \"));\n  Serial.println(F(\" Available Commands:                    \"));\n  Serial.println(F(\"   LED ON     - Turn pin 13 ON          \"));\n  Serial.println(F(\"   LED OFF    - Turn pin 13 OFF         \"));\n  Serial.println(F(\"   READ A0    - Sample analog pin A0    \"));\n  Serial.println(F(\"   PING       - Return PONG & uptime    \"));\n  Serial.println(F(\"========================================\"));\n  Serial.print(F(\"> \"));\n}\n\nvoid loop() {\n  // Check if a complete command line has arrived\n  if (stringComplete) {\n    inputString.trim(); // Strip trailing \\r and \\n\n\n    if (inputString.equalsIgnoreCase(\"LED ON\")) {\n      digitalWrite(STATUS_LED, HIGH);\n      Serial.println(F(\"OK: LED set to HIGH\"));\n    } else if (inputString.equalsIgnoreCase(\"LED OFF\")) {\n      digitalWrite(STATUS_LED, LOW);\n      Serial.println(F(\"OK: LED set to LOW\"));\n    } else if (inputString.equalsIgnoreCase(\"READ A0\")) {\n      int val = analogRead(A0);\n      float v = (val * 5.0) / 1023.0;\n      Serial.print(F(\"ANALOG A0: \"));\n      Serial.print(val);\n      Serial.print(F(\" (\"));\n      Serial.print(v, 2);\n      Serial.println(F(\"V)\"));\n    } else if (inputString.equalsIgnoreCase(\"PING\")) {\n      Serial.print(F(\"PONG (Uptime: \"));\n      Serial.print(millis() / 1000);\n      Serial.println(F(\"s)\"));\n    } else if (inputString.length() > 0) {\n      Serial.print(F(\"ERR: Unknown command '\"));\n      Serial.print(inputString);\n      Serial.println(F(\"'\"));\n    }\n\n    // Reset buffer for next command\n    inputString = \"\";\n    stringComplete = false;\n    Serial.print(F(\"> \"));\n  }\n}\n\n// Built-in Arduino serial event handler called between loop() iterations\nvoid serialEvent() {\n  while (Serial.available()) {\n    char inChar = (char)Serial.read();\n    if (inChar == '\\n') {\n      stringComplete = true;\n    } else if (inChar != '\\r') {\n      inputString += inChar;\n    }\n  }\n}",
    "howItWorks": "Universal Asynchronous Receiver-Transmitter (UART) converts parallel byte data to a serial stream of bits with start/stop framing. Arduino's USB-to-UART chip (e.g. ATmega16U2 or CH340) presents a virtual COM port. Incoming bytes accumulate in a 64-byte hardware FIFO ring buffer until extracted via `Serial.read()`.",
    "challenges": [
      "Format telemetry as JSON packets (e.g., `{\"temp\": 24.5, \"hum\": 60}`) for Python/Node.js dashboards.",
      "Add variable command parsing (e.g., `PWM 9 128` to set pin 9 to duty cycle 128).",
      "Implement a CRC checksum validation for noisy telemetry links."
    ],
    "combinations": [
      [
        "05-Communication/Bluetooth",
        "Use SoftwareSerial to pipe the exact same CLI command structure wirelessly over HC-05."
      ],
      [
        "05-Communication/WiFi",
        "Bridge Serial commands to an MQTT broker via ESP8266."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/01-Fundamentals/Serial-Communication"
  },
  {
    "id": "proj-07",
    "categoryId": "02-Sensors",
    "categoryTitle": "Sensors",
    "categoryIcon": "\ud83d\udce1",
    "categoryBadge": "Environmental",
    "folder": "Ultrasonic",
    "title": "Ultrasonic Distance Sensor (HC-SR04)",
    "hook": "Measure distances with millimeter precision using 40kHz acoustic pulses and speed-of-sound physics.",
    "sketchName": "ultrasonic.ino",
    "learn": [
      "Speed of sound calculation in dry air (343 m/s or 29.1 \u00b5s/cm)",
      "Generating 10-microsecond trigger pulses",
      "Measuring high-precision echo pulses with pulseIn()"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "1",
        "Main board"
      ],
      [
        "HC-SR04 Ultrasonic Sensor",
        "1",
        "4-pin sonar transceiver module"
      ],
      [
        "Breadboard & Wires",
        "1 set",
        "Connections"
      ]
    ],
    "pins": [
      [
        "5V",
        "VCC",
        "5V Power"
      ],
      [
        "GND",
        "GND",
        "Ground reference"
      ],
      [
        "D9",
        "TRIG",
        "Trigger pulse output"
      ],
      [
        "D10",
        "ECHO",
        "Echo pulse input"
      ]
    ],
    "asciiDiagram": "+-----------------+              +----------------------+\n    |   Arduino Uno   |              |  HC-SR04 Ultrasonic  |\n    |                 |              |  [ T ]        [ R ]  |\n    |              5V |=============>| VCC                  |\n    |              D9 |------------->| TRIG                 |\n    |             D10 |<-------------| ECHO                 |\n    |             GND |=============>| GND                  |\n    +-----------------+              +----------------------+",
    "code": "/*\n * Module: HC-SR04 Ultrasonic Distance Sensor\n * Description: Fires a 40kHz ultrasonic burst and computes exact obstacle\n *              distance in centimeters with outlier median filtering.\n * Part of: Arduino Projects Cookbook\n */\n\nconst int TRIG_PIN = 9;\nconst int ECHO_PIN = 10;\n\n// Speed of sound in air at 20\u00b0C: ~343 m/s = 0.0343 cm/\u00b5s\n// Distance = (Time * 0.0343) / 2 = Time / 58.2 (for round trip)\n\nvoid setup() {\n  pinMode(TRIG_PIN, OUTPUT);\n  pinMode(ECHO_PIN, INPUT);\n  Serial.begin(9600);\n  Serial.println(F(\"HC-SR04 Sonar Initialized.\"));\n}\n\nfloat readDistanceCm() {\n  // Ensure trigger pin is clean LOW\n  digitalWrite(TRIG_PIN, LOW);\n  delayMicroseconds(2);\n\n  // Send 10\u00b5s HIGH trigger pulse\n  digitalWrite(TRIG_PIN, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(TRIG_PIN, LOW);\n\n  // Read the echo pin pulse duration in microseconds (timeout at 30ms = ~5 meters)\n  unsigned long duration = pulseIn(ECHO_PIN, HIGH, 30000);\n\n  if (duration == 0) {\n    return -1.0; // Out of range / timeout\n  }\n\n  return (duration * 0.0343) / 2.0;\n}\n\nvoid loop() {\n  float distance = readDistanceCm();\n\n  if (distance >= 0 && distance <= 400) {\n    Serial.print(F(\"Distance: \"));\n    Serial.print(distance, 1);\n    Serial.print(F(\" cm (\"));\n    Serial.print(distance / 2.54, 1);\n    Serial.println(F(\" inches)\"));\n  } else {\n    Serial.println(F(\"Target out of range (>400cm or no reflection)\"));\n  }\n\n  delay(100);\n}",
    "howItWorks": "The HC-SR04 transmitter emits an 8-cycle ultrasonic burst at 40 kHz. The receiver detects the reflected echo and sets the ECHO pin HIGH for the exact duration the sound took to travel to the obstacle and bounce back. Dividing by 2 accounts for the two-way journey.",
    "challenges": [
      "Integrate a temperature sensor to adjust the speed of sound dynamically: v = 331.3 + 0.606 * T.",
      "Build a 3-zone visual parking assistant (Green = Safe, Yellow = Caution, Red = STOP).",
      "Mount the sensor on a panning servo motor to build a 180-degree radar scanner."
    ],
    "combinations": [
      [
        "03-Actuators/Buzzers",
        "Create a proximity alarm that beeps faster as objects get closer."
      ],
      [
        "03-Actuators/Servo",
        "Open an automatic trash can lid when a hand is detected closer than 15cm."
      ],
      [
        "06-Automation/Security",
        "Detect unauthorized entry in doorways."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/02-Sensors/Ultrasonic"
  },
  {
    "id": "proj-08",
    "categoryId": "02-Sensors",
    "categoryTitle": "Sensors",
    "categoryIcon": "\ud83d\udce1",
    "categoryBadge": "Environmental",
    "folder": "IR",
    "title": "Infrared Proximity & Obstacle Detector",
    "hook": "Detect close-range reflective surfaces using active infrared emitter-receiver phototransistor pairs.",
    "sketchName": "ir_sensor.ino",
    "learn": [
      "Active infrared reflection principles and surface reflectivity variations",
      "Adjusting onboard comparator sensitivity potentiometers (LM393)",
      "Handling ambient daylight interference"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "1",
        "Main board"
      ],
      [
        "TCRT5000 or FC-51 IR Obstacle Sensor",
        "1",
        "Infrared module with LM393 comparator"
      ],
      [
        "Breadboard & Jumpers",
        "1 set",
        "Connections"
      ]
    ],
    "pins": [
      [
        "5V",
        "VCC",
        "5V Power"
      ],
      [
        "GND",
        "GND",
        "Ground"
      ],
      [
        "D3",
        "OUT / DO",
        "Digital Trigger (Active LOW when obstacle detected)"
      ]
    ],
    "asciiDiagram": "+-----------------+              +----------------------+\n    |   Arduino Uno   |              |  IR Obstacle Module  |\n    |                 |              |  (IR LED)  (PhotoTr) |\n    |              5V |=============>| VCC                  |\n    |              D3 |<-------------| OUT (LM393 Output)   |\n    |             GND |=============>| GND                  |\n    +-----------------+              +----------------------+",
    "code": "/*\n * Module: Infrared (IR) Proximity & Obstacle Sensor\n * Description: Monitors infrared reflectance for proximity alerts\n *              and line-tracking navigation.\n * Part of: Arduino Projects Cookbook\n */\n\nconst int IR_PIN  = 3;\nconst int LED_PIN = 13;\n\nvoid setup() {\n  pinMode(IR_PIN, INPUT);\n  pinMode(LED_PIN, OUTPUT);\n  Serial.begin(9600);\n  Serial.println(F(\"IR Proximity Sensor Active.\"));\n}\n\nvoid loop() {\n  // Most IR modules output LOW when an obstacle reflects IR light\n  int obstacleDetected = (digitalRead(IR_PIN) == LOW);\n\n  digitalWrite(LED_PIN, obstacleDetected ? HIGH : LOW);\n\n  if (obstacleDetected) {\n    Serial.println(F(\">>> OBSTACLE DETECTED! <<<\"));\n  } else {\n    Serial.println(F(\"Path Clear.\"));\n  }\n\n  delay(100);\n}",
    "howItWorks": "The onboard IR LED transmits 950nm infrared light. When an object is within range (typically 2-30cm), light reflects into the phototransistor. An LM393 comparator compares the phototransistor voltage against an onboard trimming potentiometer threshold and triggers the digital OUT pin LOW.",
    "challenges": [
      "Use two IR sensors placed side-by-side to build a line-tracking differential steering algorithm.",
      "Count items moving down a conveyor belt by logging state transitions.",
      "Measure speed by calculating the time between two IR gate triggers."
    ],
    "combinations": [
      [
        "06-Automation/Motor-Automation",
        "Use an array of IR sensors to guide autonomous line-follower robots."
      ],
      [
        "03-Actuators/DC-Motors",
        "Emergency collision stop for differential drive rovers."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/02-Sensors/IR"
  },
  {
    "id": "proj-09",
    "categoryId": "02-Sensors",
    "categoryTitle": "Sensors",
    "categoryIcon": "\ud83d\udce1",
    "categoryBadge": "Environmental",
    "folder": "Temperature",
    "title": "Precision Temperature Sensing (DS18B20 & Thermistor)",
    "hook": "Measure Celsius and Fahrenheit temperatures with high accuracy over 1-Wire digital bus or NTC analog curves.",
    "sketchName": "temperature.ino",
    "learn": [
      "1-Wire protocol communication architecture",
      "Reading Dallas DS18B20 digital temperature sensors with 12-bit resolution (0.0625\u00b0C)",
      "Steinhart-Hart equation for analog NTC thermistor calibration"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "1",
        "Main board"
      ],
      [
        "DS18B20 Temperature Sensor (or NTC 10k)",
        "1",
        "Digital 1-Wire sensor (TO-92 or waterproof probe)"
      ],
      [
        "4.7k\u03a9 Resistor",
        "1",
        "Pull-up resistor for 1-Wire data bus"
      ],
      [
        "Breadboard & Jumpers",
        "1 set",
        "Connections"
      ]
    ],
    "pins": [
      [
        "5V",
        "VDD (Red)",
        "+5V Power"
      ],
      [
        "GND",
        "GND (Black)",
        "Ground reference"
      ],
      [
        "D4",
        "DQ (Yellow/White)",
        "1-Wire Data with 4.7k\u03a9 pullup to 5V"
      ]
    ],
    "asciiDiagram": "+-----------------+\n    |   Arduino Uno   |\n    |                 |\n    |              5V |---------+-------------+ (DS18B20 VDD)\n    |                 |         |             |\n    |                 |      [ 4.7k\u03a9 ]        |\n    |                 |         |             |\n    |              D4 |---------+-------------+ (DS18B20 DQ Data)\n    |                 |                       |\n    |             GND |-----------------------+ (DS18B20 GND)\n    +-----------------+",
    "code": "/*\n * Module: DS18B20 1-Wire Digital Temperature Sensor\n * Description: Reads digital temperatures with 12-bit resolution.\n * Requires: OneWire and DallasTemperature libraries (Arduino Library Manager)\n * Part of: Arduino Projects Cookbook\n */\n\n#include <OneWire.h>\n#include <DallasTemperature.h>\n\nconst int ONE_WIRE_BUS = 4;\n\nOneWire oneWire(ONE_WIRE_BUS);\nDallasTemperature sensors(&oneWire);\n\nvoid setup() {\n  Serial.begin(9600);\n  sensors.begin();\n  Serial.println(F(\"DS18B20 1-Wire Sensor Initialized.\"));\n  Serial.print(F(\"Sensors found: \"));\n  Serial.println(sensors.getDeviceCount());\n}\n\nvoid loop() {\n  sensors.requestTemperatures(); // Issue global temperature conversion command\n\n  float tempC = sensors.getTempCByIndex(0);\n  float tempF = DallasTemperature::toFahrenheit(tempC);\n\n  if (tempC != DEVICE_DISCONNECTED_C) {\n    Serial.print(F(\"Temperature: \"));\n    Serial.print(tempC, 2);\n    Serial.print(F(\" \u00b0C  |  \"));\n    Serial.print(tempF, 2);\n    Serial.println(F(\" \u00b0F\"));\n  } else {\n    Serial.println(F(\"Error: DS18B20 disconnected!\"));\n  }\n\n  delay(1000);\n}",
    "howItWorks": "1-Wire allows dozens of sensors to share a single digital pin. Each DS18B20 has a factory-lasered unique 64-bit ROM code. Inside the sensor, an onboard bandgap temperature reference and sigma-delta ADC convert temperature directly into digital words without analog noise corruption.",
    "challenges": [
      "Connect 3 DS18B20 sensors on the same D4 pin and address them individually by their unique 64-bit addresses.",
      "Implement an over-temperature cooling fan trigger with hysteresis (e.g. Turn ON at 30\u00b0C, Turn OFF at 27\u00b0C).",
      "Log temperatures to an SD card or EEPROM memory every hour."
    ],
    "combinations": [
      [
        "04-Displays/LCD",
        "Display current, min, and max temperatures on a 16x2 screen."
      ],
      [
        "03-Actuators/Relays",
        "Build a home brewing or greenhouse climate thermostat."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/02-Sensors/Temperature"
  },
  {
    "id": "proj-10",
    "categoryId": "02-Sensors",
    "categoryTitle": "Sensors",
    "categoryIcon": "\ud83d\udce1",
    "categoryBadge": "Environmental",
    "folder": "Humidity",
    "title": "Relative Humidity & Temperature (DHT11 / DHT22)",
    "hook": "Track ambient moisture and comfort index using digital capacitive humidity sensors.",
    "sketchName": "humidity.ino",
    "learn": [
      "Capacitive relative humidity (%RH) sensing physics",
      "Decoding single-wire custom bi-directional digital pulse trains",
      "Calculating Heat Index (Feels Like temperature)"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "1",
        "Main board"
      ],
      [
        "DHT11 or DHT22 (AM2302) Sensor",
        "1",
        "Digital Humidity & Temp module"
      ],
      [
        "10k\u03a9 Resistor",
        "1",
        "Pull-up resistor (if using bare sensor without PCB module)"
      ],
      [
        "Breadboard & Jumpers",
        "1 set",
        "Connections"
      ]
    ],
    "pins": [
      [
        "5V",
        "VCC",
        "5V Power"
      ],
      [
        "GND",
        "GND",
        "Ground"
      ],
      [
        "D5",
        "DATA",
        "Bi-directional digital data line"
      ]
    ],
    "asciiDiagram": "+-----------------+              +----------------------+\n    |   Arduino Uno   |              |  DHT11 / DHT22       |\n    |                 |              |  [==== Humidity ====]|\n    |              5V |=============>| VCC (Pin 1)          |\n    |              D5 |<------------>| DATA (Pin 2)         |\n    |             GND |=============>| GND (Pin 4)          |\n    +-----------------+              +----------------------+",
    "code": "/*\n * Module: DHT11 / DHT22 Relative Humidity & Temperature\n * Description: Reads relative humidity (%RH) and ambient temperature,\n *              calculating the human Heat Index comfort score.\n * Requires: DHT sensor library by Adafruit\n * Part of: Arduino Projects Cookbook\n */\n\n#include \"DHT.h\"\n\n#define DHTPIN 5\n#define DHTTYPE DHT11   // Set to DHT22 for higher accuracy AM2302\n\nDHT dht(DHTPIN, DHTTYPE);\n\nvoid setup() {\n  Serial.begin(9600);\n  dht.begin();\n  Serial.println(F(\"DHT Environmental Sensor Active.\"));\n}\n\nvoid loop() {\n  // Reading temperature or humidity takes about 250 milliseconds!\n  float humidity = dht.readHumidity();\n  float tempC = dht.readTemperature();\n  float tempF = dht.readTemperature(true);\n\n  if (isnan(humidity) || isnan(tempC) || isnan(tempF)) {\n    Serial.println(F(\"Failed to read from DHT sensor! Check wiring.\"));\n    delay(2000);\n    return;\n  }\n\n  // Compute Heat Index in Fahrenheit and Celsius\n  float hif = dht.computeHeatIndex(tempF, humidity);\n  float hic = dht.computeHeatIndex(tempC, humidity, false);\n\n  Serial.print(F(\"Humidity: \"));\n  Serial.print(humidity, 1);\n  Serial.print(F(\" %RH  |  Temp: \"));\n  Serial.print(tempC, 1);\n  Serial.print(F(\" \u00b0C  |  Heat Index: \"));\n  Serial.print(hic, 1);\n  Serial.println(F(\" \u00b0C\"));\n\n  delay(2000); // DHT11 minimum sampling interval is 1-2 seconds\n}",
    "howItWorks": "The DHT uses a capacitive moisture sensor consisting of a moisture-holding dielectric substrate sandwiched between two electrodes. As humidity changes, the dielectric constant changes, shifting capacitance. An onboard 8-bit chip measures this capacitance, calibrates against stored ROM values, and outputs 40 bits of serial data.",
    "challenges": [
      "Calculate dew point using the Magnus formula from temperature and relative humidity.",
      "Trigger an automated dehumidifier relay if humidity exceeds 65% RH for more than 5 minutes.",
      "Plot live humidity graphs in the Arduino IDE Serial Plotter."
    ],
    "combinations": [
      [
        "06-Automation/Environment-Monitoring",
        "Combine with light and soil moisture for automated plant care systems."
      ],
      [
        "05-Communication/WiFi",
        "Stream humidity telemetry to Adafruit IO or ThingSpeak IoT dashboards."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/02-Sensors/Humidity"
  },
  {
    "id": "proj-11",
    "categoryId": "02-Sensors",
    "categoryTitle": "Sensors",
    "categoryIcon": "\ud83d\udce1",
    "categoryBadge": "Environmental",
    "folder": "Light",
    "title": "Ambient Light Intensity (Photoresistor / LDR)",
    "hook": "Detect ambient daylight, room illumination, and laser tripwires with a Light Dependent Resistor (LDR).",
    "sketchName": "light_sensor.ino",
    "learn": [
      "Photoconductive effect in Cadmium Sulfide (CdS) semiconductors",
      "Designing voltage divider networks: Vout = Vin * (R2 / (R1 + R2))",
      "Auto-calibrating light and dark thresholds dynamically in setup()"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "1",
        "Main board"
      ],
      [
        "Photoresistor (LDR / CdS Cell)",
        "1",
        "5mm photoresistor"
      ],
      [
        "10k\u03a9 Resistor",
        "1",
        "Fixed resistor for voltage divider"
      ],
      [
        "Breadboard & Jumpers",
        "1 set",
        "Connections"
      ]
    ],
    "pins": [
      [
        "5V",
        "LDR Leg 1",
        "+5V Power rail"
      ],
      [
        "A1",
        "LDR Leg 2 & 10k\u03a9 Resistor",
        "Voltage Divider Midpoint (Analog In)"
      ],
      [
        "GND",
        "10k\u03a9 Resistor Leg 2",
        "Ground rail"
      ]
    ],
    "asciiDiagram": "+-----------------+\n    |   Arduino Uno   |\n    |                 |\n    |              5V |---------+\n    |                 |         |\n    |                 |     [ Photoresistor (LDR) ]\n    |                 |         |\n    |              A1 |---------+ (Midpoint)\n    |                 |         |\n    |                 |     [ 10k\u03a9 Fixed Resistor ]\n    |                 |         |\n    |             GND |---------+\n    +-----------------+",
    "code": "/*\n * Module: Ambient Light Sensing (LDR Voltage Divider)\n * Description: Calibrates ambient room light on startup and triggers\n *              automatic nightlight activation with hysteresis.\n * Part of: Arduino Projects Cookbook\n */\n\nconst int LDR_PIN = A1;\nconst int NIGHTLIGHT_PIN = 13;\n\nint sensorMin = 1023;\nint sensorMax = 0;\n\nvoid setup() {\n  pinMode(NIGHTLIGHT_PIN, OUTPUT);\n  Serial.begin(9600);\n\n  Serial.println(F(\"Calibrating LDR for 5 seconds... Cover and shine light!\"));\n  // 5-second calibration window\n  while (millis() < 5000) {\n    int val = analogRead(LDR_PIN);\n    if (val < sensorMin) sensorMin = val;\n    if (val > sensorMax) sensorMax = val;\n  }\n\n  Serial.print(F(\"Calibration Done. Min: \"));\n  Serial.print(sensorMin);\n  Serial.print(F(\" | Max: \"));\n  Serial.println(sensorMax);\n}\n\nvoid loop() {\n  int rawValue = analogRead(LDR_PIN);\n  \n  // Constrain and map reading to 0 - 100% light intensity\n  rawValue = constrain(rawValue, sensorMin, sensorMax);\n  int lightPercent = map(rawValue, sensorMin, sensorMax, 0, 100);\n\n  Serial.print(F(\"Light Level: \"));\n  Serial.print(lightPercent);\n  Serial.println(F(\" %\"));\n\n  // Nightlight threshold with hysteresis (turn on below 20%, turn off above 30%)\n  if (lightPercent < 20) {\n    digitalWrite(NIGHTLIGHT_PIN, HIGH);\n  } else if (lightPercent > 30) {\n    digitalWrite(NIGHTLIGHT_PIN, LOW);\n  }\n\n  delay(200);\n}",
    "howItWorks": "As photons strike the Cadmium Sulfide semiconductor, electrons are excited across the bandgap, decreasing electrical resistance from ~1M\u03a9 (in complete darkness) down to ~1k\u03a9 (in bright sunlight). In a voltage divider, this resistance shift alters the voltage measured at pin A1 proportionally.",
    "challenges": [
      "Build a dual-axis solar tracker using two LDRs and a servo motor.",
      "Create a laser tripwire alarm that triggers when a laser beam focused on the LDR is broken.",
      "Upgrade to a digital I2C ambient light sensor like the BH1750 (measures true Lux)."
    ],
    "combinations": [
      [
        "06-Automation/Smart-Lighting",
        "Automatically control residential high-voltage lamps through relays as the sun sets."
      ],
      [
        "03-Actuators/LEDs",
        "Inversely dim an LED so it brightens as ambient room light drops."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/02-Sensors/Light"
  },
  {
    "id": "proj-12",
    "categoryId": "02-Sensors",
    "categoryTitle": "Sensors",
    "categoryIcon": "\ud83d\udce1",
    "categoryBadge": "Environmental",
    "folder": "IMU",
    "title": "6-DOF IMU Motion Tracking (MPU6050 Accelerometer & Gyro)",
    "hook": "Track 3-axis acceleration, angular velocity, and tilt angles using an I2C Micro-Electro-Mechanical (MEMS) IMU.",
    "sketchName": "imu_mpu6050.ino",
    "learn": [
      "MEMS capacitive accelerometer and Coriolis gyroscope physics",
      "I2C protocol registers and 16-bit signed integer decoding",
      "Computing pitch, roll, and complementary filtering to cancel drift"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "1",
        "Main board"
      ],
      [
        "MPU6050 (GY-521) 6-DOF IMU",
        "1",
        "Accelerometer + Gyroscope module"
      ],
      [
        "Breadboard & Jumpers",
        "1 set",
        "Connections"
      ]
    ],
    "pins": [
      [
        "5V / 3.3V",
        "VCC",
        "Power supply (MPU6050 board has onboard 3.3V LDO)"
      ],
      [
        "GND",
        "GND",
        "Ground"
      ],
      [
        "A4",
        "SDA",
        "I2C Serial Data"
      ],
      [
        "A5",
        "SCL",
        "I2C Serial Clock"
      ]
    ],
    "asciiDiagram": "+-----------------+              +----------------------+\n    |   Arduino Uno   |              |  MPU-6050 (GY-521)   |\n    |                 |              |  [ 3-Axis Accel/Gyro]|\n    |              5V |=============>| VCC                  |\n    |             GND |=============>| GND                  |\n    |        A4 (SDA) |<------------>| SDA                  |\n    |        A5 (SCL) |------------->| SCL                  |\n    +-----------------+              +----------------------+",
    "code": "/*\n * Module: MPU6050 6-Axis Accelerometer & Gyroscope\n * Description: Reads raw G-force acceleration and angular velocity over I2C,\n *              calculating pitch and roll angles with a complementary filter.\n * Part of: Arduino Projects Cookbook\n */\n\n#include <Wire.h>\n\nconst int MPU_ADDR = 0x68; // I2C address of MPU6050 (when AD0 pin is LOW)\n\nint16_t accX, accY, accZ;\nint16_t gyroX, gyroY, gyroZ;\nint16_t tempRaw;\n\nfloat pitch = 0.0;\nfloat roll  = 0.0;\nunsigned long prevTime = 0;\n\nvoid setup() {\n  Serial.begin(115200);\n  Wire.begin();\n\n  // Wake up MPU6050 by clearing sleep bit in PWR_MGMT_1 register (0x6B)\n  Wire.beginTransmission(MPU_ADDR);\n  Wire.write(0x6B);\n  Wire.write(0x00);\n  Wire.endTransmission(true);\n\n  prevTime = micros();\n  Serial.println(F(\"MPU6050 Online. Streaming Pitch and Roll...\"));\n}\n\nvoid loop() {\n  // Request 14 sequential data registers starting at 0x3B (ACCEL_XOUT_H)\n  Wire.beginTransmission(MPU_ADDR);\n  Wire.write(0x3B);\n  Wire.endTransmission(false);\n  Wire.requestFrom(MPU_ADDR, 14, true);\n\n  accX = (Wire.read() << 8) | Wire.read();\n  accY = (Wire.read() << 8) | Wire.read();\n  accZ = (Wire.read() << 8) | Wire.read();\n  tempRaw = (Wire.read() << 8) | Wire.read();\n  gyroX = (Wire.read() << 8) | Wire.read();\n  gyroY = (Wire.read() << 8) | Wire.read();\n  gyroZ = (Wire.read() << 8) | Wire.read();\n\n  unsigned long now = micros();\n  float dt = (now - prevTime) / 1000000.0;\n  prevTime = now;\n\n  // Convert raw acceleration to angles (in degrees)\n  float accPitch = atan2((float)accY, sqrt((float)accX * accX + (float)accZ * accZ)) * 180.0 / PI;\n  float accRoll  = atan2(-(float)accX, (float)accZ) * 180.0 / PI;\n\n  // Gyroscope angular velocity (deg/s) for \u00b1250 deg/s range (sensitivity = 131 LSB/(deg/s))\n  float gyroPitchRate = gyroX / 131.0;\n  float gyroRollRate  = gyroY / 131.0;\n\n  // Complementary Filter: 96% Gyro (fast response) + 4% Accel (long-term drift correction)\n  pitch = 0.96 * (pitch + gyroPitchRate * dt) + 0.04 * accPitch;\n  roll  = 0.96 * (roll + gyroRollRate * dt)   + 0.04 * accRoll;\n\n  Serial.print(F(\"Pitch: \"));\n  Serial.print(pitch, 1);\n  Serial.print(F(\"\u00b0\\tRoll: \"));\n  Serial.print(roll, 1);\n  Serial.println(F(\"\u00b0\"));\n\n  delay(20); // 50 Hz loop\n}",
    "howItWorks": "The MPU6050 contains micro-machined silicon structures. Deflection of proof masses under acceleration causes capacitance variations measured by on-chip ADCs. While accelerometers calculate absolute tilt from gravity, they are susceptible to vibrations. Gyroscopes measure fast rotations without vibration noise but drift over time. A Complementary Filter fuses both sensor streams for rock-solid stability.",
    "challenges": [
      "Use the pitch angle to build a two-wheeled self-balancing robot with PID motor control.",
      "Recognize free-fall or shake gestures to trigger safety emergency stops.",
      "Send Euler angles into Processing or Three.js to render a real-time 3D airplane model on screen."
    ],
    "combinations": [
      [
        "03-Actuators/Servo",
        "Build an active 2-axis camera gimbal that stabilizes a camera as the mount tilts."
      ],
      [
        "05-Communication/Bluetooth",
        "Build a wireless gesture-controlled gaming controller."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/02-Sensors/IMU"
  },
  {
    "id": "proj-13",
    "categoryId": "02-Sensors",
    "categoryTitle": "Sensors",
    "categoryIcon": "\ud83d\udce1",
    "categoryBadge": "Environmental",
    "folder": "Distance",
    "title": "Time-of-Flight Laser Distance (VL53L0X / VL53L1X)",
    "hook": "Measure precise millimeter distances regardless of target color or surface reflectivity using 940nm photon flight times.",
    "sketchName": "tof_distance.ino",
    "learn": [
      "Time-of-Flight (ToF) vs Sonar vs IR triangulation advantages",
      "VCSEL (Vertical Cavity Surface Emitting Laser) technology",
      "I2C communication with high-speed distance ranging sensors"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "1",
        "Main board"
      ],
      [
        "VL53L0X ToF Laser Distance Sensor",
        "1",
        "I2C Laser Ranging module (up to 2 meters)"
      ],
      [
        "Breadboard & Jumpers",
        "1 set",
        "Connections"
      ]
    ],
    "pins": [
      [
        "5V / 3.3V",
        "VIN / VCC",
        "Power supply"
      ],
      [
        "GND",
        "GND",
        "Ground"
      ],
      [
        "A4",
        "SDA",
        "I2C Data"
      ],
      [
        "A5",
        "SCL",
        "I2C Clock"
      ]
    ],
    "asciiDiagram": "+-----------------+              +----------------------+\n    |   Arduino Uno   |              |  VL53L0X ToF Laser   |\n    |                 |              |  (940nm VCSEL Laser) |\n    |              5V |=============>| VIN                  |\n    |             GND |=============>| GND                  |\n    |        A4 (SDA) |<------------>| SDA                  |\n    |        A5 (SCL) |------------->| SCL                  |\n    +-----------------+              +----------------------+",
    "code": "/*\n * Module: VL53L0X Time-of-Flight (ToF) Laser Distance Sensor\n * Description: Emits invisible 940nm laser photons and measures picosecond\n *              flight durations to achieve millimeter precision ranging.\n * Requires: Adafruit_VL53L0X library (Arduino Library Manager)\n * Part of: Arduino Projects Cookbook\n */\n\n#include <Wire.h>\n#include \"Adafruit_VL53L0X.h\"\n\nAdafruit_VL53L0X lox = Adafruit_VL53L0X();\n\nvoid setup() {\n  Serial.begin(115200);\n  while (!Serial) delay(1); // Wait for Serial Monitor on Leonardo/ESP32\n\n  Serial.println(F(\"Initializing VL53L0X Laser Ranging Sensor...\"));\n  if (!lox.begin()) {\n    Serial.println(F(\"Failed to boot VL53L0X! Check wiring and pullups.\"));\n    while (1);\n  }\n  Serial.println(F(\"VL53L0X Online and Ready.\"));\n}\n\nvoid loop() {\n  VL53L0X_RangingMeasurementData_t measure;\n  \n  lox.rangingTest(&measure, false); // Pass 'true' for diagnostic debug prints\n\n  if (measure.RangeStatus != 4) { // Phase failures = 4 (out of range)\n    Serial.print(F(\"Laser Distance: \"));\n    Serial.print(measure.RangeMilliMeter);\n    Serial.print(F(\" mm (\"));\n    Serial.print(measure.RangeMilliMeter / 10.0, 1);\n    Serial.println(F(\" cm)\"));\n  } else {\n    Serial.println(F(\"Laser target out of range (>2000mm)\"));\n  }\n\n  delay(100);\n}",
    "howItWorks": "Unlike ultrasonic sensors that can bounce off angled surfaces or IR sensors deceived by dark colors, ToF sensors emit photons of 940nm infrared laser light and use Single Photon Avalanche Diodes (SPADs) to time the flight of individual light particles returning at 300,000 km/s.",
    "challenges": [
      "Configure long-range mode or high-accuracy mode (timing budget = 200ms) for sub-millimeter measurements.",
      "Build a digital touchless gesture switch that detects hand hover heights.",
      "Create a liquid level depth monitor for narrow pipes."
    ],
    "combinations": [
      [
        "04-Displays/7-Segment",
        "Build a digital laser tape measure displaying millimeters in real-time."
      ],
      [
        "06-Automation/Security",
        "High-precision laser trip perimeter monitors."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/02-Sensors/Distance"
  },
  {
    "id": "proj-14",
    "categoryId": "03-Actuators",
    "categoryTitle": "Actuators",
    "categoryIcon": "\u2699\ufe0f",
    "categoryBadge": "Motion & Power",
    "folder": "LEDs",
    "title": "LED Sequences & Addressable WS2812B NeoPixels",
    "hook": "Create visual indicators, traffic light sequences, and control millions of colors with single-wire addressable RGB LEDs.",
    "sketchName": "leds.ino",
    "learn": [
      "Current calculation: I = (Vsource - Vled) / R",
      "Controlling individual color channels in WS2812B / NeoPixel arrays",
      "Single-wire 800kHz precision timing protocols"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "1",
        "Main board"
      ],
      [
        "WS2812B / NeoPixel Ring (8 or 16 LEDs) or 3x Discrete LEDs",
        "1",
        "RGB LED module"
      ],
      [
        "330\u03a9 Resistor & 1000\u00b5F Capacitor",
        "1 each",
        "Protection components for NeoPixels"
      ],
      [
        "Breadboard & Jumpers",
        "1 set",
        "Connections"
      ]
    ],
    "pins": [
      [
        "5V",
        "NeoPixel VCC",
        "5V Power"
      ],
      [
        "D6",
        "NeoPixel DIN (via 330\u03a9)",
        "High-speed 800kHz data signal"
      ],
      [
        "GND",
        "NeoPixel GND",
        "Ground"
      ]
    ],
    "asciiDiagram": "+-----------------+              +----------------------+\n    |   Arduino Uno   |              |  WS2812B NeoPixel    |\n    |                 |              |  [RGB] [RGB] [RGB]   |\n    |              5V |=============>| VCC                  |\n    |              D6 |---[ 330\u03a9 ]-->| DIN                  |\n    |             GND |=============>| GND                  |\n    +-----------------+              +----------------------+",
    "code": "/*\n * Module: WS2812B / NeoPixel Addressable RGB LEDs\n * Description: Animates a smooth rainbow chase cycle across an addressable\n *              LED strip using only 1 digital output pin.\n * Requires: Adafruit_NeoPixel library (Arduino Library Manager)\n * Part of: Arduino Projects Cookbook\n */\n\n#include <Adafruit_NeoPixel.h>\n\n#define LED_PIN    6\n#define LED_COUNT  8\n\nAdafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);\n\nvoid setup() {\n  strip.begin();\n  strip.show(); // Initialize all pixels to 'off'\n  strip.setBrightness(50); // Set brightness to ~20% to save power\n}\n\n// Generate rainbow colors across 0-255 spectrum\nuint32_t Wheel(byte WheelPos) {\n  WheelPos = 255 - WheelPos;\n  if (WheelPos < 85) {\n    return strip.Color(255 - WheelPos * 3, 0, WheelPos * 3);\n  }\n  if (WheelPos < 170) {\n    WheelPos -= 85;\n    return strip.Color(0, WheelPos * 3, 255 - WheelPos * 3);\n  }\n  WheelPos -= 170;\n  return strip.Color(WheelPos * 3, 255 - WheelPos * 3, 0);\n}\n\nvoid loop() {\n  // Rainbow cycle animation\n  for (long firstPixelHue = 0; firstPixelHue < 5 * 65536; firstPixelHue += 256) {\n    for (int i = 0; i < strip.numPixels(); i++) {\n      int pixelHue = firstPixelHue + (i * 65536L / strip.numPixels());\n      strip.setPixelColor(i, strip.gamma32(strip.ColorHSV(pixelHue)));\n    }\n    strip.show();\n    delay(10);\n  }\n}",
    "howItWorks": "Each WS2812B LED contains integrated Red, Green, and Blue diodes alongside an embedded driver IC. 24 bits of color data (8 bits per color) are streamed into the first pixel; it strips off its 24 bits and regenerates the signal to pass the remaining bits down the chain.",
    "challenges": [
      "Build a real-time VU audio meter with a microphone sensor module.",
      "Create a custom Knight Rider / Cylon bouncing red scanner effect.",
      "Implement a visual status indicator that shifts from green to red based on temperature."
    ],
    "combinations": [
      [
        "02-Sensors/Ultrasonic",
        "Light up more LED segments as an obstacle approaches."
      ],
      [
        "06-Automation/Smart-Lighting",
        "Create an animated sunrise wake-up lamp."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/03-Actuators/LEDs"
  },
  {
    "id": "proj-15",
    "categoryId": "03-Actuators",
    "categoryTitle": "Actuators",
    "categoryIcon": "\u2699\ufe0f",
    "categoryBadge": "Motion & Power",
    "folder": "Servo",
    "title": "Precision RC Servo Motor Control (SG90 / MG996R)",
    "hook": "Position mechanical arms, steering linkages, and camera gimbals with exact degree control from 0\u00b0 to 180\u00b0.",
    "sketchName": "servo_control.ino",
    "learn": [
      "50Hz PWM position control pulse trains (1.0ms = 0\u00b0, 1.5ms = 90\u00b0, 2.0ms = 180\u00b0)",
      "Internal closed-loop feedback potentiometer and gear train mechanisms",
      "Preventing servo jitter and power brownouts with decoupling capacitors"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "1",
        "Main board"
      ],
      [
        "SG90 Micro Servo (9g)",
        "1",
        "Positioning actuator with horns"
      ],
      [
        "100\u00b5F Capacitor",
        "1",
        "Power rail buffer capacitor"
      ],
      [
        "Breadboard & Jumpers",
        "1 set",
        "Connections"
      ]
    ],
    "pins": [
      [
        "5V",
        "VCC / Power (Red Wire)",
        "+5V Power Supply"
      ],
      [
        "D9",
        "Signal (Orange / Yellow Wire)",
        "50Hz Servo PWM Control Signal"
      ],
      [
        "GND",
        "GND (Brown / Black Wire)",
        "Common Ground"
      ]
    ],
    "asciiDiagram": "+-----------------+              +----------------------+\n    |   Arduino Uno   |              |  SG90 Micro Servo    |\n    |                 |              |  (Internal Gearbox)  |\n    |              5V |=============>| Red (VCC)            |\n    |              D9 |------------->| Orange/Yellow (PWM)  |\n    |             GND |=============>| Brown/Black (GND)    |\n    +-----------------+              +----------------------+",
    "code": "/*\n * Module: SG90 / MG996R Precision RC Servo Control\n * Description: Sweeps a micro-servo smoothly between 0\u00b0 and 180\u00b0\n *              using non-blocking incremental velocity control.\n * Part of: Arduino Projects Cookbook\n */\n\n#include <Servo.h>\n\nServo myServo;\n\nconst int SERVO_PIN = 9;\nint currentPos = 0;\nint targetPos  = 180;\nint step = 1;\n\nunsigned long prevMillis = 0;\nconst int speedDelay = 15; // Lower = faster sweep, Higher = smooth slow motion\n\nvoid setup() {\n  // Attaches the servo on pin 9 with standard 544\u00b5s - 2400\u00b5s pulse limits\n  myServo.attach(SERVO_PIN, 544, 2400);\n  myServo.write(0);\n  Serial.begin(9600);\n  Serial.println(F(\"Servo Controller Active.\"));\n}\n\nvoid loop() {\n  unsigned long now = millis();\n\n  if (now - prevMillis >= speedDelay) {\n    prevMillis = now;\n\n    currentPos += step;\n    myServo.write(currentPos);\n\n    if (currentPos >= 180) {\n      step = -1; // Reverse direction\n      Serial.println(F(\"Reached 180\u00b0 -> Sweeping to 0\u00b0\"));\n    } else if (currentPos <= 0) {\n      step = 1;\n      Serial.println(F(\"Reached 0\u00b0 -> Sweeping to 180\u00b0\"));\n    }\n  }\n}",
    "howItWorks": "A standard RC servo motor accepts a 50Hz (20ms period) pulse train. The width of the high pulse (between 1ms and 2ms) dictates the output shaft position. An internal feedback potentiometer and error amplifier continuously drive the internal DC motor until the physical shaft matches the commanded pulse width.",
    "challenges": [
      "Control servo position smoothly using an analog joystick.",
      "Build a 2-DOF Pan-Tilt turret capable of tracking coordinates.",
      "Implement a soft-start acceleration curve to prevent mechanical gear shock."
    ],
    "combinations": [
      [
        "02-Sensors/IMU",
        "Build an active 1-axis stabilization gimbal matching roll tilt."
      ],
      [
        "05-Communication/Bluetooth",
        "Position a robotic arm wirelessly from an Android/iOS app."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/03-Actuators/Servo"
  },
  {
    "id": "proj-16",
    "categoryId": "03-Actuators",
    "categoryTitle": "Actuators",
    "categoryIcon": "\u2699\ufe0f",
    "categoryBadge": "Motion & Power",
    "folder": "DC-Motors",
    "title": "DC Motor Speed & Direction Control (L298N / L293D H-Bridge)",
    "hook": "Drive high-current DC gearmotors with bi-directional rotation and PWM speed regulation.",
    "sketchName": "dc_motor.ino",
    "learn": [
      "H-Bridge transistor topology for bi-directional polarity switching",
      "Back-EMF inductive flyback protection diodes",
      "Controlling dual motors for differential skid-steer wheeled chassis"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "1",
        "Main board"
      ],
      [
        "L298N Dual H-Bridge Module",
        "1",
        "Motor driver board"
      ],
      [
        "DC Gearmotor (3V-12V)",
        "1 or 2",
        "TT Gearmotor with wheel"
      ],
      [
        "External Battery Pack (6V-9V)",
        "1",
        "Motor power supply"
      ],
      [
        "Breadboard & Jumpers",
        "1 set",
        "Connections"
      ]
    ],
    "pins": [
      [
        "D5 (~PWM)",
        "ENA",
        "Speed Control (PWM)"
      ],
      [
        "D7",
        "IN1",
        "Direction Control Pin 1"
      ],
      [
        "D8",
        "IN2",
        "Direction Control Pin 2"
      ],
      [
        "GND",
        "L298N GND",
        "Common Ground with Battery & Arduino"
      ],
      [
        "Batt +",
        "L298N 12V In",
        "External Battery Positive"
      ]
    ],
    "asciiDiagram": "+-----------------+              +----------------------+\n    |   Arduino Uno   |              |  L298N Dual H-Bridge |\n    |                 |              |                      |\n    |        D5 (PWM) |------------->| ENA (Enable/Speed)   |====> [ DC Motor ]\n    |              D7 |------------->| IN1 (Direction A)    |\n    |              D8 |------------->| IN2 (Direction B)    |\n    |             GND |======+======>| GND (Common)         |\n    +-----------------+      |       +----------------------+\n                             |                   ^\n                     [ Battery (-) ]      [ Battery (+) ]",
    "code": "/*\n * Module: L298N H-Bridge DC Motor Driver\n * Description: Controls forward/reverse rotation and smooth PWM acceleration\n *              of a DC motor while protecting the microcontroller.\n * Part of: Arduino Projects Cookbook\n */\n\nconst int ENA_PIN = 5; // PWM pin for speed control\nconst int IN1_PIN = 7; // Direction logic 1\nconst int IN2_PIN = 8; // Direction logic 2\n\nvoid setup() {\n  pinMode(ENA_PIN, OUTPUT);\n  pinMode(IN1_PIN, OUTPUT);\n  pinMode(IN2_PIN, OUTPUT);\n  Serial.begin(9600);\n  Serial.println(F(\"DC Motor Driver Initialized.\"));\n}\n\nvoid setMotor(int speed, bool forward) {\n  // Set direction\n  if (forward) {\n    digitalWrite(IN1_PIN, HIGH);\n    digitalWrite(IN2_PIN, LOW);\n  } else {\n    digitalWrite(IN1_PIN, LOW);\n    digitalWrite(IN2_PIN, HIGH);\n  }\n\n  // Set speed (0 - 255)\n  analogWrite(ENA_PIN, constrain(abs(speed), 0, 255));\n}\n\nvoid stopMotor() {\n  digitalWrite(IN1_PIN, LOW);\n  digitalWrite(IN2_PIN, LOW);\n  analogWrite(ENA_PIN, 0);\n}\n\nvoid loop() {\n  Serial.println(F(\"Ramping Forward...\"));\n  for (int spd = 50; spd <= 255; spd += 5) {\n    setMotor(spd, true);\n    delay(30);\n  }\n\n  delay(1000);\n  stopMotor();\n  delay(500);\n\n  Serial.println(F(\"Ramping Reverse...\"));\n  for (int spd = 50; spd <= 255; spd += 5) {\n    setMotor(spd, false);\n    delay(30);\n  }\n\n  delay(1000);\n  stopMotor();\n  delay(1000);\n}",
    "howItWorks": "An H-Bridge uses 4 switching transistors arranged like the letter 'H'. Activating diagonal pairs allows current to flow forward or backward through the motor coil. Microcontrollers cannot supply the high currents (1-2 Amps) or voltage spikes generated by rotating coils; the L298N isolates high current and contains flyback diodes.",
    "challenges": [
      "Drive two motors simultaneously to perform tank-style forward, reverse, and spin turns.",
      "Attach optical encoders to the motor wheels to implement closed-loop PID velocity control.",
      "Upgrade to a modern MOSFET driver like the TB6612FNG for higher efficiency and less heat dissipation."
    ],
    "combinations": [
      [
        "06-Automation/Motor-Automation",
        "Autonomous obstacle-avoiding robot car combining ultrasonic ranging with DC motors."
      ],
      [
        "05-Communication/Bluetooth",
        "Build a smartphone-controlled RC car."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/03-Actuators/DC-Motors"
  },
  {
    "id": "proj-17",
    "categoryId": "03-Actuators",
    "categoryTitle": "Actuators",
    "categoryIcon": "\u2699\ufe0f",
    "categoryBadge": "Motion & Power",
    "folder": "Stepper-Motors",
    "title": "Stepper Motor Precision Stepping (28BYJ-48 & ULN2003)",
    "hook": "Achieve exact rotational indexing, CNC positioning, and 3D printer axis movements with zero cumulative error.",
    "sketchName": "stepper_motor.ino",
    "learn": [
      "Unipolar vs Bipolar stepper motor coil winding physics",
      "Full-step vs Half-step 8-phase driving sequences",
      "Calculating steps per revolution with gear reduction ratios (4096 half-steps/rev on 28BYJ-48)"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "1",
        "Main board"
      ],
      [
        "28BYJ-48 Stepper Motor (5V)",
        "1",
        "Geared unipolar 4-phase stepper"
      ],
      [
        "ULN2003 Darlington Transistor Array Driver",
        "1",
        "Driver board with LED indicators"
      ],
      [
        "Breadboard & Jumpers",
        "1 set",
        "Connections"
      ]
    ],
    "pins": [
      [
        "5V",
        "ULN2003 5V+",
        "External or 5V Power"
      ],
      [
        "GND",
        "ULN2003 GND-",
        "Ground"
      ],
      [
        "D8",
        "IN1",
        "Phase 1 Coil Drive"
      ],
      [
        "D9",
        "IN2",
        "Phase 2 Coil Drive"
      ],
      [
        "D10",
        "IN3",
        "Phase 3 Coil Drive"
      ],
      [
        "D11",
        "IN4",
        "Phase 4 Coil Drive"
      ]
    ],
    "asciiDiagram": "+-----------------+              +----------------------+\n    |   Arduino Uno   |              |  ULN2003 Driver      |\n    |                 |              |  [ IN1 IN2 IN3 IN4 ] |=====> [ 28BYJ-48 ]\n    |              D8 |------------->| IN1                  |       (Stepper)\n    |              D9 |------------->| IN2                  |\n    |             D10 |------------->| IN3                  |\n    |             D11 |------------->| IN4                  |\n    |             GND |=============>| GND                  |\n    |              5V |=============>| 5V+                  |\n    +-----------------+              +----------------------+",
    "code": "/*\n * Module: 28BYJ-48 Stepper Motor with ULN2003 Driver\n * Description: Rotates an exact number of steps and degrees in full and\n *              half-stepping modes for precision mechanisms.\n * Requires: Stepper library (Built into Arduino IDE)\n * Part of: Arduino Projects Cookbook\n */\n\n#include <Stepper.h>\n\n// 28BYJ-48 has 32 steps per internal motor revolution, with a 64:1 gear ratio.\n// Total steps per output shaft revolution = 32 * 64 = 2048 full steps.\nconst int STEPS_PER_REV = 2048;\n\n// Pin sequencing for ULN2003 (Notice order 1, 3, 2, 4 is required by standard Stepper lib)\nStepper myStepper(STEPS_PER_REV, 8, 10, 9, 11);\n\nvoid setup() {\n  myStepper.setSpeed(10); // 10 RPM\n  Serial.begin(9600);\n  Serial.println(F(\"Stepper Motor Controller Ready.\"));\n}\n\nvoid loop() {\n  Serial.println(F(\"Rotating 1 Full Revolution Clockwise (360\u00b0)...\"));\n  myStepper.step(STEPS_PER_REV);\n  delay(1000);\n\n  Serial.println(F(\"Rotating Half Revolution Counter-Clockwise (180\u00b0)...\"));\n  myStepper.step(-STEPS_PER_REV / 2);\n  delay(1000);\n}",
    "howItWorks": "A stepper motor consists of a permanent magnet toothed rotor surrounded by stator electromagnets. By energizing coils in an alternating sequence (A -> B -> C -> D), the rotor teeth snap to the magnetic field, advancing one precise angular step at a time without slippage.",
    "challenges": [
      "Use the AccelStepper library to add smooth acceleration and deceleration curves for high-speed moves.",
      "Build a motorized automated camera slider for time-lapse photography.",
      "Add limit switches to auto-home the stepper position on boot."
    ],
    "combinations": [
      [
        "04-Displays/LCD",
        "Build an automated curtain opener with scheduled times shown on an LCD."
      ],
      [
        "01-Fundamentals/Interrupts",
        "Homing calibration using physical limit switch interrupts."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/03-Actuators/Stepper-Motors"
  },
  {
    "id": "proj-18",
    "categoryId": "03-Actuators",
    "categoryTitle": "Actuators",
    "categoryIcon": "\u2699\ufe0f",
    "categoryBadge": "Motion & Power",
    "folder": "Relays",
    "title": "Electromechanical Relay Switching (High-Voltage AC Control)",
    "hook": "Safely switch high-voltage mains AC appliances (120V/240V lamps, fans, heaters) with galvanic optocoupler isolation.",
    "sketchName": "relay_control.ino",
    "learn": [
      "Optoisolator galvanic barrier protection between 5V micro and 240V mains",
      "Normally Open (NO) vs Normally Closed (NC) relay contacts",
      "Snubber circuits and preventing AC inductive inductive kickback"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "1",
        "Main board"
      ],
      [
        "5V 1-Channel (or 4-Channel) Relay Module",
        "1",
        "Optocoupler isolated relay board (10A 250VAC rated)"
      ],
      [
        "LED / Low-voltage DC Test Load",
        "1",
        "For safe prototyping"
      ],
      [
        "Breadboard & Jumpers",
        "1 set",
        "Connections"
      ]
    ],
    "pins": [
      [
        "5V",
        "VCC",
        "5V Power"
      ],
      [
        "GND",
        "GND",
        "Ground"
      ],
      [
        "D4",
        "IN",
        "Relay Control Signal (Often Active LOW)"
      ]
    ],
    "asciiDiagram": "+-----------------+              +----------------------+\n    |   Arduino Uno   |              |  5V Opto Relay Board |\n    |                 |              |                      |\n    |              5V |=============>| VCC       [ COM ]----+==== [ High Voltage ]\n    |              D4 |------------->| IN        [  NO ]----+==== [   Load / AC  ]\n    |             GND |=============>| GND       [  NC ]    |\n    +-----------------+              +----------------------+",
    "code": "/*\n * Module: 5V Optoisolated Relay Module\n * Description: Switches high-power external loads with safe optocoupler\n *              isolation and duty-cycle interval timing.\n * Part of: Arduino Projects Cookbook\n */\n\nconst int RELAY_PIN = 4;\n\n// NOTE: Most relay modules are ACTIVE LOW (writing LOW energizes the coil)\nconst int RELAY_ON  = LOW;\nconst int RELAY_OFF = HIGH;\n\nvoid setup() {\n  pinMode(RELAY_PIN, OUTPUT);\n  digitalWrite(RELAY_PIN, RELAY_OFF); // Ensure relay starts in safe OFF state\n\n  Serial.begin(9600);\n  Serial.println(F(\"Relay Controller Armed and Safe.\"));\n}\n\nvoid loop() {\n  Serial.println(F(\"Relay: ENERGIZING COIL (Switch Closed - Load ON)\"));\n  digitalWrite(RELAY_PIN, RELAY_ON);\n  delay(3000);\n\n  Serial.println(F(\"Relay: DE-ENERGIZING COIL (Switch Open - Load OFF)\"));\n  digitalWrite(RELAY_PIN, RELAY_OFF);\n  delay(3000);\n}",
    "howItWorks": "When pin D4 goes LOW, an internal infrared LED inside an optocoupler illuminates a phototransistor. This energizes an electromagnet coil, physically pulling a spring-loaded mechanical contact from the Normally Closed (NC) pin to the Normally Open (NO) terminal. The optocoupler ensures that high voltage spikes on the AC side can never physically cross over to the Arduino.",
    "challenges": [
      "Implement a cycle-timer that runs a water pump for 30 seconds every 4 hours.",
      "Build a zero-cross solid-state relay (SSR) controller for noise-free silent switching.",
      "Add a physical manual override push button with LED status indication."
    ],
    "combinations": [
      [
        "06-Automation/Smart-Lighting",
        "Automate home ceiling lamps based on ambient brightness and motion."
      ],
      [
        "02-Sensors/Temperature",
        "Control an AC space heater or aquarium cooler based on water temperature."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/03-Actuators/Relays"
  },
  {
    "id": "proj-19",
    "categoryId": "03-Actuators",
    "categoryTitle": "Actuators",
    "categoryIcon": "\u2699\ufe0f",
    "categoryBadge": "Motion & Power",
    "folder": "Buzzers",
    "title": "Audio Tones & Melodies (Active vs Passive Piezo Buzzers)",
    "hook": "Generate musical chimes, alarm sirens, and audio UI alerts with piezo tone frequencies.",
    "sketchName": "buzzer_tones.ino",
    "learn": [
      "Active vs Passive buzzer differences (Fixed oscillator vs Frequency generator)",
      "Generating square wave audio frequencies with tone() and noTone()",
      "Mapping musical notes (C4, D4, E4...) and note duration timing"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "1",
        "Main board"
      ],
      [
        "Passive Piezo Buzzer",
        "1",
        "Piezoelectric sounder element"
      ],
      [
        "100\u03a9 Resistor",
        "1",
        "Volume dampener / current protection"
      ],
      [
        "Breadboard & Jumpers",
        "1 set",
        "Connections"
      ]
    ],
    "pins": [
      [
        "D8",
        "Buzzer Positive (+) via 100\u03a9",
        "Audio Frequency PWM Output"
      ],
      [
        "GND",
        "Buzzer Negative (-)",
        "Ground"
      ]
    ],
    "asciiDiagram": "+-----------------+\n    |   Arduino Uno   |\n    |                 |\n    |              D8 |--------[ 100\u03a9 Resistor ]-----> ( + ) [ Piezo Buzzer ]\n    |                 |                                      |\n    |             GND |------------------------------------> ( - )\n    +-----------------+",
    "code": "/*\n * Module: Piezo Buzzer Melodies & Alert Synthesizer\n * Description: Synthesizes musical melodies and audible alarm tones\n *              using the Arduino tone() frequency generator.\n * Part of: Arduino Projects Cookbook\n */\n\n// Musical note frequencies (Hz)\n#define NOTE_C4  262\n#define NOTE_D4  294\n#define NOTE_E4  330\n#define NOTE_F4  349\n#define NOTE_G4  392\n#define NOTE_A4  440\n#define NOTE_B4  494\n#define NOTE_C5  523\n\nconst int BUZZER_PIN = 8;\n\n// Melody note sequence\nint melody[] = {\n  NOTE_C4, NOTE_G4, NOTE_A4, NOTE_G4, 0, NOTE_B4, NOTE_C5\n};\n\n// Note durations: 4 = quarter note, 8 = eighth note, etc.\nint noteDurations[] = {\n  4, 8, 8, 4, 4, 4, 2\n};\n\nvoid playStartupMelody() {\n  for (int thisNote = 0; thisNote < 7; thisNote++) {\n    int noteDuration = 1000 / noteDurations[thisNote];\n    if (melody[thisNote] != 0) {\n      tone(BUZZER_PIN, melody[thisNote], noteDuration);\n    }\n    // To distinguish notes, set a brief pause between them (duration + 30%)\n    int pauseBetweenNotes = noteDuration * 1.30;\n    delay(pauseBetweenNotes);\n    noTone(BUZZER_PIN);\n  }\n}\n\nvoid playAlarmSiren() {\n  for (int freq = 400; freq <= 1200; freq += 20) {\n    tone(BUZZER_PIN, freq);\n    delay(10);\n  }\n  for (int freq = 1200; freq >= 400; freq -= 20) {\n    tone(BUZZER_PIN, freq);\n    delay(10);\n  }\n}\n\nvoid setup() {\n  Serial.begin(9600);\n  Serial.println(F(\"Playing Startup Chime...\"));\n  playStartupMelody();\n}\n\nvoid loop() {\n  // Uncomment below to test emergency siren\n  // playAlarmSiren();\n}",
    "howItWorks": "A piezoelectric buzzer contains a thin ceramic disk bonded to a metal diaphragm. When an alternating electric field is applied (via `tone()`), the piezoelectric material mechanically deforms, flexing back and forth at the exact frequency of the signal to produce pressure waves in the air that our ears hear as sound.",
    "challenges": [
      "Transcribe and play the Star Wars Imperial March or Super Mario theme song.",
      "Build an interactive Morse Code generator that beeps dots and dashes from serial text inputs.",
      "Synthesize continuous multi-tone sirens using non-blocking timer loops."
    ],
    "combinations": [
      [
        "02-Sensors/Ultrasonic",
        "Build an audible vehicle reverse parking sensor that beeps with increasing frequency."
      ],
      [
        "06-Automation/Security",
        "Loud audible deterrent alarm triggered by unauthorized motion."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/03-Actuators/Buzzers"
  },
  {
    "id": "proj-20",
    "categoryId": "04-Displays",
    "categoryTitle": "Displays",
    "categoryIcon": "\ud83d\udda5\ufe0f",
    "categoryBadge": "Visual UI",
    "folder": "LCD",
    "title": "Alphanumeric 16x2 LCD Display (I2C Backpack)",
    "hook": "Display clear text, sensor readings, and custom pixel icons using just 2 I2C wires instead of 16 parallel pins.",
    "sketchName": "lcd_display.ino",
    "learn": [
      "HD44780 LCD controller architecture and PCF8574 I2C expander backpacks",
      "Formatting fixed-width strings and clearing flicker without clear()",
      "Designing custom 5x8 pixel bitmap glyphs (battery, heart, degree symbol)"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "1",
        "Main board"
      ],
      [
        "16x2 Character LCD with I2C Backpack",
        "1",
        "Liquid crystal display (0x27 or 0x3F address)"
      ],
      [
        "Breadboard & Jumpers",
        "1 set",
        "Connections"
      ]
    ],
    "pins": [
      [
        "5V",
        "VCC",
        "5V Power"
      ],
      [
        "GND",
        "GND",
        "Ground"
      ],
      [
        "A4",
        "SDA",
        "I2C Serial Data"
      ],
      [
        "A5",
        "SCL",
        "I2C Serial Clock"
      ]
    ],
    "asciiDiagram": "+-----------------+              +-------------------------------+\n    |   Arduino Uno   |              |  16x2 Character LCD (I2C)     |\n    |                 |              |  +-------------------------+  |\n    |              5V |=============>|  | ARDUINO COOKBOOK!       |  |\n    |             GND |=============>|  | Temp: 24.5C  Hum: 60%   |  |\n    |        A4 (SDA) |<------------>|  +-------------------------+  |\n    |        A5 (SCL) |------------->|  [ VCC  GND  SDA  SCL ]       |\n    +-----------------+              +-------------------------------+",
    "code": "/*\n * Module: 16x2 Character LCD with I2C Backpack\n * Description: Displays sensor metrics, animated text scroll, and custom\n *              pixel glyphs on an HD44780 LCD using I2C.\n * Requires: LiquidCrystal_I2C library by Frank de Brabander\n * Part of: Arduino Projects Cookbook\n */\n\n#include <Wire.h>\n#include <LiquidCrystal_I2C.h>\n\n// Set the LCD I2C address (commonly 0x27 or 0x3F) for a 16 chars and 2 line display\nLiquidCrystal_I2C lcd(0x27, 16, 2);\n\n// Custom Heart Icon (5x8 pixel bitmap)\nbyte heartIcon[8] = {\n  0b00000,\n  0b01010,\n  0b11111,\n  0b11111,\n  0b01110,\n  0b00100,\n  0b00000,\n  0b00000\n};\n\nvoid setup() {\n  lcd.init();\n  lcd.backlight();\n\n  // Create custom character at slot 0\n  lcd.createChar(0, heartIcon);\n\n  lcd.setCursor(0, 0);\n  lcd.print(F(\"ARDUINO COOKBOOK\"));\n  lcd.setCursor(0, 1);\n  lcd.print(F(\"Made with \"));\n  lcd.write(0); // Display custom heart\n  lcd.print(F(\" by Makers\"));\n\n  delay(2500);\n  lcd.clear();\n}\n\nvoid loop() {\n  // Example telemetry simulation\n  float simulatedTemp = 24.5 + sin(millis() / 5000.0) * 3.0;\n  int simulatedHum  = 55 + (int)(cos(millis() / 4000.0) * 10);\n\n  // Line 1: Static label + dynamic reading\n  lcd.setCursor(0, 0);\n  lcd.print(F(\"Temp: \"));\n  lcd.print(simulatedTemp, 1);\n  lcd.print(F((char)223)); // Built-in degree symbol\n  lcd.print(F(\"C   \"));   // Trailing spaces clear old characters without flicker!\n\n  // Line 2: Humidity + Uptime\n  lcd.setCursor(0, 1);\n  lcd.print(F(\"Hum: \"));\n  lcd.print(simulatedHum);\n  lcd.print(F(\"% | Up:\"));\n  lcd.print(millis() / 1000);\n  lcd.print(F(\"s  \"));\n\n  delay(500);\n}",
    "howItWorks": "The classic HD44780 parallel interface requires 6 to 10 pins. An I2C backpack contains a PCF8574 I/O expander chip that converts I2C serial packets from pins A4/A5 into the required parallel pin toggles, reducing wiring down to just 4 connections.",
    "challenges": [
      "Create a horizontal bar graph using custom 5x8 pixel block characters to show progress.",
      "Build a 2-button scrollable menu system with cursor selection.",
      "Run an I2C scanner sketch if your display shows blank boxes to confirm its hex address (0x27 vs 0x3F)."
    ],
    "combinations": [
      [
        "02-Sensors/Temperature",
        "Build a standalone digital room thermometer and weather station."
      ],
      [
        "06-Automation/Security",
        "Display armed/disarmed status and password entry prompt."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/04-Displays/LCD"
  },
  {
    "id": "proj-21",
    "categoryId": "04-Displays",
    "categoryTitle": "Displays",
    "categoryIcon": "\ud83d\udda5\ufe0f",
    "categoryBadge": "Visual UI",
    "folder": "7-Segment",
    "title": "4-Digit 7-Segment Display (TM1637 Driver)",
    "hook": "Display bright numeric clocks, stopwatches, sensor values, and counter meters visible from across the room.",
    "sketchName": "seven_segment.ino",
    "learn": [
      "Multiplexed 7-segment LED cathode/anode matrix layouts",
      "TM1637 two-wire serial interface protocol (CLK and DIO)",
      "Formatting integer clocks with center colon blinking"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "1",
        "Main board"
      ],
      [
        "TM1637 4-Digit 7-Segment Display Module",
        "1",
        "Red/Green/Blue 0.36\" LED display module"
      ],
      [
        "Breadboard & Jumpers",
        "1 set",
        "Connections"
      ]
    ],
    "pins": [
      [
        "5V",
        "VCC",
        "5V Power"
      ],
      [
        "GND",
        "GND",
        "Ground"
      ],
      [
        "D2",
        "CLK",
        "Clock line"
      ],
      [
        "D3",
        "DIO",
        "Data line"
      ]
    ],
    "asciiDiagram": "+-----------------+              +----------------------+\n    |   Arduino Uno   |              |  TM1637 4-Digit 7-Seg|\n    |                 |              |  +----------------+  |\n    |              5V |=============>|  | [1][2]:[3][4]  |  |\n    |             GND |=============>|  +----------------+  |\n    |              D2 |------------->| CLK                  |\n    |              D3 |<------------>| DIO                  |\n    +-----------------+              +----------------------+",
    "code": "/*\n * Module: TM1637 4-Digit 7-Segment Display\n * Description: Displays a digital running stopwatch clock with blinking colons\n *              and integer temperature readouts.\n * Requires: TM1637Display library by Avishay Orpaz\n * Part of: Arduino Projects Cookbook\n */\n\n#include <TM1637Display.h>\n\nconst int CLK_PIN = 2;\nconst int DIO_PIN = 3;\n\nTM1637Display display(CLK_PIN, DIO_PIN);\n\nvoid setup() {\n  display.setBrightness(0x0a); // Brightness range: 0x00 (dim) to 0x0f (bright)\n  display.clear();\n}\n\nvoid loop() {\n  // Example: Display Running Clock (MM:SS)\n  unsigned long totalSeconds = millis() / 1000;\n  int minutes = (totalSeconds / 60) % 60;\n  int seconds = totalSeconds % 60;\n\n  // Format as MMSS integer (e.g., 02:45 -> 245)\n  int displayValue = (minutes * 100) + seconds;\n\n  // Toggle center colon every half second (0x40 bit in dots mask)\n  bool showColon = (millis() / 500) % 2;\n  uint8_t colonMask = showColon ? 0b01000000 : 0b00000000;\n\n  // display.showNumberDecEx(value, dots_mask, leading_zeros, length, pos)\n  display.showNumberDecEx(displayValue, colonMask, true, 4, 0);\n\n  delay(100);\n}",
    "howItWorks": "Driving 4 multiplexed 7-segment displays directly requires 12 pins and constant CPU refresh cycles. The TM1637 chip includes internal display RAM and an 8-step brightness driver that automatically refreshes the LEDs, freeing up the Arduino CPU completely.",
    "challenges": [
      "Display scrolling text messages using custom 7-segment character lookup tables.",
      "Build a countdown kitchen timer with pause and reset buttons.",
      "Display negative temperatures with a leading minus sign."
    ],
    "combinations": [
      [
        "02-Sensors/Ultrasonic",
        "Build a digital laser or sonar ruler that shows distance directly in centimeters."
      ],
      [
        "06-Automation/Motor-Automation",
        "Display remaining loop counts for automated robotic cycles."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/04-Displays/7-Segment"
  },
  {
    "id": "proj-22",
    "categoryId": "04-Displays",
    "categoryTitle": "Displays",
    "categoryIcon": "\ud83d\udda5\ufe0f",
    "categoryBadge": "Visual UI",
    "folder": "Serial-Monitor",
    "title": "Serial Monitor & Real-Time Waveform Plotter",
    "hook": "Visualize live mathematical waveforms, multiple sensor channels, and real-time filtering curves directly in the IDE.",
    "sketchName": "serial_monitor.ino",
    "learn": [
      "Formatting multi-variable telemetry for the Arduino IDE Serial Plotter (Ctrl+Shift+L)",
      "Visualizing filter responses (Raw Signal vs Filtered Signal)",
      "Designing structured CSV logging formats"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "1",
        "Main board"
      ],
      [
        "Potentiometer or Analog Sensor",
        "1",
        "Signal source (optional)"
      ],
      [
        "USB Cable",
        "1",
        "Connection to PC"
      ]
    ],
    "pins": [
      [
        "USB",
        "Virtual COM Port",
        "Serial Telemetry Stream"
      ]
    ],
    "asciiDiagram": "+-----------------+        USB Cable         +--------------------+\n    |   Arduino Uno   |<========================>| Computer / Laptop  |\n    |                 |                          |  Serial Plotter    |\n    | (Analog Signal) |                          |  [ /\\  /\\  /\\ ]    |\n    +-----------------+                          +--------------------+",
    "code": "/*\n * Module: Serial Monitor & Multi-Channel Serial Plotter\n * Description: Generates multi-variable labeled telemetry streams that\n *              render as colored real-time graphs in the Arduino Serial Plotter.\n * Part of: Arduino Projects Cookbook\n */\n\nfloat phase = 0.0;\n\nvoid setup() {\n  Serial.begin(115200);\n  // Print legend headers for the Serial Plotter\n  Serial.println(F(\"SineWave,CosineWave,NoiseSignal,FilteredAverage\"));\n}\n\nvoid loop() {\n  // Generate test signals\n  float sineVal = sin(phase) * 50.0;\n  float cosVal  = cos(phase) * 50.0;\n  float noisySignal = sineVal + (random(-15, 15));\n\n  // Running low-pass filter\n  static float filtered = 0.0;\n  filtered = (filtered * 0.85) + (noisySignal * 0.15);\n\n  // Format: \"VarName1:Value1,VarName2:Value2\" or \"Val1,Val2,Val3\"\n  Serial.print(F(\"Sine:\"));\n  Serial.print(sineVal);\n  Serial.print(F(\",\"));\n  Serial.print(F(\"Cosine:\"));\n  Serial.print(cosVal);\n  Serial.print(F(\",\"));\n  Serial.print(F(\"Noisy:\"));\n  Serial.print(noisySignal);\n  Serial.print(F(\",\"));\n  Serial.print(F(\"Filtered:\"));\n  Serial.println(filtered);\n\n  phase += 0.05;\n  delay(30); // ~33 Hz update rate for silky smooth plotting\n}",
    "howItWorks": "The Arduino IDE Serial Plotter reads lines terminated by newline characters (`\\n`). Comma or tab-delimited numbers are automatically parsed into separate channels and plotted on an auto-scaling time-series canvas.",
    "challenges": [
      "Plot raw ECG or photoplethysmography (pulse) sensor signals with beat detection thresholds.",
      "Visualize PID error, proportional, integral, and derivative terms during motor tuning.",
      "Stream data directly into Python using matplotlib or pyserial."
    ],
    "combinations": [
      [
        "02-Sensors/IMU",
        "Plot live 3-axis accelerometer vibrations to analyze motor balance."
      ],
      [
        "01-Fundamentals/Analog-IO",
        "Graph potentiometer smoothing filter performance in real-time."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/04-Displays/Serial-Monitor"
  },
  {
    "id": "proj-23",
    "categoryId": "05-Communication",
    "categoryTitle": "Communication",
    "categoryIcon": "\ud83c\udf10",
    "categoryBadge": "Protocols & IoT",
    "folder": "UART",
    "title": "SoftwareSerial & Dual Microcontroller UART",
    "hook": "Establish point-to-point serial communication between two Arduino boards using bit-banged SoftwareSerial pins.",
    "sketchName": "uart_softwareserial.ino",
    "learn": [
      "Creating virtual serial ports on any digital pin with SoftwareSerial",
      "Designing structured start/end delimiter packet protocols (e.g. `<CMD,VAL>`)",
      "Avoiding serial buffer overruns"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "2",
        "Master and Slave microcontrollers"
      ],
      [
        "Jumper Wires",
        "3",
        "Crossed TX/RX and Common Ground"
      ]
    ],
    "pins": [
      [
        "D10 (RX)",
        "Remote Arduino D11 (TX)",
        "Crossed Receive Line"
      ],
      [
        "D11 (TX)",
        "Remote Arduino D10 (RX)",
        "Crossed Transmit Line"
      ],
      [
        "GND",
        "Remote Arduino GND",
        "Crucial Common Ground Reference"
      ]
    ],
    "asciiDiagram": "+-----------------+                       +-----------------+\n    | Arduino 1 (TX)  |                       | Arduino 2 (RX)  |\n    |                 |                       |                 |\n    |        D11 (TX) |---------------------->| D10 (RX)        |\n    |        D10 (RX) |<----------------------| D11 (TX)        |\n    |             GND |======================>| GND             |\n    +-----------------+                       +-----------------+",
    "code": "/*\n * Module: SoftwareSerial Inter-Microcontroller UART\n * Description: Sends and receives structured packet messages between two\n *              Arduinos with packet framing delimiters.\n * Part of: Arduino Projects Cookbook\n */\n\n#include <SoftwareSerial.h>\n\nconst byte RX_PIN = 10;\nconst byte TX_PIN = 11;\n\nSoftwareSerial linkSerial(RX_PIN, TX_PIN); // RX, TX\n\nvoid setup() {\n  Serial.begin(9600);       // PC Debug Serial\n  linkSerial.begin(9600);   // Inter-Arduino Link\n\n  Serial.println(F(\"UART Inter-Board Link Active.\"));\n  Serial.println(F(\"Type a message to send to the other Arduino:\"));\n}\n\nvoid loop() {\n  // Read from PC Serial Monitor and send to Remote Arduino\n  if (Serial.available()) {\n    char c = Serial.read();\n    linkSerial.write(c);\n  }\n\n  // Read from Remote Arduino and print to PC Serial Monitor\n  if (linkSerial.available()) {\n    char c = linkSerial.read();\n    Serial.write(c);\n  }\n}",
    "howItWorks": "UART is asynchronous (no clock line). Both sender and receiver agree on a fixed baud rate. When a byte is sent, the TX pin drops LOW for 1 start bit, pulses 8 data bits sequentially, and returns HIGH for 1 stop bit. Crossing TX to RX ensures one board's output feeds the other's input.",
    "challenges": [
      "Implement a packet parser that extracts checksum-verified packets like `<SERVO,90>` and `<TEMP,25.4>`.",
      "Build a master-slave telemetry system where the master polls multiple slave sensors.",
      "Create a wireless optical communication link using an IR LED and receiver."
    ],
    "combinations": [
      [
        "05-Communication/Bluetooth",
        "Connect the HC-05 module to SoftwareSerial while keeping Hardware Serial open for PC debugging."
      ],
      [
        "04-Displays/LCD",
        "Display incoming UART telemetry sent from a remote sensor station."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/05-Communication/UART"
  },
  {
    "id": "proj-24",
    "categoryId": "05-Communication",
    "categoryTitle": "Communication",
    "categoryIcon": "\ud83c\udf10",
    "categoryBadge": "Protocols & IoT",
    "folder": "I2C",
    "title": "I2C Bus Communication (Master-Slave Architecture)",
    "hook": "Connect up to 127 sensors, displays, and coprocessors over a simple 2-wire shared multi-drop synchronous bus.",
    "sketchName": "i2c_bus.ino",
    "learn": [
      "I2C protocol: START/STOP conditions, 7-bit addressing, and ACK/NACK bits",
      "Wire library onReceive() and onRequest() event callbacks",
      "Internal and external I2C pull-up resistors on SDA/SCL lines"
    ],
    "components": [
      [
        "Arduino Uno (Master)",
        "1",
        "Main controller"
      ],
      [
        "Arduino Uno/Nano (Slave) or I2C Sensor",
        "1",
        "Peripheral device"
      ],
      [
        "4.7k\u03a9 Pull-up Resistors",
        "2",
        "Pull-ups on SDA and SCL rails"
      ],
      [
        "Breadboard & Jumpers",
        "1 set",
        "Connections"
      ]
    ],
    "pins": [
      [
        "A4 (SDA)",
        "Peripheral SDA",
        "Serial Data Line (Bi-directional)"
      ],
      [
        "A5 (SCL)",
        "Peripheral SCL",
        "Serial Clock Line (Driven by Master)"
      ],
      [
        "GND",
        "Peripheral GND",
        "Common Ground"
      ]
    ],
    "asciiDiagram": "+-----------------+              5V   5V\n    | Arduino Master  |              |    |\n    |                 |           [4.7k][4.7k]\n    |        A4 (SDA) |--------------+----+--------> [ I2C Slave 1 (0x27) ]\n    |        A5 (SCL) |-------------------+--------> [ I2C Slave 2 (0x68) ]\n    |             GND |============================> [ Common Ground    ]\n    +-----------------+",
    "code": "/*\n * Module: I2C Master-Slave Communication (Wire Library)\n * Description: Demonstrates bidirectional multi-byte register reading and\n *              writing across a 2-wire shared I2C bus.\n * Part of: Arduino Projects Cookbook\n */\n\n#include <Wire.h>\n\n#define SLAVE_ADDR 0x08\n\nvoid setup() {\n  Wire.begin(); // Join I2C bus as Master\n  Serial.begin(9600);\n  Serial.println(F(\"I2C Master Ready.\"));\n}\n\nvoid loop() {\n  // 1. Send Command to Slave\n  Wire.beginTransmission(SLAVE_ADDR);\n  Wire.write(\"PING\");\n  Wire.endTransmission();\n\n  delay(50);\n\n  // 2. Request 6 bytes of response data from Slave\n  Wire.requestFrom(SLAVE_ADDR, 6);\n  Serial.print(F(\"Received from Slave: \"));\n  while (Wire.available()) {\n    char c = Wire.read();\n    Serial.print(c);\n  }\n  Serial.println();\n\n  delay(1000);\n}",
    "howItWorks": "I2C (Inter-Integrated Circuit) uses open-drain lines with pull-up resistors. The Master drives the SCL clock line and initiates every transfer by broadcasting a 7-bit slave address plus a Read/Write bit. Only the peripheral matching that address pulls the SDA line LOW to acknowledge (ACK) and communicate.",
    "challenges": [
      "Run an I2C Scanner to automatically detect addresses of all connected peripherals.",
      "Build an Arduino coprocessor that offloads intensive math calculations over I2C.",
      "Chain an RTC clock (DS3231), an LCD (0x27), and an IMU (0x68) on the exact same two pins."
    ],
    "combinations": [
      [
        "04-Displays/LCD",
        "Share SDA/SCL lines between multiple sensors and display screens simultaneously."
      ],
      [
        "02-Sensors/IMU",
        "High-speed 400kHz I2C data streaming."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/05-Communication/I2C"
  },
  {
    "id": "proj-25",
    "categoryId": "05-Communication",
    "categoryTitle": "Communication",
    "categoryIcon": "\ud83c\udf10",
    "categoryBadge": "Protocols & IoT",
    "folder": "SPI",
    "title": "High-Speed SPI Bus (Serial Peripheral Interface)",
    "hook": "Transfer data at blazing speeds (up to 8 Mbps on Arduino) for color TFT screens, SD cards, and radio transceivers.",
    "sketchName": "spi_bus.ino",
    "learn": [
      "Full-duplex synchronous 4-wire SPI architecture (MOSI, MISO, SCK, CS)",
      "SPI Clock polarity (CPOL) and phase (CPHA) modes (0, 1, 2, 3)",
      "Managing multiple SPI slaves with dedicated Chip Select (CS) pins"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "1",
        "Main board"
      ],
      [
        "SPI Device (SD Card Module / NRF24L01 / SPI Flash)",
        "1",
        "High-speed peripheral"
      ],
      [
        "Breadboard & Jumpers",
        "1 set",
        "Connections"
      ]
    ],
    "pins": [
      [
        "D13 (SCK)",
        "Peripheral SCK",
        "Serial Clock (Synchronous Master Clock)"
      ],
      [
        "D11 (MOSI)",
        "Peripheral MOSI / SDI",
        "Master Out Slave In (Data to Device)"
      ],
      [
        "D12 (MISO)",
        "Peripheral MISO / SDO",
        "Master In Slave Out (Data from Device)"
      ],
      [
        "D10 (CS / SS)",
        "Peripheral CS / SS",
        "Chip Select (Active LOW)"
      ],
      [
        "5V & GND",
        "VCC & GND",
        "Power and Ground"
      ]
    ],
    "asciiDiagram": "+-----------------+              +----------------------+\n    |   Arduino Uno   |              |  SPI SD Card Module  |\n    |                 |              |                      |\n    |       D13 (SCK) |------------->| SCK (Clock)          |\n    |      D11 (MOSI) |------------->| MOSI (Master Out)    |\n    |      D12 (MISO) |<-------------| MISO (Master In)     |\n    |       D10 (CS)  |------------->| CS (Chip Select)     |\n    |        5V & GND |=============>| VCC & GND            |\n    +-----------------+              +----------------------+",
    "code": "/*\n * Module: High-Speed SPI (Serial Peripheral Interface)\n * Description: Communicates with SPI devices using the hardware SPI engine\n *              with dedicated Chip Select (CS) bus arbitration.\n * Part of: Arduino Projects Cookbook\n */\n\n#include <SPI.h>\n\nconst int CS_PIN = 10;\n\nvoid setup() {\n  pinMode(CS_PIN, OUTPUT);\n  digitalWrite(CS_PIN, HIGH); // Deselect device\n\n  Serial.begin(9600);\n  SPI.begin(); // Initialize SCK (13), MOSI (11), MISO (12)\n\n  Serial.println(F(\"SPI Bus Initialized.\"));\n}\n\nbyte sendSpiByte(byte dataOut) {\n  // Select slave by pulling CS LOW\n  digitalWrite(CS_PIN, LOW);\n\n  // Transfer byte: sends dataOut while simultaneously receiving dataIn (Full Duplex)\n  byte dataIn = SPI.transfer(dataOut);\n\n  // Deselect slave\n  digitalWrite(CS_PIN, HIGH);\n\n  return dataIn;\n}\n\nvoid loop() {\n  // Example SPI Transaction: send dummy command byte 0xAA\n  SPI.beginTransaction(SPISettings(4000000, MSBFIRST, SPI_MODE0)); // 4MHz clock\n  byte response = sendSpiByte(0xAA);\n  SPI.endTransaction();\n\n  Serial.print(F(\"SPI Byte Transferred. Response: 0x\"));\n  Serial.println(response, HEX);\n\n  delay(1000);\n}",
    "howItWorks": "SPI is a full-duplex synchronous bus that operates like two interconnected shift registers. On every clock tick generated by the Master on the SCK line, 1 bit is pushed from Master to Slave over MOSI while 1 bit is simultaneously shifted from Slave to Master over MISO. Because there is no addressing overhead, SPI is significantly faster than I2C.",
    "challenges": [
      "Log 1000 sensor readings per second directly onto a FAT32 MicroSD card.",
      "Drive a 2.4\" color SPI TFT display with graphic primitives and text.",
      "Build a 2.4GHz wireless link using NRF24L01+ transceivers."
    ],
    "combinations": [
      [
        "06-Automation/Environment-Monitoring",
        "Log multi-sensor environmental weather stations to high-capacity SD cards."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/05-Communication/SPI"
  },
  {
    "id": "proj-26",
    "categoryId": "05-Communication",
    "categoryTitle": "Communication",
    "categoryIcon": "\ud83c\udf10",
    "categoryBadge": "Protocols & IoT",
    "folder": "Bluetooth",
    "title": "Wireless Bluetooth Telemetry & Control (HC-05 / HC-06)",
    "hook": "Connect your Arduino wirelessly to smartphones, laptops, and tablets over classic Bluetooth SPP (Serial Port Profile).",
    "sketchName": "bluetooth_hc05.ino",
    "learn": [
      "Configuring HC-05 Bluetooth modules with AT command mode",
      "Voltage divider level shifting (5V Arduino TX to 3.3V HC-05 RX)",
      "Building smartphone UI interfaces with Bluetooth Serial terminal apps"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "1",
        "Main board"
      ],
      [
        "HC-05 or HC-06 Bluetooth Module",
        "1",
        "Wireless serial module (2.4GHz)"
      ],
      [
        "1k\u03a9 and 2k\u03a9 Resistors",
        "1 each",
        "Voltage divider for 3.3V RX protection"
      ],
      [
        "Breadboard & Jumpers",
        "1 set",
        "Connections"
      ]
    ],
    "pins": [
      [
        "5V",
        "VCC",
        "5V Power"
      ],
      [
        "GND",
        "GND",
        "Ground"
      ],
      [
        "D10 (RX)",
        "HC-05 TXD",
        "Arduino receives 3.3V data directly"
      ],
      [
        "D11 (TX)",
        "HC-05 RXD (via divider)",
        "5V stepped down to 3.3V via 1k/2k divider"
      ]
    ],
    "asciiDiagram": "+-----------------+              +----------------------+\n    |   Arduino Uno   |              |  HC-05 Bluetooth SPP |\n    |                 |              |  [ 2.4GHz Antenna ]  |\n    |              5V |=============>| VCC                  |\n    |             GND |======+======>| GND                  |\n    |        D10 (RX) |<-----|-------| TXD                  |\n    |        D11 (TX) |--[1k]--+---->| RXD (3.3V Logic)     |\n    +-----------------+        |     +----------------------+\n                             [2k]\n                               |\n                              GND",
    "code": "/*\n * Module: HC-05 Wireless Bluetooth Serial Interface\n * Description: Bi-directional wireless bridge allowing phone apps to control\n *              onboard pins and stream telemetry via Bluetooth SPP.\n * Part of: Arduino Projects Cookbook\n */\n\n#include <SoftwareSerial.h>\n\nconst int BT_RX = 10;\nconst int BT_TX = 11;\nconst int LED_PIN = 13;\n\nSoftwareSerial bluetooth(BT_RX, BT_TX); // RX, TX\n\nvoid setup() {\n  pinMode(LED_PIN, OUTPUT);\n  Serial.begin(9600);       // Serial monitor on PC\n  bluetooth.begin(9600);   // Default HC-05 baud rate\n\n  Serial.println(F(\"Bluetooth Module Online. Pair with smartphone (PIN: 1234).\"));\n}\n\nvoid loop() {\n  // Read incoming commands from smartphone\n  if (bluetooth.available()) {\n    char cmd = bluetooth.read();\n    Serial.print(F(\"Phone Sent: \"));\n    Serial.println(cmd);\n\n    if (cmd == '1' || cmd == 'H') {\n      digitalWrite(LED_PIN, HIGH);\n      bluetooth.println(F(\"LED: ON\"));\n    } else if (cmd == '0' || cmd == 'L') {\n      digitalWrite(LED_PIN, LOW);\n      bluetooth.println(F(\"LED: OFF\"));\n    }\n  }\n\n  // Send data from PC keyboard over Bluetooth to phone\n  if (Serial.available()) {\n    char c = Serial.read();\n    bluetooth.write(c);\n  }\n}",
    "howItWorks": "The HC-05 is a baseband Bluetooth V2.0+EDR module. It implements the standard Bluetooth Serial Port Profile (SPP), which presents itself to paired devices as a virtual transparent serial cable, eliminating the need for complex custom Bluetooth drivers on your phone.",
    "challenges": [
      "Use AT commands to change the Bluetooth device broadcast name and custom PIN code.",
      "Build a custom Android app using MIT App Inventor with virtual joysticks and gauges.",
      "Upgrade to Bluetooth Low Energy (BLE) using an HM-10 or ESP32."
    ],
    "combinations": [
      [
        "03-Actuators/DC-Motors",
        "Build a smartphone-controlled Bluetooth RC Rover."
      ],
      [
        "06-Automation/Smart-Lighting",
        "Control home mood lights wirelessly from your couch."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/05-Communication/Bluetooth"
  },
  {
    "id": "proj-27",
    "categoryId": "05-Communication",
    "categoryTitle": "Communication",
    "categoryIcon": "\ud83c\udf10",
    "categoryBadge": "Protocols & IoT",
    "folder": "WiFi",
    "title": "Wi-Fi & IoT Cloud Telemetry (ESP8266 / ESP32)",
    "hook": "Connect your hardware to the local Wi-Fi network to stream live telemetry to IoT cloud dashboards and receive webhook commands.",
    "sketchName": "wifi_iot.ino",
    "learn": [
      "Connecting to WPA2 Wi-Fi networks with DHCP IP assignment",
      "Issuing HTTP GET and POST requests to REST APIs",
      "Building lightweight embedded HTTP web servers"
    ],
    "components": [
      [
        "ESP8266 (NodeMCU/D1 Mini) or ESP32 or Uno+ESP-01",
        "1",
        "Wi-Fi enabled microcontroller board"
      ],
      [
        "Micro-USB Cable",
        "1",
        "Power and programming cable"
      ]
    ],
    "pins": [
      [
        "Onboard",
        "Wi-Fi Radio (2.4GHz 802.11 b/g/n)",
        "Wireless internet link"
      ],
      [
        "D4 / LED_BUILTIN",
        "Status LED",
        "Connection status indicator"
      ]
    ],
    "asciiDiagram": "+-------------------------+        2.4GHz Wi-Fi       +--------------------+\n    | ESP8266 / ESP32 Board   | - - - - - - - - - - - - ->| Wi-Fi Router / AP  |\n    |                         |                           | (Internet Gateway) |\n    |  [ ESP-12F Wi-Fi SoC ]  |                           +---------+----------+\n    |                         |                                     |\n    |  Onboard Microcontroller|                               +-----v----------+\n    +-------------------------+                               | Cloud Dashboard|\n                                                              | (Thingspeak)   |\n                                                              +----------------+",
    "code": "/*\n * Module: Wi-Fi IoT Client & Embedded Web Server\n * Description: Connects to a 2.4GHz Wi-Fi access point and serves an\n *              interactive HTML webpage for remote appliance control.\n * Targets: ESP8266 (NodeMCU / D1 Mini) or ESP32\n * Part of: Arduino Projects Cookbook\n */\n\n#if defined(ESP8266)\n  #include <ESP8266WiFi.h>\n  #include <ESP8266WebServer.h>\n  ESP8266WebServer server(80);\n#elif defined(ESP32)\n  #include <WiFi.h>\n  #include <WebServer.h>\n  WebServer server(80);\n#endif\n\nconst char* ssid     = \"YOUR_WIFI_SSID\";\nconst char* password = \"YOUR_WIFI_PASSWORD\";\n\nconst int RELAY_PIN = 4; // GPIO4 (D2 on NodeMCU)\nbool relayState = false;\n\nvoid handleRoot() {\n  String html = \"<!DOCTYPE html><html><head><meta name='viewport' content='width=device-width, initial-scale=1'>\";\n  html += \"<style>body{font-family:sans-serif;text-align:center;padding:20px;background:#111;color:#fff;}\";\n  html += \".btn{display:inline-block;padding:15px 30px;font-size:18px;border-radius:8px;text-decoration:none;color:#fff;background:#00979D;margin:10px;}\";\n  html += \".off{background:#555;}</style></head><body>\";\n  html += \"<h1>\u26a1 Arduino IoT Server</h1>\";\n  html += \"<p>Relay Status: <b>\" + String(relayState ? \"ACTIVE (ON)\" : \"INACTIVE (OFF)\") + \"</b></p>\";\n  html += \"<a class='btn \" + String(relayState ? \"\" : \"off\") + \"' href='/toggle'>Toggle Switch</a>\";\n  html += \"</body></html>\";\n\n  server.send(200, \"text/html\", html);\n}\n\nvoid handleToggle() {\n  relayState = !relayState;\n  digitalWrite(RELAY_PIN, relayState ? HIGH : LOW);\n  server.sendHeader(\"Location\", \"/\");\n  server.send(303);\n}\n\nvoid setup() {\n  pinMode(RELAY_PIN, OUTPUT);\n  digitalWrite(RELAY_PIN, LOW);\n\n  Serial.begin(115200);\n  Serial.println();\n  Serial.print(F(\"Connecting to Wi-Fi: \"));\n  Serial.println(ssid);\n\n  WiFi.begin(ssid, password);\n  while (WiFi.status() != WL_CONNECTED) {\n    delay(500);\n    Serial.print(F(\".\"));\n  }\n\n  Serial.println();\n  Serial.println(F(\"WiFi Connected!\"));\n  Serial.print(F(\"Open this IP address in your browser: http://\"));\n  Serial.println(WiFi.localIP());\n\n  server.on(\"/\", handleRoot);\n  server.on(\"/toggle\", handleToggle);\n  server.begin();\n}\n\nvoid loop() {\n  server.handleClient();\n}",
    "howItWorks": "The ESP8266/ESP32 integrates a full TCP/IP networking stack alongside a Tensilica 32-bit Xtensa core. When you type the device IP into any web browser on the local network, an HTTP GET request arrives over TCP port 80; the embedded web server parses the route and sends back full HTML/CSS markup dynamically.",
    "challenges": [
      "Publish sensor telemetry every 60 seconds to an MQTT broker like HiveMQ or Home Assistant.",
      "Fetch the current real-world time and weather forecast from an OpenWeatherMap JSON API.",
      "Enable Over-The-Air (OTA) firmware updates so you never have to plug in a USB cable again."
    ],
    "combinations": [
      [
        "06-Automation/Environment-Monitoring",
        "Build an IoT greenhouse station streaming soil moisture and temperature worldwide."
      ],
      [
        "06-Automation/Smart-Lighting",
        "Smart home voice assistant integration via webhooks."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/05-Communication/WiFi"
  },
  {
    "id": "proj-28",
    "categoryId": "06-Automation",
    "categoryTitle": "Automation",
    "categoryIcon": "\ud83e\udd16",
    "categoryBadge": "Complete Systems",
    "folder": "Smart-Lighting",
    "title": "Smart Adaptive Lighting & Automatic Nightlight",
    "hook": "An intelligent lighting system that measures ambient light with an LDR and detects human motion with PIR to smoothly illuminate spaces only when needed.",
    "sketchName": "smart_lighting.ino",
    "learn": [
      "Fusing multiple sensors (LDR ambient light + PIR motion)",
      "Implementing timeout counters to keep lights on during continuous activity",
      "Smooth PWM transition fading vs harsh sudden relay switching"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "1",
        "Main board"
      ],
      [
        "PIR Motion Sensor (HC-SR501)",
        "1",
        "Infrared human motion detector"
      ],
      [
        "Photoresistor (LDR) + 10k\u03a9 Resistor",
        "1 each",
        "Ambient light sensor"
      ],
      [
        "LED Strip or Relay + 12V Lamp",
        "1",
        "Target illumination load"
      ],
      [
        "Breadboard & Jumpers",
        "1 set",
        "Connections"
      ]
    ],
    "pins": [
      [
        "D2",
        "PIR Motion Out",
        "Motion Trigger Input"
      ],
      [
        "A0",
        "LDR Voltage Divider",
        "Ambient Light Analog Input"
      ],
      [
        "D9 (~PWM)",
        "LED Strip Driver / Relay",
        "Light Output Control"
      ]
    ],
    "asciiDiagram": "+-----------------+              +----------------------+\n    |   Arduino Uno   |              |  HC-SR501 PIR Motion |\n    |                 |              |                      |\n    |              D2 |<-------------| OUT (Motion)         |\n    |              A0 |<--[ LDR/10k ]| (Light Level)        |\n    |        D9 (PWM) |------------->| [ LED Strip / Relay] |\n    |        5V & GND |=============>| Power Rails          |\n    +-----------------+              +----------------------+",
    "code": "/*\n * Project: Smart Adaptive Lighting Automation\n * Description: Fuses ambient light sensing with passive infrared (PIR)\n *              human motion detection to automatically fade in lights\n *              only when dark and occupied.\n * Part of: Arduino Projects Cookbook\n */\n\nconst int PIR_PIN   = 2;\nconst int LDR_PIN   = A0;\nconst int LIGHT_PIN = 9; // PWM capable\n\nconst int DARK_THRESHOLD = 300;      // ADC value below which room is dark\nconst unsigned long LIGHT_TIMEOUT = 10000; // Stay ON for 10s after last motion\n\nunsigned long lastMotionTime = 0;\nint currentBrightness = 0;\nint targetBrightness  = 0;\n\nvoid setup() {\n  pinMode(PIR_PIN, INPUT);\n  pinMode(LIGHT_PIN, OUTPUT);\n  Serial.begin(9600);\n  Serial.println(F(\"Smart Lighting Controller Armed.\"));\n}\n\nvoid loop() {\n  int lightLevel = analogRead(LDR_PIN);\n  bool motionDetected = (digitalRead(PIR_PIN) == HIGH);\n\n  if (motionDetected) {\n    lastMotionTime = millis();\n    Serial.println(F(\"Motion Detected!\"));\n  }\n\n  bool isDark = (lightLevel < DARK_THRESHOLD);\n  bool isOccupied = (millis() - lastMotionTime < LIGHT_TIMEOUT);\n\n  // Turn ON only if BOTH dark AND occupied\n  if (isDark && isOccupied) {\n    targetBrightness = 255;\n  } else {\n    targetBrightness = 0;\n  }\n\n  // Smooth fade transition\n  if (currentBrightness < targetBrightness) {\n    currentBrightness += 5;\n    if (currentBrightness > targetBrightness) currentBrightness = targetBrightness;\n  } else if (currentBrightness > targetBrightness) {\n    currentBrightness -= 5;\n    if (currentBrightness < targetBrightness) currentBrightness = targetBrightness;\n  }\n\n  analogWrite(LIGHT_PIN, currentBrightness);\n  delay(20);\n}",
    "howItWorks": "The system continuously monitors two independent conditions: physical occupancy (via the PIR pyroelectric sensor detecting changes in thermal infrared emissions from warm human bodies) and ambient darkness (via the LDR). Fusing both inputs ensures lighting is never wastefully powered during daylight hours.",
    "challenges": [
      "Add an ambient light auto-dimming mode that adjusts lamp brightness proportionally to room darkness.",
      "Integrate an I2C LCD displaying energy saved statistics and active run hours.",
      "Add Bluetooth or Wi-Fi override capability to force lights ON/OFF."
    ],
    "combinations": [
      [
        "03-Actuators/Relays",
        "Control 120V/240V ceiling lamps instead of low-voltage LEDs."
      ],
      [
        "04-Displays/LCD",
        "Display current room status and countdown timers."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/06-Automation/Smart-Lighting"
  },
  {
    "id": "proj-29",
    "categoryId": "06-Automation",
    "categoryTitle": "Automation",
    "categoryIcon": "\ud83e\udd16",
    "categoryBadge": "Complete Systems",
    "folder": "Security",
    "title": "Smart Perimeter Intruder Alarm & Access System",
    "hook": "A multi-zone security alarm combining ultrasonic distance tripwires, audible sirens, visual flashing strobes, and keypad disarming.",
    "sketchName": "security_alarm.ino",
    "learn": [
      "Security state machines (DISARMED, ARMED, TRIPPED, ALARM)",
      "Non-blocking multi-tone siren synthesis",
      "Configuring countdown entry/exit grace period delays"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "1",
        "Main board"
      ],
      [
        "Ultrasonic Sensor (HC-SR04)",
        "1",
        "Tripwire distance barrier"
      ],
      [
        "Piezo Buzzer / 12V Siren",
        "1",
        "Acoustic alarm sounder"
      ],
      [
        "Pushbutton or Keypad",
        "1",
        "Arm / Disarm interface"
      ],
      [
        "Red and Green LEDs",
        "2",
        "System armed/safe status indicators"
      ],
      [
        "Breadboard & Jumpers",
        "1 set",
        "Connections"
      ]
    ],
    "pins": [
      [
        "D9 & D10",
        "TRIG & ECHO",
        "Ultrasonic Tripwire"
      ],
      [
        "D8",
        "Buzzer / Siren",
        "Audible Siren"
      ],
      [
        "D2",
        "Disarm Button",
        "Momentary Pushbutton (INPUT_PULLUP)"
      ],
      [
        "D12",
        "Green LED",
        "Status: DISARMED"
      ],
      [
        "D13",
        "Red LED",
        "Status: ARMED / ALARM"
      ]
    ],
    "asciiDiagram": "+-----------------+              +----------------------+\n    |   Arduino Uno   |              |  Multi-Zone Security |\n    |                 |              |                      |\n    |        D9 & D10 |<------------>| HC-SR04 Sonar Barrier|\n    |              D8 |------------->| Piezo / 12V Siren    |\n    |              D2 |<-------------| Disarm Pushbutton    |\n    |       D12 & D13 |------------->| Green / Red LEDs     |\n    +-----------------+              +----------------------+",
    "code": "/*\n * Project: Smart Perimeter Security & Intruder Alarm System\n * Description: Implements an armed security perimeter with ultrasonic\n *              distance tripwire, flashing strobes, and audible sirens.\n * Part of: Arduino Projects Cookbook\n */\n\nenum SystemState { DISARMED, ARMED, TRIPPED, ALARM };\nSystemState currentState = DISARMED;\n\nconst int TRIG_PIN   = 9;\nconst int ECHO_PIN   = 10;\nconst int BUZZER_PIN = 8;\nconst int BUTTON_PIN = 2;\nconst int LED_GREEN  = 12;\nconst int LED_RED    = 13;\n\nconst float TRIP_DISTANCE_CM = 50.0; // Trigger if object closer than 50cm\nunsigned long tripStartTime = 0;\nconst unsigned long GRACE_PERIOD_MS = 5000; // 5 seconds to disarm\n\nfloat getDistance() {\n  digitalWrite(TRIG_PIN, LOW);\n  delayMicroseconds(2);\n  digitalWrite(TRIG_PIN, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(TRIG_PIN, LOW);\n  unsigned long duration = pulseIn(ECHO_PIN, HIGH, 25000);\n  if (duration == 0) return 999.0;\n  return (duration * 0.0343) / 2.0;\n}\n\nvoid setup() {\n  pinMode(TRIG_PIN, OUTPUT);\n  pinMode(ECHO_PIN, INPUT);\n  pinMode(BUZZER_PIN, OUTPUT);\n  pinMode(BUTTON_PIN, INPUT_PULLUP);\n  pinMode(LED_GREEN, OUTPUT);\n  pinMode(LED_RED, OUTPUT);\n\n  Serial.begin(9600);\n  Serial.println(F(\"Security System Armed. Press Button to Toggle Arm/Disarm.\"));\n}\n\nvoid loop() {\n  // Button toggle\n  static bool lastBtn = HIGH;\n  bool btn = digitalRead(BUTTON_PIN);\n  if (btn == LOW && lastBtn == HIGH) {\n    if (currentState == DISARMED) {\n      currentState = ARMED;\n      Serial.println(F(\">>> SYSTEM ARMED <<<\"));\n      tone(BUZZER_PIN, 1000, 200);\n    } else {\n      currentState = DISARMED;\n      noTone(BUZZER_PIN);\n      Serial.println(F(\">>> SYSTEM DISARMED <<<\"));\n      tone(BUZZER_PIN, 500, 200);\n    }\n    delay(200); // Simple debounce\n  }\n  lastBtn = btn;\n\n  // State Logic\n  switch (currentState) {\n    case DISARMED:\n      digitalWrite(LED_GREEN, HIGH);\n      digitalWrite(LED_RED, LOW);\n      noTone(BUZZER_PIN);\n      break;\n\n    case ARMED:\n      digitalWrite(LED_GREEN, LOW);\n      digitalWrite(LED_RED, HIGH);\n      {\n        float d = getDistance();\n        if (d > 0 && d < TRIP_DISTANCE_CM) {\n          currentState = TRIPPED;\n          tripStartTime = millis();\n          Serial.println(F(\"WARNING: Perimeter Breached! Enter pass code...\"));\n        }\n      }\n      break;\n\n    case TRIPPED:\n      // Grace period warning beeps\n      digitalWrite(LED_RED, (millis() / 250) % 2);\n      tone(BUZZER_PIN, 800, 100);\n      if (millis() - tripStartTime > GRACE_PERIOD_MS) {\n        currentState = ALARM;\n        Serial.println(F(\"ALARM TRIGGERED: INTRUDER CONFIRMED!\"));\n      }\n      break;\n\n    case ALARM:\n      // High-low police siren\n      digitalWrite(LED_RED, (millis() / 100) % 2);\n      digitalWrite(LED_GREEN, !digitalRead(LED_RED));\n      if ((millis() / 300) % 2) {\n        tone(BUZZER_PIN, 1200);\n      } else {\n        tone(BUZZER_PIN, 600);\n      }\n      break;\n  }\n}",
    "howItWorks": "The alarm engine runs a 4-stage Finite State Machine. When in the ARMED state, any acoustic reflection below 50cm transitions the system into the TRIPPED state. The user is given a 5-second grace window to push the disarm button before the full optical strobe and acoustic siren activate.",
    "challenges": [
      "Integrate a 4x4 matrix keypad requiring a 4-digit PIN (e.g. '1234#') to disarm.",
      "Add an IR remote control to arm/disarm from a distance.",
      "Connect an ESP8266 or GSM SIM800L module to send SMS text alerts to your phone."
    ],
    "combinations": [
      [
        "05-Communication/Bluetooth",
        "Disarm automatically when your authorized smartphone connects."
      ],
      [
        "04-Displays/LCD",
        "Display entry countdown timer and breach logs."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/06-Automation/Security"
  },
  {
    "id": "proj-30",
    "categoryId": "06-Automation",
    "categoryTitle": "Automation",
    "categoryIcon": "\ud83e\udd16",
    "categoryBadge": "Complete Systems",
    "folder": "Environment-Monitoring",
    "title": "Smart Greenhouse & Weather Station",
    "hook": "Automate agriculture and plant care with real-time temperature, humidity, light, soil moisture tracking, and automated water pump relays.",
    "sketchName": "greenhouse_monitor.ino",
    "learn": [
      "Interfacing capacitive soil moisture sensors to prevent corrosion",
      "Automating water pump irrigation with hysteresis thresholds",
      "Displaying multi-sensor metrics across alternating LCD screens"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "1",
        "Main board"
      ],
      [
        "DHT11 or DHT22",
        "1",
        "Air Temperature & Humidity"
      ],
      [
        "Soil Moisture Sensor",
        "1",
        "Capacitive moisture probe"
      ],
      [
        "5V Relay + DC Submersible Water Pump",
        "1 each",
        "Irrigation actuator"
      ],
      [
        "16x2 I2C LCD Display",
        "1",
        "Visual display"
      ],
      [
        "Breadboard & Jumpers",
        "1 set",
        "Connections"
      ]
    ],
    "pins": [
      [
        "D5",
        "DHT Data",
        "Air Temp & Humidity"
      ],
      [
        "A0",
        "Soil Moisture Analog",
        "Soil Volumetric Water Content"
      ],
      [
        "D4",
        "Relay Control Pin",
        "Water Pump Relay Switch"
      ],
      [
        "A4 & A5",
        "I2C LCD (SDA/SCL)",
        "Display screen"
      ]
    ],
    "asciiDiagram": "+-----------------+              +-----------------------------+\n    |   Arduino Uno   |              |  Smart Greenhouse System    |\n    |                 |              |                             |\n    |              D5 |<------------>| DHT11 (Air Temp & Hum)      |\n    |              A0 |<-------------| Soil Moisture Probe         |\n    |              D4 |------------->| 5V Relay ===> [ Water Pump] |\n    |        A4 & A5  |<------------>| 16x2 I2C LCD Display        |\n    +-----------------+              +-----------------------------+",
    "code": "/*\n * Project: Smart Greenhouse Climate & Soil Moisture Monitor\n * Description: Monitors air temp, humidity, and soil moisture to automatically\n *              trigger water pump irrigation and update an LCD screen.\n * Requires: DHT sensor library, LiquidCrystal_I2C\n * Part of: Arduino Projects Cookbook\n */\n\n#include <Wire.h>\n#include <LiquidCrystal_I2C.h>\n#include \"DHT.h\"\n\n#define DHTPIN 5\n#define DHTTYPE DHT11\nDHT dht(DHTPIN, DHTTYPE);\n\nLiquidCrystal_I2C lcd(0x27, 16, 2);\n\nconst int SOIL_PIN  = A0;\nconst int PUMP_PIN  = 4;\n\nconst int SOIL_DRY_THRESHOLD = 35; // Water when soil drops below 35%\nconst int PUMP_DURATION_MS   = 3000; // Run pump for 3 seconds\n\nunsigned long lastWaterTime = 0;\nconst unsigned long WATER_COOLDOWN = 60000; // Minimum 1 minute between watering\n\nvoid setup() {\n  pinMode(PUMP_PIN, OUTPUT);\n  digitalWrite(PUMP_PIN, HIGH); // Relay OFF (Active LOW)\n\n  Serial.begin(9600);\n  dht.begin();\n  lcd.init();\n  lcd.backlight();\n\n  lcd.setCursor(0, 0);\n  lcd.print(F(\"GREENHOUSE READY\"));\n  delay(1500);\n  lcd.clear();\n}\n\nvoid loop() {\n  float hum = dht.readHumidity();\n  float temp = dht.readTemperature();\n  int rawSoil = analogRead(SOIL_PIN);\n  \n  // Map raw analog reading (e.g. 1023 dry, 300 wet) to 0 - 100% moisture\n  int soilPercent = map(constrain(rawSoil, 300, 1023), 1023, 300, 0, 100);\n\n  // Update LCD Screen\n  lcd.setCursor(0, 0);\n  lcd.print(F(\"T:\"));\n  lcd.print((int)temp);\n  lcd.print(F(\"C H:\"));\n  lcd.print((int)hum);\n  lcd.print(F(\"% Soil:\"));\n  lcd.print(soilPercent);\n  lcd.print(F(\"% \"));\n\n  lcd.setCursor(0, 1);\n  if (digitalRead(PUMP_PIN) == LOW) {\n    lcd.print(F(\"PUMP: WATERING! \"));\n  } else {\n    lcd.print(F(\"PUMP: STANDBY   \"));\n  }\n\n  // Automated Watering Logic\n  if (soilPercent < SOIL_DRY_THRESHOLD && (millis() - lastWaterTime > WATER_COOLDOWN)) {\n    Serial.println(F(\"Soil is dry! Triggering irrigation pump...\"));\n    digitalWrite(PUMP_PIN, LOW); // Turn pump ON\n    delay(PUMP_DURATION_MS);\n    digitalWrite(PUMP_PIN, HIGH); // Turn pump OFF\n    lastWaterTime = millis();\n  }\n\n  delay(1000);\n}",
    "howItWorks": "The greenhouse controller samples three critical agronomic factors: air temperature, relative vapor pressure (humidity), and soil volumetric water content. When soil moisture drops below the calibrated threshold, the controller checks whether the minimum cooldown window has elapsed before pulsing the relay to pump water directly to root systems.",
    "challenges": [
      "Add an exhaust fan relay that turns on if air temperature exceeds 30\u00b0C.",
      "Save historical hourly moisture levels to an onboard SD card.",
      "Connect to Wi-Fi to send Push notifications when the water reservoir is empty."
    ],
    "combinations": [
      [
        "05-Communication/WiFi",
        "Stream real-time plant telemetry to a mobile dashboard."
      ],
      [
        "03-Actuators/Relays",
        "Control 12V ventilation louvers and grow lights."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/06-Automation/Environment-Monitoring"
  },
  {
    "id": "proj-31",
    "categoryId": "06-Automation",
    "categoryTitle": "Automation",
    "categoryIcon": "\ud83e\udd16",
    "categoryBadge": "Complete Systems",
    "folder": "Motor-Automation",
    "title": "Autonomous Obstacle-Avoiding Robotic Rover",
    "hook": "A self-navigating two-wheeled robotic vehicle that scans its environment with a panning ultrasonic sensor and avoids collisions in real-time.",
    "sketchName": "obstacle_avoiding_robot.ino",
    "learn": [
      "Combining differential drive DC motors with an panning servo radar",
      "Reactive navigational algorithms: Forward -> Stop -> Scan Left/Right -> Turn to Open Space",
      "Tuning turning durations and motor speed balance"
    ],
    "components": [
      [
        "Arduino Uno / Nano",
        "1",
        "Robot controller"
      ],
      [
        "2WD Robot Chassis with 2 DC Motors",
        "1",
        "Wheeled platform with caster"
      ],
      [
        "L298N Dual H-Bridge Motor Driver",
        "1",
        "Motor driver board"
      ],
      [
        "HC-SR04 Ultrasonic Sensor + SG90 Servo",
        "1 each",
        "Panning Sonar Radar Scanner"
      ],
      [
        "Battery Pack (7.4V LiPo or 6x AA)",
        "1",
        "Mobile power source"
      ],
      [
        "Breadboard & Jumpers",
        "1 set",
        "Connections"
      ]
    ],
    "pins": [
      [
        "D5, D7, D8",
        "ENA, IN1, IN2",
        "Left Motor Control"
      ],
      [
        "D6, D12, D13",
        "ENB, IN3, IN4",
        "Right Motor Control"
      ],
      [
        "D11",
        "Servo Signal Pin",
        "Panning Servo Head"
      ],
      [
        "D9 & D10",
        "TRIG & ECHO",
        "Ultrasonic Distance Sensor"
      ]
    ],
    "asciiDiagram": "+----------------------+\n                       | SG90 + HC-SR04 Sonar |  <-- Panning Radar Head\n                       +----------+-----------+\n                                  |\n    +-----------------------------+-----------------------------+\n    |                                                           |\n    |  [Left Motor] <=== L298N Motor Driver ===> [Right Motor]  |\n    |                                                           |\n    |                     Arduino Uno Brain                     |\n    |                                                           |\n    +-----------------------------------------------------------+",
    "code": "/*\n * Project: Autonomous Obstacle-Avoiding Robotic Rover\n * Description: Navigates environments autonomously by panning a sonar radar,\n *              detecting obstacles, and choosing the path with maximum clearance.\n * Part of: Arduino Projects Cookbook\n */\n\n#include <Servo.h>\n\n// Motor Pins\nconst int ENA = 5;\nconst int IN1 = 7;\nconst int IN2 = 8;\nconst int ENB = 6;\nconst int IN3 = 12;\nconst int IN4 = 13;\n\n// Sensor & Servo Pins\nconst int TRIG_PIN  = 9;\nconst int ECHO_PIN  = 10;\nconst int SERVO_PIN = 11;\n\nServo headServo;\n\nconst int SAFE_DISTANCE_CM = 25; // Stop if obstacle closer than 25cm\nconst int MOTOR_SPEED = 180;\n\nfloat readDistance() {\n  digitalWrite(TRIG_PIN, LOW);\n  delayMicroseconds(2);\n  digitalWrite(TRIG_PIN, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(TRIG_PIN, LOW);\n  unsigned long d = pulseIn(ECHO_PIN, HIGH, 25000);\n  if (d == 0) return 999.0;\n  return (d * 0.0343) / 2.0;\n}\n\nvoid moveForward() {\n  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);\n  digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);\n  analogWrite(ENA, MOTOR_SPEED); analogWrite(ENB, MOTOR_SPEED);\n}\n\nvoid moveBackward() {\n  digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);\n  digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH);\n  analogWrite(ENA, MOTOR_SPEED); analogWrite(ENB, MOTOR_SPEED);\n}\n\nvoid turnLeft(int ms) {\n  digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);\n  digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);\n  analogWrite(ENA, MOTOR_SPEED); analogWrite(ENB, MOTOR_SPEED);\n  delay(ms);\n}\n\nvoid turnRight(int ms) {\n  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);\n  digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH);\n  analogWrite(ENA, MOTOR_SPEED); analogWrite(ENB, MOTOR_SPEED);\n  delay(ms);\n}\n\nvoid stopMotors() {\n  digitalWrite(IN1, LOW); digitalWrite(IN2, LOW);\n  digitalWrite(IN3, LOW); digitalWrite(IN4, LOW);\n  analogWrite(ENA, 0); analogWrite(ENB, 0);\n}\n\nvoid setup() {\n  pinMode(ENA, OUTPUT); pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);\n  pinMode(ENB, OUTPUT); pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);\n  pinMode(TRIG_PIN, OUTPUT); pinMode(ECHO_PIN, INPUT);\n\n  headServo.attach(SERVO_PIN);\n  headServo.write(90); // Look straight ahead\n\n  Serial.begin(9600);\n  Serial.println(F(\"Autonomous Rover Online. Starting in 3s...\"));\n  delay(3000);\n}\n\nvoid loop() {\n  headServo.write(90); // Look ahead\n  delay(50);\n  float distanceAhead = readDistance();\n\n  if (distanceAhead > SAFE_DISTANCE_CM) {\n    moveForward();\n  } else {\n    // Obstacle encountered!\n    stopMotors();\n    moveBackward();\n    delay(300);\n    stopMotors();\n\n    // Look Left\n    headServo.write(150);\n    delay(300);\n    float distanceLeft = readDistance();\n\n    // Look Right\n    headServo.write(30);\n    delay(400);\n    float distanceRight = readDistance();\n\n    headServo.write(90); // Reset head\n    delay(200);\n\n    // Decision\n    if (distanceLeft > distanceRight && distanceLeft > SAFE_DISTANCE_CM) {\n      Serial.println(F(\"Turning Left towards open space\"));\n      turnLeft(400);\n    } else if (distanceRight > SAFE_DISTANCE_CM) {\n      Serial.println(F(\"Turning Right towards open space\"));\n      turnRight(400);\n    } else {\n      Serial.println(F(\"Dead end! Doing 180\u00b0 turn\"));\n      turnRight(800);\n    }\n  }\n  delay(50);\n}",
    "howItWorks": "The robot continuously drives forward while looking ahead. When an obstacle is detected within 25cm, the controller halts the wheels, reverses slightly to allow turning radius clearance, pans its servo head to measure distances to the left (150\u00b0) and right (30\u00b0), and executes a differential pivot turn toward the path with the greatest open clearance.",
    "challenges": [
      "Add an IR ground sensor to prevent the robot from driving off table edges or down stairs (cliff detection).",
      "Add an IMU to maintain a perfectly straight forward heading over uneven terrain.",
      "Implement Bluetooth manual remote control override."
    ],
    "combinations": [
      [
        "05-Communication/Bluetooth",
        "Switch between Autonomous Navigation and Smartphone RC Control."
      ],
      [
        "03-Actuators/Buzzers",
        "Add R2-D2 style audio beeps when making navigation decisions."
      ]
    ],
    "githubPath": "https://github.com/PrerithM/Arduino-Projects/tree/main/06-Automation/Motor-Automation"
  }
];
