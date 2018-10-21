const senseLeds = require('sense-hat-led');

export class SenseHat {
    printPanel = (panel) => {
        senseLeds.setPixels(panel);
    }
}