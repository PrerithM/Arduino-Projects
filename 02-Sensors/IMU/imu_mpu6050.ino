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
