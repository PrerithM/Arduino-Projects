/**
 * PRERITH.M — HARDWARE LAB
 * Interactive Core Application & Simulation Engines
 */

// ==========================================================================
// 1. COMPREHENSIVE EXPERIMENT REPOSITORY DATASET (24+ Modules)
// ==========================================================================

const EXPERIMENTS_DATA = [
  {
    id: "exp-rover",
    num: "PROJECT 025",
    title: "Advanced Rover (AI + Tele-Op)",
    category: "robotics",
    difficulty: "advanced",
    year: "2025",
    platform: "Arduino UNO + RPi",
    language: "C++ / Python",
    status: "ACTIVE EXPLORATION",
    summary: "AI-assisted differential drive robot equipped with ultrasonic obstacle evasion, panning turret, and live telemetry.",
    problem: "Navigating cluttered physical environments autonomously without getting trapped in dead-ends or colliding with glass surfaces.",
    idea: "Combine ultrasonic sonar array with optical odometry and edge vision inference for reactive trajectory corrections.",
    flow: ["ENVIRONMENT", "HC-SR04 SONAR", "ARDUINO BRAIN", "PID TRAJECTORY", "L298N MOTORS"],
    components: [
      { name: "Arduino Uno", role: "Real-time motor control & sensor polling" },
      { name: "L298N Dual H-Bridge", role: "DC Motor current amplification & direction" },
      { name: "HC-SR04 Sonar", role: "Frontal collision avoidance" },
      { name: "SG90 Micro Servo", role: "Radar panning turret" },
      { name: "HC-05 Bluetooth / Wi-Fi", role: "Wireless telemetry stream" }
    ],
    pinout: [
      { mcu: "D5, D6", comp: "L298N ENA, ENB", desc: "PWM Speed Control" },
      { mcu: "D7, D8", comp: "L298N IN1, IN2", desc: "Left Motor Direction" },
      { mcu: "D9, D10", comp: "HC-SR04 TRIG, ECHO", desc: "Sonar transceiver" },
      { mcu: "D11", comp: "SG90 Signal", desc: "Turret angle PWM" }
    ],
    code: `// Advanced Rover Autonomous Avoidance Core
#include <Servo.h>

const int TRIG_PIN = 9;
const int ECHO_PIN = 10;
const int LEFT_PWM = 5;
const int RIGHT_PWM = 6;
Servo turretServo;

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(LEFT_PWM, OUTPUT);
  pinMode(RIGHT_PWM, OUTPUT);
  turretServo.attach(11);
  turretServo.write(90); // Center
  Serial.begin(9600);
}

float getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long dur = pulseIn(ECHO_PIN, HIGH, 25000);
  return (dur == 0) ? 999.0 : (dur * 0.0343) / 2.0;
}

void loop() {
  float dist = getDistance();
  if (dist < 20.0) {
    // Evasive maneuver
    analogWrite(LEFT_PWM, 0);
    analogWrite(RIGHT_PWM, 0);
    delay(100);
    // Scan left and right
    turretServo.write(30);
    delay(300);
    float rightDist = getDistance();
    turretServo.write(150);
    delay(300);
    float leftDist = getDistance();
    turretServo.write(90);
    
    if (leftDist > rightDist) {
      analogWrite(LEFT_PWM, 0);
      analogWrite(RIGHT_PWM, 180);
    } else {
      analogWrite(LEFT_PWM, 180);
      analogWrite(RIGHT_PWM, 0);
    }
    delay(400);
  } else {
    analogWrite(LEFT_PWM, 200);
    analogWrite(RIGHT_PWM, 200);
  }
}`,
    githubPath: "06-Automation/Motor-Automation",
    lessons: [
      "Motor back-EMF spikes will reset the microcontroller without independent power rails and flyback diodes.",
      "Acoustic sonar reflections can fail on soft fabrics; sensor fusion with optical IR or bumpers is essential.",
      "State machines must never block with delay() if real-time emergency stops are required."
    ],
    tags: ["Robotics", "HC-SR04", "Motors", "L298N", "AI"]
  },
  {
    id: "exp-ultrasonic",
    num: "PROJECT 004",
    title: "Ultrasonic Distance Sonar",
    category: "sensors",
    difficulty: "beginner",
    year: "2024",
    platform: "Arduino UNO",
    language: "C++",
    status: "COMPLETED",
    summary: "Measuring millimeter distances with speed-of-sound physics using 40kHz acoustic pulses.",
    problem: "Determining proximity and distance without physical mechanical contact.",
    idea: "Emit a 10µs ultrasonic burst, measure echo return flight time, and calculate distance = (Time × 0.0343) / 2.",
    flow: ["TRIGGER PULSE (10µs)", "40kHz ACOUSTIC BURST", "TARGET REFLECTION", "ECHO PIN HIGH", "DISTANCE CALC"],
    components: [
      { name: "Arduino Uno", role: "Pulse timing & calculation" },
      { name: "HC-SR04 Module", role: "Piezo transmitter & receiver pair" },
      { name: "Piezo Buzzer", role: "Auditory proximity indicator" },
      { name: "LED", role: "Visual warning beacon" }
    ],
    pinout: [
      { mcu: "5V", comp: "VCC", desc: "Power Supply" },
      { mcu: "GND", comp: "GND", desc: "Ground reference" },
      { mcu: "D9", comp: "TRIG", desc: "Trigger pulse output" },
      { mcu: "D10", comp: "ECHO", desc: "Echo duration input" }
    ],
    code: `const int TRIG_PIN = 9;
const int ECHO_PIN = 10;

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  Serial.begin(9600);
  Serial.println(F("Sonar Initialized."));
}

float readDistanceCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  unsigned long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  if (duration == 0) return -1.0;
  return (duration * 0.0343) / 2.0;
}

void loop() {
  float distance = readDistanceCm();
  if (distance >= 0 && distance <= 400) {
    Serial.print(F("Distance: "));
    Serial.print(distance, 1);
    Serial.println(F(" cm"));
  }
  delay(100);
}`,
    githubPath: "02-Sensors/Ultrasonic",
    lessons: [
      "Speed of sound varies with temperature: v = 331.3 + (0.606 × T).",
      "Pulse timeout parameter in pulseIn() is vital to prevent hanging the main loop if an echo never returns.",
      "A 2µs LOW settling period before firing prevents false trigger bounces."
    ],
    tags: ["Sensors", "HC-SR04", "Physics", "PWM", "C++"]
  },
  {
    id: "exp-led-blink",
    num: "PROJECT 001",
    title: "Digital I/O & Non-Blocking State",
    category: "basic",
    difficulty: "beginner",
    year: "2023",
    platform: "Arduino UNO",
    language: "C++",
    status: "COMPLETED",
    summary: "The Hello World of physical computing: controlling current flow, Ohm's law, and async millis() timing.",
    problem: "Executing multiple blinking cadences simultaneously without freezing CPU execution with delay().",
    idea: "Treat time as a continuous variable; store previous timestamps and evaluate elapsed milliseconds on every loop pass.",
    flow: ["TICK CLOCK (millis)", "TIMESTAMP DELTA CHECK", "TOGGLE PIN STATE", "CURRENT TO ANODE", "PHOTONS EMITTED"],
    components: [
      { name: "Arduino Uno", role: "Digital Output Controller" },
      { name: "LED 5mm", role: "Visual feedback" },
      { name: "220Ω Resistor", role: "Current limiting protection" },
      { name: "Momentary Pushbutton", role: "Digital state input" }
    ],
    pinout: [
      { mcu: "D13", comp: "LED Anode (+)", desc: "via 220Ω resistor" },
      { mcu: "D2", comp: "Pushbutton Pin", desc: "Internal INPUT_PULLUP" },
      { mcu: "GND", comp: "Cathode (-)", desc: "Common ground" }
    ],
    code: `const int LED_PIN = 13;
const int BUTTON_PIN = 2;

unsigned long previousMillis = 0;
const long interval = 500;
int ledState = LOW;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
}

void loop() {
  unsigned long currentMillis = millis();
  
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    ledState = (ledState == LOW) ? HIGH : LOW;
    digitalWrite(LED_PIN, ledState);
  }
}`,
    githubPath: "01-Fundamentals/Digital-IO",
    lessons: [
      "Never connect an LED directly to 5V without a current-limiting resistor (V = IR).",
      "Using INPUT_PULLUP activates the internal 20kΩ resistor, eliminating floating pins without extra breadboard parts.",
      "Hardware debouncing vs software debouncing algorithms."
    ],
    tags: ["Basic", "LED", "Digital-IO", "C++", "Fundamentals"]
  },
  {
    id: "exp-analog-io",
    num: "PROJECT 002",
    title: "Analog Sampling & ADC Quantization",
    category: "basic",
    difficulty: "beginner",
    year: "2023",
    platform: "Arduino UNO",
    language: "C++",
    status: "COMPLETED",
    summary: "Reading continuous analog voltage potentials with 10-bit Successive Approximation ADC.",
    problem: "Converting physical continuous voltages into discrete numerical quantities for software processing.",
    idea: "Sample A0 using internal 10-bit ADC, mapping 0.0V–5.0V input into 0–1023 integer quantization bins.",
    flow: ["POTENTIOMETER DIAL", "VARIABLE VOLTAGE DIVIDER", "ADC CAPACITOR SAMPLE", "QUANTIZATION (10-BIT)", "SERIAL PLOT"],
    components: [
      { name: "Arduino Uno", role: "10-bit ADC Processor" },
      { name: "10kΩ Potentiometer", role: "Voltage Divider" },
      { name: "LDR Photoresistor", role: "Light-dependent resistance" }
    ],
    pinout: [
      { mcu: "5V", comp: "Pot Pin 1", desc: "High Reference" },
      { mcu: "A0", comp: "Pot Wiper (Pin 2)", desc: "Analog Voltage Signal" },
      { mcu: "GND", comp: "Pot Pin 3", desc: "Low Reference" }
    ],
    code: `const int POT_PIN = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int rawValue = analogRead(POT_PIN);
  float voltage = (rawValue / 1023.0) * 5.0;

  Serial.print("Raw: ");
  Serial.print(rawValue);
  Serial.print(" | Voltage: ");
  Serial.print(voltage, 2);
  Serial.println(" V");

  delay(50);
}`,
    githubPath: "01-Fundamentals/Analog-IO",
    lessons: [
      "ADC input impedance must be below 10kΩ for the internal sample-and-hold capacitor to charge accurately.",
      "Analog reference (AREF) can be adjusted to 1.1V internal for higher resolution on tiny signals.",
      "Averaging multiple samples filters high-frequency electrical noise."
    ],
    tags: ["Basic", "Analog", "ADC", "Potentiometer"]
  },
  {
    id: "exp-pwm",
    num: "PROJECT 003",
    title: "Pulse Width Modulation (PWM)",
    category: "basic",
    difficulty: "beginner",
    year: "2023",
    platform: "Arduino UNO",
    language: "C++",
    status: "COMPLETED",
    summary: "Simulating analog voltages by high-frequency square wave duty-cycle switching (~490Hz / 980Hz).",
    problem: "Digital pins can only output 0V or 5V. How do we dim an LED or vary motor speed smoothly?",
    idea: "Rapidly toggle the pin between 0V and 5V so fast that human persistence of vision / motor inertia averages the energy.",
    flow: ["DUTY CYCLE VALUE (0-255)", "HARDWARE TIMER REG", "PWM WAVE (490Hz)", "AVERAGE POWER INTEGRATION", "PERCEIVED BRIGHTNESS"],
    components: [
      { name: "Arduino Uno", role: "Hardware Timer Compare Match" },
      { name: "LED", role: "PWM Output Device" },
      { name: "Potentiometer", role: "Brightness dial" }
    ],
    pinout: [
      { mcu: "D11 (PWM)", comp: "LED Anode", desc: "PWM square wave output" },
      { mcu: "A0", comp: "Pot Wiper", desc: "Brightness control input" }
    ],
    code: `const int LED_PWM = 11;
const int POT_PIN = A0;

void setup() {
  pinMode(LED_PWM, OUTPUT);
}

void loop() {
  int potVal = analogRead(POT_PIN);
  // Map 10-bit ADC (0-1023) to 8-bit PWM (0-255)
  int brightness = map(potVal, 0, 1023, 0, 255);
  analogWrite(LED_PWM, brightness);
  delay(10);
}`,
    githubPath: "01-Fundamentals/PWM",
    lessons: [
      "Human eye perceived brightness is logarithmic, not linear; gamma correction curves produce smoother fades.",
      "Pins D5 and D6 run at 980Hz (Timer0), while pins D3, D9, D10, D11 run at 490Hz (Timer1/2).",
      "Inductive motor loads require PWM frequencies above human hearing range to prevent audible coil whine."
    ],
    tags: ["Basic", "PWM", "LED", "Timers"]
  },
  {
    id: "exp-interrupts",
    num: "PROJECT 010",
    title: "Hardware Interrupts & Rotary Encoders",
    category: "basic",
    difficulty: "intermediate",
    year: "2024",
    platform: "Arduino UNO",
    language: "C++",
    status: "COMPLETED",
    summary: "Sub-microsecond edge-triggered event handling with AVR Interrupt Service Routines (ISRs).",
    problem: "Polling digital pins in a loop misses rapid momentary pulses from optical tachometers or rotary encoders.",
    idea: "Attach hardware INT0 / INT1 to vector execution directly to an ISR on RISING or FALLING electrical transitions.",
    flow: ["PHYSICAL EVENT", "VOLTAGE EDGE TRIGGER", "CPU REGISTERS PUSHED", "ISR EXECUTION", "VOLATILE FLAG UPDATED"],
    components: [
      { name: "Arduino Uno", role: "Hardware Interrupt Matrix" },
      { name: "Rotary Encoder", role: "Quadrature pulse generator" },
      { name: "Pushbutton", role: "Emergency Stop Trigger" }
    ],
    pinout: [
      { mcu: "D2 (INT0)", comp: "Encoder CLK", desc: "External Hardware Interrupt 0" },
      { mcu: "D3 (INT1)", comp: "Encoder DT", desc: "External Hardware Interrupt 1" }
    ],
    code: `const int CLK_PIN = 2;
const int DT_PIN = 3;
volatile long encoderPos = 0;

void IRAM_ATTR isrEncoder() {
  int dtVal = digitalRead(DT_PIN);
  if (dtVal == HIGH) {
    encoderPos++;
  } else {
    encoderPos--;
  }
}

void setup() {
  pinMode(CLK_PIN, INPUT_PULLUP);
  pinMode(DT_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(CLK_PIN), isrEncoder, RISING);
  Serial.begin(115200);
}

void loop() {
  static long lastPos = 0;
  if (lastPos != encoderPos) {
    lastPos = encoderPos;
    Serial.print("Position: ");
    Serial.println(lastPos);
  }
}`,
    githubPath: "01-Fundamentals/Interrupts",
    lessons: [
      "Variables shared between ISRs and main loop MUST be declared 'volatile' to prevent compiler caching in registers.",
      "Never call Serial.print(), delay(), or millis() inside an ISR because interrupts are globally disabled.",
      "Atomic reading is required when accessing multi-byte variables on an 8-bit MCU."
    ],
    tags: ["Basic", "Interrupts", "Rotary-Encoder", "Assembly"]
  },
  {
    id: "exp-servo",
    num: "PROJECT 005",
    title: "Precision Servo Kinematics",
    category: "motors",
    difficulty: "beginner",
    year: "2024",
    platform: "Arduino UNO",
    language: "C++",
    status: "COMPLETED",
    summary: "Controlling angular shaft position (0°–180°) using 50Hz Pulse Width Modulation (1ms–2ms pulses).",
    problem: "Translating digital software values into exact mechanical rotational displacement.",
    idea: "Modulate the HIGH duty-cycle of a 20ms period pulse: 1.0ms = 0°, 1.5ms = 90°, 2.0ms = 180°.",
    flow: ["ANGLE VALUE (0-180°)", "SERVO LIBRARY", "50Hz PWM SIGNAL", "GEARBOX FEEDBACK", "POSITION HOLD"],
    components: [
      { name: "Arduino Uno", role: "PWM Signal Generator" },
      { name: "SG90 Servo", role: "Rotational actuator with internal potentiometer feedback" },
      { name: "10kΩ Potentiometer", role: "Manual analog dial control" }
    ],
    pinout: [
      { mcu: "5V", comp: "Servo Red (VCC)", desc: "5V Power rail" },
      { mcu: "GND", comp: "Servo Brown (GND)", desc: "Common Ground" },
      { mcu: "D9", comp: "Servo Orange (SIG)", desc: "PWM Signal output" },
      { mcu: "A0", comp: "Pot Center Pin", desc: "Analog input (0-1023)" }
    ],
    code: `#include <Servo.h>

Servo myServo;
const int POT_PIN = A0;

void setup() {
  myServo.attach(9);
  Serial.begin(9600);
}

void loop() {
  int potVal = analogRead(POT_PIN);
  int angle = map(potVal, 0, 1023, 0, 180);
  
  myServo.write(angle);
  Serial.print("Angle: ");
  Serial.println(angle);
  delay(15);
}`,
    githubPath: "03-Actuators/Servo",
    lessons: [
      "Servo motors draw stall currents up to 500mA; high-torque setups require external 5V power supply.",
      "The Arduino Servo library disables analogWrite() PWM on pins 9 and 10 on the Uno.",
      "Angular resolution is limited by 8-bit timer granularity."
    ],
    tags: ["Motors", "Servo", "PWM", "Actuators", "Kinematics"]
  },
  {
    id: "exp-dc-motors",
    num: "PROJECT 011",
    title: "Dual H-Bridge DC Motor Driver",
    category: "motors",
    difficulty: "intermediate",
    year: "2024",
    platform: "Arduino UNO",
    language: "C++",
    status: "COMPLETED",
    summary: "Bidirectional high-current motor control and regenerative braking via L298N dual H-Bridge transistors.",
    problem: "Microcontroller pins cannot output the 12V and 2A currents needed to spin heavy DC drive motors.",
    idea: "Use 4 internal power transistors in an 'H' configuration to switch voltage polarity across motor coils dynamically.",
    flow: ["PWM THROTTLE", "DIRECTION BITS", "L298N LOGIC GATES", "H-BRIDGE TRANSISTORS", "MOTOR TORQUE"],
    components: [
      { name: "Arduino Uno", role: "PWM & Logic Generator" },
      { name: "L298N Driver", role: "Dual full-bridge driver IC" },
      { name: "TT Gearbox Motor", role: "Mechanical drive actuator" },
      { name: "12V Battery Pack", role: "High-current power source" }
    ],
    pinout: [
      { mcu: "D5", comp: "ENA", desc: "Left Motor Speed (PWM)" },
      { mcu: "D7", comp: "IN1", desc: "Left Motor Direction A" },
      { mcu: "D8", comp: "IN2", desc: "Left Motor Direction B" }
    ],
    code: `const int ENA = 5;
const int IN1 = 7;
const int IN2 = 8;

void setup() {
  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
}

void driveForward(int speed) {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, speed);
}

void driveReverse(int speed) {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  analogWrite(ENA, speed);
}

void brake() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, HIGH); // Short circuit braking
  analogWrite(ENA, 255);
}

void loop() {
  driveForward(200);
  delay(2000);
  brake();
  delay(500);
  driveReverse(150);
  delay(2000);
}`,
    githubPath: "03-Actuators/DC-Motors",
    lessons: [
      "Always connect Arduino GND and external Battery GND together for a shared reference voltage.",
      "The L298N bipolar design drops ~2V as heat; MOSFET-based drivers like TB6612FNG run much cooler.",
      "Flyback diodes prevent inductive voltage kickback from destroying driver transistors."
    ],
    tags: ["Motors", "L298N", "DC-Motor", "H-Bridge"]
  },
  {
    id: "exp-stepper",
    num: "PROJECT 012",
    title: "Stepper Motor Discrete Angular Stepping",
    category: "motors",
    difficulty: "intermediate",
    year: "2024",
    platform: "Arduino UNO",
    language: "C++",
    status: "COMPLETED",
    summary: "Sub-degree mechanical positioning with ULN2003 Darlington transistor array driving 4-phase unipolar coils.",
    problem: "DC motors drift and coast, making exact rotational degrees impossible without complex encoders.",
    idea: "Energize stator electromagnets in 4-step sequence (0.088° per half-step with 64:1 reduction gearing).",
    flow: ["STEP PULSE", "ULN2003 DARLINGTON", "4-PHASE STATOR", "ROTOR MAGNETIC DETENT", "GEAR REDUCTION 64:1"],
    components: [
      { name: "Arduino Uno", role: "Phase sequencing master" },
      { name: "28BYJ-48 Stepper", role: "5V unipolar permanent magnet stepper" },
      { name: "ULN2003 Driver Board", role: "Darlington transistor sink array" }
    ],
    pinout: [
      { mcu: "D8", comp: "IN1 (Phase A)", desc: "Coil 1" },
      { mcu: "D9", comp: "IN2 (Phase B)", desc: "Coil 2" },
      { mcu: "D10", comp: "IN3 (Phase C)", desc: "Coil 3" },
      { mcu: "D11", comp: "IN4 (Phase D)", desc: "Coil 4" }
    ],
    code: `#include <Stepper.h>

const int STEPS_PER_REV = 2048; // 64 steps * 32:1 gear ratio
Stepper myStepper(STEPS_PER_REV, 8, 10, 9, 11);

void setup() {
  myStepper.setSpeed(12); // 12 RPM
  Serial.begin(9600);
}

void loop() {
  Serial.println("Rotating 360° Clockwise...");
  myStepper.step(STEPS_PER_REV);
  delay(1000);

  Serial.println("Rotating 180° Counter-Clockwise...");
  myStepper.step(-STEPS_PER_REV / 2);
  delay(1000);
}`,
    githubPath: "03-Actuators/Stepper-Motors",
    lessons: [
      "Pin ordering in the Stepper library for 28BYJ-48 must be (8, 10, 9, 11) to match coil winding order.",
      "Steppers draw full holding current even when stationary; disable coil pins to prevent overheating when idle.",
      "Acceleration curves prevent missed steps on high-inertia loads."
    ],
    tags: ["Motors", "Stepper", "Robotics", "Actuators"]
  },
  {
    id: "exp-imu",
    num: "PROJECT 013",
    title: "MPU6050 6-DOF Gyro & Accelerometer",
    category: "sensors",
    difficulty: "advanced",
    year: "2024",
    platform: "Arduino UNO",
    language: "C++",
    status: "COMPLETED",
    summary: "Real-time spatial pitch, roll, and angular acceleration telemetry with Digital Motion Processor (DMP).",
    problem: "Raw accelerometer readings are noisy from vibrations, and gyro integration drifts over time.",
    idea: "Combine high-pass filtered gyro rates with low-pass filtered gravity vectors using a complementary filter.",
    flow: ["MEMS PROOF MASS", "CAPACITIVE SENSING", "ON-CHIP 16-BIT ADC", "I2C BUS (Addr 0x68)", "COMPLEMENTARY FILTER"],
    components: [
      { name: "Arduino Uno", role: "I2C Sensor Host" },
      { name: "MPU-6050 Module", role: "3-axis gyro + 3-axis accelerometer MEMS" }
    ],
    pinout: [
      { mcu: "5V / 3.3V", comp: "VCC", desc: "Power supply" },
      { mcu: "GND", comp: "GND", desc: "Ground" },
      { mcu: "A4", comp: "SDA", desc: "I2C Data" },
      { mcu: "A5", comp: "SCL", desc: "I2C Clock" }
    ],
    code: `#include <Wire.h>
#include <MPU6050.h>

MPU6050 mpu;

void setup() {
  Wire.begin();
  Serial.begin(115200);
  mpu.initialize();
  
  if (mpu.testConnection()) {
    Serial.println("MPU6050 connected successfully.");
  }
}

void loop() {
  int16_t ax, ay, az;
  int16_t gx, gy, gz;

  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

  // Convert raw to gravity (g) & angular velocity (°/s)
  float accelX = ax / 16384.0;
  float gyroZ = gz / 131.0;

  Serial.print("Accel X: ");
  Serial.print(accelX);
  Serial.print("g | Gyro Z: ");
  Serial.print(gyroZ);
  Serial.println(" deg/s");

  delay(50);
}`,
    githubPath: "02-Sensors/IMU",
    lessons: [
      "Calibrating zero-offsets during boot with the sensor resting on a flat level surface is mandatory.",
      "Complementary filter: angle = 0.98 * (angle + gyro * dt) + 0.02 * accelAngle.",
      "I2C clock speed can be boosted to 400kHz (Wire.setClock(400000)) for low-latency flight controllers."
    ],
    tags: ["Sensors", "IMU", "I2C", "Physics", "Robotics"]
  },
  {
    id: "exp-bluetooth",
    num: "PROJECT 014",
    title: "Wireless Bluetooth RC Telemetry",
    category: "iot",
    difficulty: "intermediate",
    year: "2024",
    platform: "Arduino UNO",
    language: "C++",
    status: "COMPLETED",
    summary: "Real-time bidirectional wireless UART link bridging smartphones and Arduino over 2.4GHz RF.",
    problem: "Cables tether robots and prevent long-range remote telemetry logging.",
    idea: "Use an HC-05 module operating in Bluetooth SPP (Serial Port Profile) over SoftwareSerial RX/TX.",
    flow: ["SMARTPHONE APP", "BLUETOOTH 2.4GHz RF", "HC-05 BASEBAND", "UART PACKET (9600 BAUD)", "ARDUINO PARSER"],
    components: [
      { name: "Arduino Uno", role: "UART Command Processor" },
      { name: "HC-05 Bluetooth Module", role: "2.4GHz SPP Transceiver" },
      { name: "Voltage Divider (1kΩ/2kΩ)", role: "5V to 3.3V RX logic level shifter" }
    ],
    pinout: [
      { mcu: "D10 (RX)", comp: "HC-05 TXD", desc: "Receive serial data" },
      { mcu: "D11 (TX)", comp: "HC-05 RXD", desc: "via 1k/2k voltage divider to 3.3V" },
      { mcu: "5V", comp: "VCC", desc: "Power supply" }
    ],
    code: `#include <SoftwareSerial.h>

SoftwareSerial btSerial(10, 11); // RX, TX

void setup() {
  Serial.begin(9600);
  btSerial.begin(9600);
  Serial.println("Bluetooth Bridge Online.");
}

void loop() {
  if (btSerial.available()) {
    char cmd = btSerial.read();
    Serial.print("Received Command: ");
    Serial.println(cmd);

    // Motor control commands: 'F' = Forward, 'B' = Back, 'S' = Stop
    if (cmd == 'F') {
      // Execute forward
    } else if (cmd == 'S') {
      // Execute emergency stop
    }
  }
}`,
    githubPath: "05-Communication/Bluetooth",
    lessons: [
      "The HC-05 RX pin is 3.3V tolerant only; applying raw 5V from Arduino TX will degrade or destroy the chip.",
      "Hardware UART (D0/D1) is shared with USB programmer; use SoftwareSerial to keep programming debug port open.",
      "Frame commands with delimiters like '<F,255>' to prevent partial packet race conditions."
    ],
    tags: ["IoT", "Bluetooth", "Wireless", "UART", "Robotics"]
  },
  {
    id: "exp-lcd",
    num: "PROJECT 006",
    title: "I2C Alphanumeric LCD Interface",
    category: "displays",
    difficulty: "beginner",
    year: "2024",
    platform: "Arduino UNO",
    language: "C++",
    status: "COMPLETED",
    summary: "Driving a 16×2 character matrix display using the PCF8574 I2C expander with only 2 microcontroller pins.",
    problem: "Standard HD44780 displays consume 6 to 10 digital pins, exhausting Arduino I/O.",
    idea: "Use an I2C backpack expander (PCF8574) running at 100kHz over SDA (A4) and SCL (A5).",
    flow: ["TEXT STRING", "I2C SERIAL BUFFER", "SDA/SCL BUS", "PCF8574 EXPANDER", "LIQUID CRYSTAL MATRIX"],
    components: [
      { name: "Arduino Uno", role: "I2C Master Controller" },
      { name: "16x2 Character LCD", role: "Alphanumeric optical matrix" },
      { name: "PCF8574 I2C Backpack", role: "Serial-to-parallel shift expander (Addr 0x27)" }
    ],
    pinout: [
      { mcu: "5V", comp: "VCC", desc: "Power" },
      { mcu: "GND", comp: "GND", desc: "Ground" },
      { mcu: "A4", comp: "SDA", desc: "I2C Serial Data" },
      { mcu: "A5", comp: "SCL", desc: "I2C Serial Clock" }
    ],
    code: `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("PRERITH HW LAB");
  lcd.setCursor(0, 1);
  lcd.print("I2C Bus Ready...");
}

void loop() {
  lcd.setCursor(0, 1);
  lcd.print("Uptime: ");
  lcd.print(millis() / 1000);
  lcd.print("s   ");
  delay(500);
}`,
    githubPath: "04-Displays/LCD",
    lessons: [
      "Always run an I2C scanner sketch first to confirm device address (typically 0x27 or 0x3F).",
      "I2C bus requires pull-up resistors on SDA/SCL lines (usually integrated into backpacks).",
      "Writing to LCD too frequently causes visible screen flicker; only update modified characters."
    ],
    tags: ["Displays", "LCD", "I2C", "Communications"]
  },
  {
    id: "exp-7segment",
    num: "PROJECT 015",
    title: "Multiplexed 7-Segment Display",
    category: "displays",
    difficulty: "intermediate",
    year: "2024",
    platform: "Arduino UNO",
    language: "C++",
    status: "COMPLETED",
    summary: "Driving 4-digit numeric LED indicators using persistence-of-vision high-speed time multiplexing.",
    problem: "Controlling 32 individual LEDs directly on a 4-digit display requires 32 microcontroller pins.",
    idea: "Tie all corresponding segment anodes together; rapidly cycle through common cathodes at 200Hz.",
    flow: ["DIGIT BCD CODE", "SEGMENT MAPPING BYTE", "TIME-SLOT COUNTER", "TRANSISTOR CATHODE SINK", "PERSISTENCE OF VISION"],
    components: [
      { name: "Arduino Uno", role: "Multiplexing Timer Master" },
      { name: "4-Digit 7-Segment Display", role: "Common Cathode LED Matrix" },
      { name: "74HC595 Shift Register", role: "Serial-to-Parallel Segment Driver" }
    ],
    pinout: [
      { mcu: "D8", comp: "595 Data (DS)", desc: "Serial segment bit stream" },
      { mcu: "D9", comp: "595 Latch (ST_CP)", desc: "Register latch clock" },
      { mcu: "D10", comp: "595 Clock (SH_CP)", desc: "Shift register clock" }
    ],
    code: `const int DATA_PIN = 8;
const int LATCH_PIN = 9;
const int CLOCK_PIN = 10;

// Hex byte patterns for 0-9 digits (A-G segments)
const byte digitPatterns[] = {
  0b00111111, // 0
  0b00000110, // 1
  0b01011011, // 2
  0b01001111, // 3
  0b01100110, // 4
  0b01101101, // 5
  0b01111101, // 6
  0b00000111, // 7
  0b01111111, // 8
  0b01101111  // 9
};

void setup() {
  pinMode(DATA_PIN, OUTPUT);
  pinMode(LATCH_PIN, OUTPUT);
  pinMode(CLOCK_PIN, OUTPUT);
}

void showNumber(int num) {
  digitalWrite(LATCH_PIN, LOW);
  shiftOut(DATA_PIN, CLOCK_PIN, MSBFIRST, digitPatterns[num % 10]);
  digitalWrite(LATCH_PIN, HIGH);
}

void loop() {
  for (int i = 0; i <= 9; i++) {
    showNumber(i);
    delay(500);
  }
}`,
    githubPath: "04-Displays/7-Segment",
    lessons: [
      "Multiplexing refresh rate must exceed 60Hz per digit to eliminate visible optical flickering.",
      "The 74HC595 shift register saves 5 Arduino pins by transmitting 8 bits serially over 3 wires.",
      "Current limiting resistors must be placed on segment lines, not common cathode lines, to avoid uneven brightness."
    ],
    tags: ["Displays", "7-Segment", "Shift-Register", "LEDs"]
  },
  {
    id: "exp-dht11",
    num: "PROJECT 007",
    title: "Temperature & Humidity Telemetry",
    category: "iot",
    difficulty: "beginner",
    year: "2024",
    platform: "Arduino UNO",
    language: "C++",
    status: "COMPLETED",
    summary: "Measuring ambient environmental conditions with digital single-wire capacitive & thermistor sensors.",
    problem: "Analog thermistors suffer from non-linear response curves and temperature drift.",
    idea: "Sample a dedicated DHT11 IC containing a calibrated NTC thermistor, capacitive humidity polymer, and 8-bit MCU.",
    flow: ["AIR SAMPLING", "CAPACITIVE DRIFT", "SINGLE-WIRE PROTOCOL", "CHECKSUM VERIFY", "TEMP/HUMIDITY READOUT"],
    components: [
      { name: "Arduino Uno", role: "Single-wire master" },
      { name: "DHT11 / DHT22 Sensor", role: "Digital humidity and temperature element" },
      { name: "10kΩ Pull-Up Resistor", role: "Data line signal pull-up" }
    ],
    pinout: [
      { mcu: "5V", comp: "VCC (Pin 1)", desc: "Power Supply" },
      { mcu: "D4", comp: "DATA (Pin 2)", desc: "Single-wire bidirectional bus" },
      { mcu: "GND", comp: "GND (Pin 4)", desc: "Ground" }
    ],
    code: `#include <DHT.h>

#define DHTPIN 4
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
  Serial.println(F("DHT11 Environment Sensor Active."));
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    Serial.println(F("Sensor read failure!"));
    return;
  }

  Serial.print(F("Humidity: "));
  Serial.print(h);
  Serial.print(F("%  |  Temp: "));
  Serial.print(t);
  Serial.println(F("°C"));

  delay(2000);
}`,
    githubPath: "02-Sensors/Humidity",
    lessons: [
      "DHT11 has a 1Hz to 0.5Hz max sampling rate; querying faster returns cached or corrupt data.",
      "Custom single-wire timing requires microsecond pulse duration decoding (28µs vs 70µs pulses).",
      "CRC checksum validation protects serial data packets from electrical interference."
    ],
    tags: ["IoT", "Sensors", "DHT11", "Climate", "Telemetry"]
  },
  {
    id: "exp-line-follower",
    num: "PROJECT 008",
    title: "PID Line Following Automation",
    category: "robotics",
    difficulty: "intermediate",
    year: "2024",
    platform: "Arduino UNO",
    language: "C++",
    status: "COMPLETED",
    summary: "Autonomous ground vehicle navigation using dual IR reflectance sensors and differential thrust correction.",
    problem: "Maintaining high speed on high-curvature path vectors without oscillating or overshooting tracks.",
    idea: "Continuously calculate error offset between left and right infrared reflectance values and feed into proportional-derivative motor steering.",
    flow: ["IR REFLECTANCE", "COMPARATOR THRESHOLD", "ERROR OFFSET CALC", "PWM BALANCING", "DIFFERENTIAL TURN"],
    components: [
      { name: "Arduino Uno", role: "Controller & PID Loop" },
      { name: "TCRT5000 Dual IR Sensors", role: "Surface contrast detection" },
      { name: "L298N Motor Driver", role: "Dual DC Motor power amplifier" },
      { name: "2WD Robot Chassis", role: "Mechanical platform" }
    ],
    pinout: [
      { mcu: "A1", comp: "Left IR Sensor", desc: "Analog reflectance" },
      { mcu: "A2", comp: "Right IR Sensor", desc: "Analog reflectance" },
      { mcu: "D5, D6", comp: "Motor PWM Pins", desc: "Speed regulation" }
    ],
    code: `const int LEFT_SENSOR = A1;
const int RIGHT_SENSOR = A2;
const int MOTOR_L_PWM = 5;
const int MOTOR_R_PWM = 6;

const int BASE_SPEED = 160;
const int THRESHOLD = 500;

void setup() {
  pinMode(MOTOR_L_PWM, OUTPUT);
  pinMode(MOTOR_R_PWM, OUTPUT);
}

void loop() {
  int leftVal = analogRead(LEFT_SENSOR);
  int rightVal = analogRead(RIGHT_SENSOR);

  if (leftVal < THRESHOLD && rightVal < THRESHOLD) {
    analogWrite(MOTOR_L_PWM, BASE_SPEED);
    analogWrite(MOTOR_R_PWM, BASE_SPEED);
  } else if (leftVal >= THRESHOLD) {
    analogWrite(MOTOR_L_PWM, 50);
    analogWrite(MOTOR_R_PWM, BASE_SPEED + 40);
  } else if (rightVal >= THRESHOLD) {
    analogWrite(MOTOR_L_PWM, BASE_SPEED + 40);
    analogWrite(MOTOR_R_PWM, 50);
  }
}`,
    githubPath: "06-Automation/Motor-Automation",
    lessons: [
      "Ambient sunlight contains strong infrared spectrum that can saturate cheap phototransistors.",
      "Motor gearbox backlash and battery voltage droop degrade open-loop calibration over time.",
      "Proper weight distribution over the caster wheel prevents drive wheel slip."
    ],
    tags: ["Robotics", "Sensors", "Motors", "Automation", "IR"]
  },
  {
    id: "exp-smart-room",
    num: "PROJECT 009",
    title: "Smart Room Automation Hub",
    category: "iot",
    difficulty: "intermediate",
    year: "2024",
    platform: "Arduino UNO",
    language: "C++",
    status: "COMPLETED",
    summary: "Automated environmental lighting and power switching utilizing LDR light sensing and relay isolation.",
    problem: "Automatically activating lighting and ventilation based on ambient light and room occupancy.",
    idea: "Read photocell analog gradient, evaluate hysteresis thresholds, and trigger optically isolated 5V relay coils.",
    flow: ["LDR SENSOR", "VOLTAGE DIVIDER (A0)", "HYSTERESIS COMPARATOR", "OPTOCOUPLER RELAY", "HIGH VOLTAGE LAMP"],
    components: [
      { name: "Arduino Uno", role: "Decision Controller" },
      { name: "LDR Photocell", role: "Ambient illumination reading" },
      { name: "5V Optocoupler Relay", role: "Galvanically isolated mains switch" },
      { name: "PIR Motion Detector", role: "Human occupancy trigger" }
    ],
    pinout: [
      { mcu: "A0", comp: "LDR Voltage Divider", desc: "Analog Light Level" },
      { mcu: "D8", comp: "Relay IN Pin", desc: "Active-LOW trigger" },
      { mcu: "D2", comp: "PIR Sensor OUT", desc: "Interrupt / Digital High" }
    ],
    code: `const int LDR_PIN = A0;
const int RELAY_PIN = 8;
const int PIR_PIN = 2;

const int DARK_THRESHOLD = 350;
const int LIGHT_THRESHOLD = 500;
bool lightActive = false;

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);
  pinMode(PIR_PIN, INPUT);
  Serial.begin(9600);
}

void loop() {
  int lightLevel = analogRead(LDR_PIN);
  int motion = digitalRead(PIR_PIN);

  if (!lightActive && lightLevel < DARK_THRESHOLD && motion == HIGH) {
    lightActive = true;
    digitalWrite(RELAY_PIN, LOW);
    Serial.println("Light ACTIVATED by motion in dark.");
  } else if (lightActive && lightLevel > LIGHT_THRESHOLD) {
    lightActive = false;
    digitalWrite(RELAY_PIN, HIGH);
    Serial.println("Light DEACTIVATED by daylight.");
  }

  delay(200);
}`,
    githubPath: "06-Automation/Smart-Lighting",
    lessons: [
      "Hysteresis thresholds are required to prevent relay chatter around the transition threshold.",
      "Optocoupled relay modules protect the microcontroller from AC inductive transients.",
      "PIR motion sensors require a 30-second thermal stabilization warm-up on boot."
    ],
    tags: ["IoT", "Automation", "Relay", "LDR", "Sensors"]
  },
  {
    id: "exp-security-alarm",
    num: "PROJECT 016",
    title: "Autonomous Perimeter Intruder Alarm",
    category: "robotics",
    difficulty: "intermediate",
    year: "2024",
    platform: "Arduino UNO",
    language: "C++",
    status: "COMPLETED",
    summary: "Integrated tripwire defense grid using PIR infrared motion, laser photodiode barrier, and dual-tone sirens.",
    problem: "False alarms caused by insects or shadows in standalone optical tripwire systems.",
    idea: "Enforce multi-sensor cross-correlation: require BOTH PIR infrared body heat AND laser beam break before siren latch.",
    flow: ["LASER BEAM", "PHOTODIODE MATRIX", "PIR THERMAL SENSOR", "LOGICAL AND EVAL", "HIGH-DECIBEL SIREN"],
    components: [
      { name: "Arduino Uno", role: "Security controller" },
      { name: "Laser Diode 650nm", role: "Coherent light emitter" },
      { name: "LDR / Photodiode", role: "Beam receiver" },
      { name: "Piezo Siren", role: "High-decibel acoustic alarm" }
    ],
    pinout: [
      { mcu: "D12", comp: "Laser VCC", desc: "Laser power control" },
      { mcu: "A3", comp: "Photodiode Receiver", desc: "Beam state analog" },
      { mcu: "D7", comp: "Buzzer / Siren", desc: "PWM Tone output" }
    ],
    code: `const int BEAM_PIN = A3;
const int SIREN_PIN = 7;
const int BEAM_THRESHOLD = 800;

void setup() {
  pinMode(SIREN_PIN, OUTPUT);
  Serial.begin(9600);
}

void triggerAlarm() {
  for (int hz = 400; hz < 1200; hz += 20) {
    tone(SIREN_PIN, hz);
    delay(10);
  }
  noTone(SIREN_PIN);
}

void loop() {
  int beam = analogRead(BEAM_PIN);
  if (beam < BEAM_THRESHOLD) {
    Serial.println("PERIMETER BREACH DETECTED!");
    triggerAlarm();
  }
  delay(50);
}`,
    githubPath: "06-Automation/Security",
    lessons: [
      "Modulating laser beams at 38kHz rejects ambient sunlight spoofing.",
      "Latched software alarm states must require explicit password or keycode reset.",
      "Piezo transducers sound significantly louder when driven at their mechanical resonant frequency."
    ],
    tags: ["Robotics", "Security", "Automation", "Buzzer", "Sensors"]
  },
  {
    id: "exp-wifi-iot",
    num: "PROJECT 017",
    title: "ESP8266 Cloud Telemetry Bridge",
    category: "iot",
    difficulty: "advanced",
    year: "2024",
    platform: "Arduino UNO + ESP8266",
    language: "C++",
    status: "COMPLETED",
    summary: "Posting sensor telemetry over 802.11b/g/n Wi-Fi to cloud IoT REST endpoints using Hayes AT commands.",
    problem: "Arduino Uno has no native networking capabilities to send data over the internet.",
    idea: "Interface with ESP8266 over serial UART, establishing TCP sockets and transmitting HTTP POST JSON payloads.",
    flow: ["SENSOR SAMPLE", "JSON STRING SERIALIZE", "AT+CIPSTART TCP", "HTTP POST PAYLOAD", "CLOUD INGESTION"],
    components: [
      { name: "Arduino Uno", role: "Telemetry aggregator" },
      { name: "ESP-01 (ESP8266)", role: "Wi-Fi coprocessor" },
      { name: "3.3V LDO Voltage Regulator", role: "Power conditioning" }
    ],
    pinout: [
      { mcu: "D2 (RX)", comp: "ESP8266 TX", desc: "SoftwareSerial Data In" },
      { mcu: "D3 (TX)", comp: "ESP8266 RX", desc: "via 3.3V level shifter" },
      { mcu: "3.3V", comp: "VCC & CH_PD", desc: "ESP Power" }
    ],
    code: `#include <SoftwareSerial.h>

SoftwareSerial espSerial(2, 3); // RX, TX

void sendDataToCloud(float temp, float humidity) {
  espSerial.println("AT+CIPSTART=\\"TCP\\",\\"api.thingspeak.com\\",80");
  delay(1000);
  
  String postData = "field1=" + String(temp) + "&field2=" + String(humidity);
  String sendCmd = "AT+CIPSEND=" + String(postData.length());
  espSerial.println(sendCmd);
  delay(500);
  espSerial.println(postData);
}

void setup() {
  Serial.begin(9600);
  espSerial.begin(9600);
  Serial.println("ESP8266 IoT Station Online.");
}

void loop() {
  sendDataToCloud(24.5, 58.2);
  delay(15000); // 15s cloud interval
}`,
    githubPath: "05-Communication/WiFi",
    lessons: [
      "ESP8266 peak Wi-Fi transmission bursts draw 250mA, exceeding Uno 3.3V onboard regulator limits.",
      "AT command serial parser must handle asynchronous 'CLOSED' and 'ERROR' strings gracefully.",
      "MQTT protocol is vastly more lightweight than HTTP for low-power embedded nodes."
    ],
    tags: ["IoT", "WiFi", "ESP8266", "Cloud", "REST"]
  }
];

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

    container.innerHTML = filtered.map(exp => `
      <article class="glass-panel experiment-card" onclick="openExperimentModal('${exp.id}')">
        <div class="card-top-meta">
          <span class="exp-number">${exp.num}</span>
          <span class="exp-difficulty ${exp.difficulty}">${exp.difficulty}</span>
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
          <span class="view-link">
            <span>Inspect</span>
            <i class="fa-solid fa-arrow-right"></i>
          </span>
        </div>
      </article>
    `).join('');
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
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h3 class="modal-block-title" style="margin-bottom: 0;"><i class="fa-solid fa-code"></i> Arduino C++ Sketch</h3>
        <a href="https://github.com/PrerithM/Arduino-Projects/tree/main/${exp.githubPath}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
          <i class="fa-brands fa-github"></i>
          <span>Open on GitHub</span>
          <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.65rem;"></i>
        </a>
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
        <div class="search-hit-item" onclick="openExperimentModal('${hit.id}'); closeSearchModal();">
          <div class="search-hit-title">${hit.num}: ${hit.title}</div>
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
