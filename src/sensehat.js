const senseLeds = require('sense-hat-led');

class SenseHat {
    printPanel(panel) {
        senseLeds.setPixels(panel);
    }
}

module.exports = SenseHat;