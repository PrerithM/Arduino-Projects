# Autonomous Obstacle-Avoiding Robotic Rover

> A self-navigating two-wheeled robotic vehicle that scans its environment with a panning ultrasonic sensor and avoids collisions in real-time.

---

## 🎯 What You'll Learn
- Combining differential drive DC motors with an panning servo radar
- Reactive navigational algorithms: Forward -> Stop -> Scan Left/Right -> Turn to Open Space
- Tuning turning durations and motor speed balance

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| Arduino Uno / Nano | 1 | Robot controller |
| 2WD Robot Chassis with 2 DC Motors | 1 | Wheeled platform with caster |
| L298N Dual H-Bridge Motor Driver | 1 | Motor driver board |
| HC-SR04 Ultrasonic Sensor + SG90 Servo | 1 each | Panning Sonar Radar Scanner |
| Battery Pack (7.4V LiPo or 6x AA) | 1 | Mobile power source |
| Breadboard & Jumpers | 1 set | Connections |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `D5, D7, D8` | `ENA, IN1, IN2` | Left Motor Control |
| `D6, D12, D13` | `ENB, IN3, IN4` | Right Motor Control |
| `D11` | `Servo Signal Pin` | Panning Servo Head |
| `D9 & D10` | `TRIG & ECHO` | Ultrasonic Distance Sensor |


---

## 📐 Circuit & Wiring Diagram

```text
+----------------------+
                       | SG90 + HC-SR04 Sonar |  <-- Panning Radar Head
                       +----------+-----------+
                                  |
    +-----------------------------+-----------------------------+
    |                                                           |
    |  [Left Motor] <=== L298N Motor Driver ===> [Right Motor]  |
    |                                                           |
    |                     Arduino Uno Brain                     |
    |                                                           |
    +-----------------------------------------------------------+
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`obstacle_avoiding_robot.ino`](./obstacle_avoiding_robot.ino).

```cpp
/*
 * Project: Autonomous Obstacle-Avoiding Robotic Rover
 * Description: Navigates environments autonomously by panning a sonar radar,
 *              detecting obstacles, and choosing the path with maximum clearance.
 * Part of: Arduino Projects Cookbook
 */

#include <Servo.h>

// Motor Pins
const int ENA = 5;
const int IN1 = 7;
const int IN2 = 8;
const int ENB = 6;
const int IN3 = 12;
const int IN4 = 13;

// Sensor & Servo Pins
const int TRIG_PIN  = 9;
const int ECHO_PIN  = 10;
const int SERVO_PIN = 11;

Servo headServo;

const int SAFE_DISTANCE_CM = 25; // Stop if obstacle closer than 25cm
const int MOTOR_SPEED = 180;

float readDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  unsigned long d = pulseIn(ECHO_PIN, HIGH, 25000);
  if (d == 0) return 999.0;
  return (d * 0.0343) / 2.0;
}

void moveForward() {
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);
  analogWrite(ENA, MOTOR_SPEED); analogWrite(ENB, MOTOR_SPEED);
}

void moveBackward() {
  digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);
  digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH);
  analogWrite(ENA, MOTOR_SPEED); analogWrite(ENB, MOTOR_SPEED);
}

void turnLeft(int ms) {
  digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);
  digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);
  analogWrite(ENA, MOTOR_SPEED); analogWrite(ENB, MOTOR_SPEED);
  delay(ms);
}

void turnRight(int ms) {
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH);
  analogWrite(ENA, MOTOR_SPEED); analogWrite(ENB, MOTOR_SPEED);
  delay(ms);
}

void stopMotors() {
  digitalWrite(IN1, LOW); digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW); digitalWrite(IN4, LOW);
  analogWrite(ENA, 0); analogWrite(ENB, 0);
}

void setup() {
  pinMode(ENA, OUTPUT); pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(ENB, OUTPUT); pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
  pinMode(TRIG_PIN, OUTPUT); pinMode(ECHO_PIN, INPUT);

  headServo.attach(SERVO_PIN);
  headServo.write(90); // Look straight ahead

  Serial.begin(9600);
  Serial.println(F("Autonomous Rover Online. Starting in 3s..."));
  delay(3000);
}

void loop() {
  headServo.write(90); // Look ahead
  delay(50);
  float distanceAhead = readDistance();

  if (distanceAhead > SAFE_DISTANCE_CM) {
    moveForward();
  } else {
    // Obstacle encountered!
    stopMotors();
    moveBackward();
    delay(300);
    stopMotors();

    // Look Left
    headServo.write(150);
    delay(300);
    float distanceLeft = readDistance();

    // Look Right
    headServo.write(30);
    delay(400);
    float distanceRight = readDistance();

    headServo.write(90); // Reset head
    delay(200);

    // Decision
    if (distanceLeft > distanceRight && distanceLeft > SAFE_DISTANCE_CM) {
      Serial.println(F("Turning Left towards open space"));
      turnLeft(400);
    } else if (distanceRight > SAFE_DISTANCE_CM) {
      Serial.println(F("Turning Right towards open space"));
      turnRight(400);
    } else {
      Serial.println(F("Dead end! Doing 180° turn"));
      turnRight(800);
    }
  }
  delay(50);
}
```

---

## ⚙️ How It Works (Under the Hood)

The robot continuously drives forward while looking ahead. When an obstacle is detected within 25cm, the controller halts the wheels, reverses slightly to allow turning radius clearance, pans its servo head to measure distances to the left (150°) and right (30°), and executes a differential pivot turn toward the path with the greatest open clearance.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Add an IR ground sensor to prevent the robot from driving off table edges or down stairs (cliff detection).
1. Add an IMU to maintain a perfectly straight forward heading over uneven terrain.
1. Implement Bluetooth manual remote control override.

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [05-Communication/Bluetooth](../../05-Communication/Bluetooth/)**: Switch between Autonomous Navigation and Smartphone RC Control.
- **Pair with [03-Actuators/Buzzers](../../03-Actuators/Buzzers/)**: Add R2-D2 style audio beeps when making navigation decisions.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
