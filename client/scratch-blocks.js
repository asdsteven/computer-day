'use strict';

for (const dir of ['up','down','left','right']) {
    Blockly.Blocks['move_' + dir] = {
        init: function() {
            this.jsonInit({
                "id": "move_" + dir,
                "message0": "%1",
                "args0": [
                    {
                        "type": "field_image",
                        "src": "assets/arrow-" + dir + "-solid.svg",
                        "width": 40,
                        "height": 40,
                        "alt": "Move " + dir
                    }
                ],
                "inputsInline": true,
                "previousStatement": null,
                "nextStatement": null,
                "category": Blockly.Categories.motion,
                "colour": Blockly.Colours.motion.primary,
                "colourSecondary": Blockly.Colours.motion.secondary,
                "colourTertiary": Blockly.Colours.motion.tertiary,
                "colourQuaternary": Blockly.Colours.motion.quaternary
            });
        }
    };
}

const workspace = Blockly.inject('scratch-blocks', {
    collapse: false,
    comments: false,
    collapse: false,
    disable: true,
    media: 'scratch-blocks/media/',
    scrollbars: true,
    sounds: false,
    toolbox: document.getElementById('toolbox'),
    trashcan: true
});
