'use strict';

const motionBlock = (id, svg) => {
    Blockly.Blocks[id] = {
        init: function() {
            this.jsonInit({
                "id": id,
                "message0": "%1",
                "args0": [
                    {
                        "type": "field_image",
                        "src": "assets/" + svg,
                        "width": 40,
                        "height": 40,
                        "alt": id
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
};
motionBlock('forward', 'shoe-prints-solid.svg');
motionBlock('turn_left', 'arrow-rotate-left-solid.svg');
motionBlock('turn_right', 'arrow-rotate-right-solid.svg');

Blockly.OpCode = new Blockly.Generator('OpCode');
Blockly.OpCode.INDENT = '';
Blockly.OpCode.scrub_ = function(block, code, opt_thisOnly) {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    const nextCode = opt_thisOnly ? '' : Blockly.OpCode.blockToCode(nextBlock);
    return code + nextCode;
};
Blockly.OpCode['event_whenflagclicked'] = function(block) {
    return `#"${block.id}"`;
};
Blockly.OpCode['forward'] = function(block) {
    return `^"${block.id}"`;
};
Blockly.OpCode['turn_left'] = function(block) {
    return `<"${block.id}"`;
};
Blockly.OpCode['turn_right'] = function(block) {
    return `>"${block.id}"`;
};
Blockly.OpCode['math_whole_number'] = function(block) {
    return [String(Number(block.getFieldValue('NUM'))), 0];
};
Blockly.OpCode['control_repeat'] = function(block) {
    // Repeat n times.
    if (block.getField('TIMES')) {
        // Internal number.
        var repeats = String(Number(block.getFieldValue('TIMES')));
    } else {
        // External number.
        var repeats = Blockly.OpCode.valueToCode(block, 'TIMES', 0);
    }
    var branch = Blockly.OpCode.statementToCode(block, 'SUBSTACK');
    return `(${repeats}"${block.id}"${branch})`;
};
Blockly.OpCode.greenFlagToCode = function() {
    const workspace = Blockly.getMainWorkspace();
    const greenFlag = workspace.getBlockById('event_whenflagclicked');
    return Blockly.OpCode.blockToCode(greenFlag);
};

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

const greenFlag = workspace.newBlock('event_whenflagclicked', 'event_whenflagclicked');
greenFlag.setMovable(false);
greenFlag.setDeletable(false);
greenFlag.initSvg();
greenFlag.render();
greenFlag.moveBy(10, 30);
