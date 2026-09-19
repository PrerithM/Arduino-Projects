# ⚙️ 03. Actuators & Physical Movement

> Bring hardware to life: drive multi-channel LEDs, position micro-servos with precision, spin high-torque DC motors, step precision stepper motors, switch AC relays, and play musical frequencies on piezo buzzers.

---

## 📚 Modules & Recipes in this Category

| Project / Module | Description | Sketch File |
| :--- | :--- | :--- |
| [LED Sequences & Addressable WS2812B NeoPixels](./LEDs/) | Create visual indicators, traffic light sequences, and control millions of colors with single-wire addressable RGB LEDs. | [`leds.ino`](./LEDs/leds.ino) |
| [Precision RC Servo Motor Control (SG90 / MG996R)](./Servo/) | Position mechanical arms, steering linkages, and camera gimbals with exact degree control from 0° to 180°. | [`servo_control.ino`](./Servo/servo_control.ino) |
| [DC Motor Speed & Direction Control (L298N / L293D H-Bridge)](./DC-Motors/) | Drive high-current DC gearmotors with bi-directional rotation and PWM speed regulation. | [`dc_motor.ino`](./DC-Motors/dc_motor.ino) |
| [Stepper Motor Precision Stepping (28BYJ-48 & ULN2003)](./Stepper-Motors/) | Achieve exact rotational indexing, CNC positioning, and 3D printer axis movements with zero cumulative error. | [`stepper_motor.ino`](./Stepper-Motors/stepper_motor.ino) |
| [Electromechanical Relay Switching (High-Voltage AC Control)](./Relays/) | Safely switch high-voltage mains AC appliances (120V/240V lamps, fans, heaters) with galvanic optocoupler isolation. | [`relay_control.ino`](./Relays/relay_control.ino) |
| [Audio Tones & Melodies (Active vs Passive Piezo Buzzers)](./Buzzers/) | Generate musical chimes, alarm sirens, and audio UI alerts with piezo tone frequencies. | [`buzzer_tones.ino`](./Buzzers/buzzer_tones.ino) |

---

## 🍳 How to Combine this Category

This category provides core modular building blocks. Pair any module in this directory with:
- **Inputs & Sensors** in [`02-Sensors/`](../02-Sensors/)
- **Outputs & Actuators** in [`03-Actuators/`](../03-Actuators/)
- **Visual Displays** in [`04-Displays/`](../04-Displays/)
- **Wireless Protocols** in [`05-Communication/`](../05-Communication/)
- **Complete Builds** in [`06-Automation/`](../06-Automation/)

See [COOKBOOK.md](../COOKBOOK.md) for master recipe combinations!
