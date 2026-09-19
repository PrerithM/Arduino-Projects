# 📡 02. Sensors & Environmental Data

> Sense your physical environment: measure distance, sound reflections, ambient temperature, relative humidity, light intensity, and 6-DOF acceleration/gyroscope orientation.

---

## 📚 Modules & Recipes in this Category

| Project / Module | Description | Sketch File |
| :--- | :--- | :--- |
| [Ultrasonic Distance Sensor (HC-SR04)](./Ultrasonic/) | Measure distances with millimeter precision using 40kHz acoustic pulses and speed-of-sound physics. | [`ultrasonic.ino`](./Ultrasonic/ultrasonic.ino) |
| [Infrared Proximity & Obstacle Detector](./IR/) | Detect close-range reflective surfaces using active infrared emitter-receiver phototransistor pairs. | [`ir_sensor.ino`](./IR/ir_sensor.ino) |
| [Precision Temperature Sensing (DS18B20 & Thermistor)](./Temperature/) | Measure Celsius and Fahrenheit temperatures with high accuracy over 1-Wire digital bus or NTC analog curves. | [`temperature.ino`](./Temperature/temperature.ino) |
| [Relative Humidity & Temperature (DHT11 / DHT22)](./Humidity/) | Track ambient moisture and comfort index using digital capacitive humidity sensors. | [`humidity.ino`](./Humidity/humidity.ino) |
| [Ambient Light Intensity (Photoresistor / LDR)](./Light/) | Detect ambient daylight, room illumination, and laser tripwires with a Light Dependent Resistor (LDR). | [`light_sensor.ino`](./Light/light_sensor.ino) |
| [6-DOF IMU Motion Tracking (MPU6050 Accelerometer & Gyro)](./IMU/) | Track 3-axis acceleration, angular velocity, and tilt angles using an I2C Micro-Electro-Mechanical (MEMS) IMU. | [`imu_mpu6050.ino`](./IMU/imu_mpu6050.ino) |
| [Time-of-Flight Laser Distance (VL53L0X / VL53L1X)](./Distance/) | Measure precise millimeter distances regardless of target color or surface reflectivity using 940nm photon flight times. | [`tof_distance.ino`](./Distance/tof_distance.ino) |

---

## 🍳 How to Combine this Category

This category provides core modular building blocks. Pair any module in this directory with:
- **Inputs & Sensors** in [`02-Sensors/`](../02-Sensors/)
- **Outputs & Actuators** in [`03-Actuators/`](../03-Actuators/)
- **Visual Displays** in [`04-Displays/`](../04-Displays/)
- **Wireless Protocols** in [`05-Communication/`](../05-Communication/)
- **Complete Builds** in [`06-Automation/`](../06-Automation/)

See [COOKBOOK.md](../COOKBOOK.md) for master recipe combinations!
