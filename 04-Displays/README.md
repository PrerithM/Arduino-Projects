# 🖥️ 04. Displays & Visual Feedback

> Visualize status, sensor telemetry, and interactive menus using alphanumeric 16x2 I2C LCDs, bright 4-digit 7-segment LED displays, and the PC Serial Plotter/Monitor.

---

## 📚 Modules & Recipes in this Category

| Project / Module | Description | Sketch File |
| :--- | :--- | :--- |
| [Alphanumeric 16x2 LCD Display (I2C Backpack)](./LCD/) | Display clear text, sensor readings, and custom pixel icons using just 2 I2C wires instead of 16 parallel pins. | [`lcd_display.ino`](./LCD/lcd_display.ino) |
| [4-Digit 7-Segment Display (TM1637 Driver)](./7-Segment/) | Display bright numeric clocks, stopwatches, sensor values, and counter meters visible from across the room. | [`seven_segment.ino`](./7-Segment/seven_segment.ino) |
| [Serial Monitor & Real-Time Waveform Plotter](./Serial-Monitor/) | Visualize live mathematical waveforms, multiple sensor channels, and real-time filtering curves directly in the IDE. | [`serial_monitor.ino`](./Serial-Monitor/serial_monitor.ino) |

---

## 🍳 How to Combine this Category

This category provides core modular building blocks. Pair any module in this directory with:
- **Inputs & Sensors** in [`02-Sensors/`](../02-Sensors/)
- **Outputs & Actuators** in [`03-Actuators/`](../03-Actuators/)
- **Visual Displays** in [`04-Displays/`](../04-Displays/)
- **Wireless Protocols** in [`05-Communication/`](../05-Communication/)
- **Complete Builds** in [`06-Automation/`](../06-Automation/)

See [COOKBOOK.md](../COOKBOOK.md) for master recipe combinations!
