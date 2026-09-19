# 6-DOF IMU Motion Tracking (MPU6050 Accelerometer & Gyro)

> Track 3-axis acceleration, angular velocity, and tilt angles using an I2C Micro-Electro-Mechanical (MEMS) IMU.

---

## 🎯 What You'll Learn
- MEMS capacitive accelerometer and Coriolis gyroscope physics
- I2C protocol registers and 16-bit signed integer decoding
- Computing pitch, roll, and complementary filtering to cancel drift

---

## 📦 Components Required
| Component | Quantity | Notes / Specifications |
| :--- | :--- | :--- |
| Arduino Uno / Nano | 1 | Main board |
| MPU6050 (GY-521) 6-DOF IMU | 1 | Accelerometer + Gyroscope module |
| Breadboard & Jumpers | 1 set | Connections |


---

## 🔌 Pin Connections
| Arduino Pin | Component Pin | Description |
| :--- | :--- | :--- |
| `5V / 3.3V` | `VCC` | Power supply (MPU6050 board has onboard 3.3V LDO) |
| `GND` | `GND` | Ground |
| `A4` | `SDA` | I2C Serial Data |
| `A5` | `SCL` | I2C Serial Clock |


---

## 📐 Circuit & Wiring Diagram

```text
+-----------------+              +----------------------+
    |   Arduino Uno   |              |  MPU-6050 (GY-521)   |
    |                 |              |  [ 3-Axis Accel/Gyro]|
    |              5V |=============>| VCC                  |
    |             GND |=============>| GND                  |
    |        A4 (SDA) |<------------>| SDA                  |
    |        A5 (SCL) |------------->| SCL                  |
    +-----------------+              +----------------------+
```

---

## 💻 Arduino Sketch Walkthrough

The complete sketch is located in [`imu_mpu6050.ino`](./imu_mpu6050.ino).

```cpp
/*
 * Module: MPU6050 6-Axis Accelerometer & Gyroscope
 * Description: Reads raw G-force acceleration and angular velocity over I2C,
 *              calculating pitch and roll angles with a complementary filter.
 * Part of: Arduino Projects Cookbook
 */

#include <Wire.h>

const int MPU_ADDR = 0x68; // I2C address of MPU6050 (when AD0 pin is LOW)

int16_t accX, accY, accZ;
int16_t gyroX, gyroY, gyroZ;
int16_t tempRaw;

float pitch = 0.0;
float roll  = 0.0;
unsigned long prevTime = 0;

void setup() {
  Serial.begin(115200);
  Wire.begin();

  // Wake up MPU6050 by clearing sleep bit in PWR_MGMT_1 register (0x6B)
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x6B);
  Wire.write(0x00);
  Wire.endTransmission(true);

  prevTime = micros();
  Serial.println(F("MPU6050 Online. Streaming Pitch and Roll..."));
}

void loop() {
  // Request 14 sequential data registers starting at 0x3B (ACCEL_XOUT_H)
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x3B);
  Wire.endTransmission(false);
  Wire.requestFrom(MPU_ADDR, 14, true);

  accX = (Wire.read() << 8) | Wire.read();
  accY = (Wire.read() << 8) | Wire.read();
  accZ = (Wire.read() << 8) | Wire.read();
  tempRaw = (Wire.read() << 8) | Wire.read();
  gyroX = (Wire.read() << 8) | Wire.read();
  gyroY = (Wire.read() << 8) | Wire.read();
  gyroZ = (Wire.read() << 8) | Wire.read();

  unsigned long now = micros();
  float dt = (now - prevTime) / 1000000.0;
  prevTime = now;

  // Convert raw acceleration to angles (in degrees)
  float accPitch = atan2((float)accY, sqrt((float)accX * accX + (float)accZ * accZ)) * 180.0 / PI;
  float accRoll  = atan2(-(float)accX, (float)accZ) * 180.0 / PI;

  // Gyroscope angular velocity (deg/s) for ±250 deg/s range (sensitivity = 131 LSB/(deg/s))
  float gyroPitchRate = gyroX / 131.0;
  float gyroRollRate  = gyroY / 131.0;

  // Complementary Filter: 96% Gyro (fast response) + 4% Accel (long-term drift correction)
  pitch = 0.96 * (pitch + gyroPitchRate * dt) + 0.04 * accPitch;
  roll  = 0.96 * (roll + gyroRollRate * dt)   + 0.04 * accRoll;

  Serial.print(F("Pitch: "));
  Serial.print(pitch, 1);
  Serial.print(F("°\tRoll: "));
  Serial.print(roll, 1);
  Serial.println(F("°"));

  delay(20); // 50 Hz loop
}
```

---

## ⚙️ How It Works (Under the Hood)

The MPU6050 contains micro-machined silicon structures. Deflection of proof masses under acceleration causes capacitance variations measured by on-chip ADCs. While accelerometers calculate absolute tilt from gravity, they are susceptible to vibrations. Gyroscopes measure fast rotations without vibration noise but drift over time. A Complementary Filter fuses both sensor streams for rock-solid stability.

---

## 🚀 Try It Yourself (Challenges & Variations)

1. Use the pitch angle to build a two-wheeled self-balancing robot with PID motor control.
1. Recognize free-fall or shake gestures to trigger safety emergency stops.
1. Send Euler angles into Processing or Three.js to render a real-time 3D airplane model on screen.

---

## 🍳 Recipe Combinations (Mix & Match)

- **Pair with [03-Actuators/Servo](../../03-Actuators/Servo/)**: Build an active 2-axis camera gimbal that stabilizes a camera as the mount tilts.
- **Pair with [05-Communication/Bluetooth](../../05-Communication/Bluetooth/)**: Build a wireless gesture-controlled gaming controller.

---

*Part of the [Arduino Projects Cookbook](../../COOKBOOK.md) — build, remix, and share.*
