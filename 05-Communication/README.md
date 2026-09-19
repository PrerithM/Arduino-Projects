# 🌐 05. Communication & Networking Protocols

> Connect microcontrollers together and link your projects to smartphones and the internet using UART, I2C, SPI, Bluetooth, and Wi-Fi.

---

## 📚 Modules & Recipes in this Category

| Project / Module | Description | Sketch File |
| :--- | :--- | :--- |
| [SoftwareSerial & Dual Microcontroller UART](./UART/) | Establish point-to-point serial communication between two Arduino boards using bit-banged SoftwareSerial pins. | [`uart_softwareserial.ino`](./UART/uart_softwareserial.ino) |
| [I2C Bus Communication (Master-Slave Architecture)](./I2C/) | Connect up to 127 sensors, displays, and coprocessors over a simple 2-wire shared multi-drop synchronous bus. | [`i2c_bus.ino`](./I2C/i2c_bus.ino) |
| [High-Speed SPI Bus (Serial Peripheral Interface)](./SPI/) | Transfer data at blazing speeds (up to 8 Mbps on Arduino) for color TFT screens, SD cards, and radio transceivers. | [`spi_bus.ino`](./SPI/spi_bus.ino) |
| [Wireless Bluetooth Telemetry & Control (HC-05 / HC-06)](./Bluetooth/) | Connect your Arduino wirelessly to smartphones, laptops, and tablets over classic Bluetooth SPP (Serial Port Profile). | [`bluetooth_hc05.ino`](./Bluetooth/bluetooth_hc05.ino) |
| [Wi-Fi & IoT Cloud Telemetry (ESP8266 / ESP32)](./WiFi/) | Connect your hardware to the local Wi-Fi network to stream live telemetry to IoT cloud dashboards and receive webhook commands. | [`wifi_iot.ino`](./WiFi/wifi_iot.ino) |

---

## 🍳 How to Combine this Category

This category provides core modular building blocks. Pair any module in this directory with:
- **Inputs & Sensors** in [`02-Sensors/`](../02-Sensors/)
- **Outputs & Actuators** in [`03-Actuators/`](../03-Actuators/)
- **Visual Displays** in [`04-Displays/`](../04-Displays/)
- **Wireless Protocols** in [`05-Communication/`](../05-Communication/)
- **Complete Builds** in [`06-Automation/`](../06-Automation/)

See [COOKBOOK.md](../COOKBOOK.md) for master recipe combinations!
