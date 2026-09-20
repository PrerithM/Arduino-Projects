# ⚡ 01. Fundamentals of Arduino

> Master the foundational building blocks of microcontrollers: digital inputs/outputs, analog readings, pulse-width modulation (PWM), hardware interrupts, hardware timers, and UART serial communication.

---

## 📚 Modules & Recipes in this Category

| Project / Module                                                             | Description                                                                                                                                  | Sketch File                                                                    | Interactive Web Lab |
| :--------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------- | :------------------ |
| [Digital Input / Output (Pushbutton &amp; LED)](./Digital-IO/)                | Control electronic states (HIGH/LOW) to read pushbuttons with internal pullups and switch LEDs on and off with debouncing.                   | [`digital_io.ino`](./Digital-IO/digital_io.ino)                               | [⚡ Open Lab ↗](./Digital-IO/index.html) |
| [Analog Input / Output (Potentiometer &amp; Voltage Mapping)](./Analog-IO/)   | Read continuous real-world voltage levels using the 10-bit Analog-to-Digital Converter (ADC) and convert raw values to volts and percentage. | [`analog_io.ino`](./Analog-IO/analog_io.ino)                                  | [⚡ Open Lab ↗](./Analog-IO/index.html) |
| [Pulse Width Modulation (PWM Fading &amp; Motor Speed)](./PWM/)               | Simulate analog output voltages on digital pins by rapidly pulsing square waves with variable duty cycles.                                   | [`pwm.ino`](./PWM/pwm.ino)                                                    | [⚡ Open Lab ↗](./PWM/index.html) |
| [Hardware Interrupts (Zero-Latency Event Handling)](./Interrupts/)            | Trap critical hardware events instantaneously without polling or missing microsecond-level triggers.                                         | [`interrupts.ino`](./Interrupts/interrupts.ino)                               | [⚡ Open Lab ↗](./Interrupts/index.html) |
| [Hardware Timers &amp; Non-Blocking State Machines](./Timers/)                | Eliminate delay() completely to run multiple simultaneous tasks concurrently on single-core microcontrollers.                                | [`timers.ino`](./Timers/timers.ino)                                           | [⚡ Open Lab ↗](./Timers/index.html) |
| [Serial Communication (UART Command Line Interface)](./Serial-Communication/) | Transmit telemetry, parse incoming ASCII commands, and control your Arduino in real-time from your computer terminal.                        | [`serial_communication.ino`](./Serial-Communication/serial_communication.ino) | [⚡ Open Lab ↗](./Serial-Communication/index.html) |

---

## 🍳 How to Combine this Category

This category provides core modular building blocks. Pair any module in this directory with:

- **Inputs & Sensors** in [`02-Sensors/`](../02-Sensors/)
- **Outputs & Actuators** in [`03-Actuators/`](../03-Actuators/)
- **Visual Displays** in [`04-Displays/`](../04-Displays/)
- **Wireless Protocols** in [`05-Communication/`](../05-Communication/)
- **Complete Builds** in [`06-Automation/`](../06-Automation/)
