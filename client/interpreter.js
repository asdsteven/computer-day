class Interpreter {
    constructor(controller, name, avatar) {
        this.controller = controller
        this.scene = controller.scene;
        this.state = 'idle';
        const { add } = this.scene;
        this.player = new Player(controller, { name: name, avatar: avatar }, true);
        this.start = add.image(0, 0, 'start').setOrigin(1, 0).setDepth(9999)
                        .setInteractive()
        this.start.on('pointerdown', async () => {
            if (this.state != 'idle' || this.player.solved()) {
                return;
            }
            this.state = 'running';
            this.opcodes = Blockly.OpCode.greenFlagToCode();
            this.player.reset();
            this.start.disableInteractive().setAlpha(0.5);
            this.stop.setInteractive().setAlpha(1);
            const f = () => { this.state = 'stopping'; };
            workspace.addChangeListener(f);
            try {
                await this.execute();
            } catch (e) {
                console.log(e);
            }
            this.state = 'idle';
            workspace.removeChangeListener(f);
            this.start.setInteractive().setAlpha(1);
            this.stop.disableInteractive().setAlpha(0.5);
            if (this.player.solved()) {
                controller.interrupts.solved?.();
            }
        });
        this.stop = add.image(0, 60, 'stop').setOrigin(1, 0).setDepth(9999)
                       .setAlpha(0.5)
        this.stop.on('pointerdown', () => {
            if (this.state != 'running') {
                return;
            }
            this.state = 'stopping';
        });
    }

    destroy() {
        this.player.destroy();
        this.start.destroy();
        this.stop.destroy();
    }

    initLevel(level) {
        const { info, blocks, answer } = levels[level];
        this.start.x = (worldWidth - info.roomWidth) / 2 - 10;
        this.start.y = (worldHeight - info.roomHeight) / 2;
        this.start.setVisible(true);
        this.stop.x = (worldWidth - info.roomWidth) / 2 - 10;
        this.stop.y = (worldHeight - info.roomHeight) / 2 + 60;
        this.stop.setVisible(true);
        this.player.initLevel(level);
        workspace.clear();
        if (blocks) {
            Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(blocks), workspace);
            workspace.updateToolbox('<xml><block type="control_repeat"><value name="TIMES"><shadow type="math_whole_number"><field name="NUM">4</field></shadow></value></block></xml>');
        } else {
            Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom('<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" deletable="false" movable="false" x="10" y="30"></block></xml>'), workspace);
            workspace.updateToolbox('<xml><block type="forward"></block><block type="turn_left"></block><block type="turn_right"></block><block type="control_repeat"><value name="TIMES"><shadow type="math_whole_number"><field name="NUM">4</field></shadow></value></block></xml>');
        }
    }

    readId(i) {
        let id = '';
        // opcodes[i] == '"'
        for (i++; this.opcodes[i] != '"'; i++) {
            id += this.opcodes[i];
        }
        return [i + 1, id];
    }

    readInt(i) {
        let digits = '';
        while (/\d/.test(this.opcodes[i])) {
            digits += this.opcodes[i];
            i++;
        }
        const n = parseInt(digits);
        return [i, n];
    }

    async execute() {
        const delay = ms => this.controller.delay(ms);
        const readAndGlow = async (i, p) => {
            const [j, id] = this.readId(i);
            if (workspace.getBlockById(id)) {
                workspace.glowBlock(id, true);
            }
            await p;
            if (workspace.getBlockById(id)) {
                workspace.glowBlock(id, false);
            }
            await delay(100);
            return j;
        };
        const stack = [];
        for (let i = 0; i < this.opcodes.length && this.state != 'stopping' && !this.player.solved(); ) {
            const c = this.opcodes[i];
            if (c == '#') {
                i = await readAndGlow(i + 1, delay(250));
            } else if (c == '^') {
                i = await readAndGlow(i + 1, this.player.forward());
            } else if (c == '<') {
                i = await readAndGlow(i + 1, this.player.turn(-1));
            } else if (c == '>') {
                i = await readAndGlow(i + 1, this.player.turn(1));
            } else if (c == '(') {
                const [begin, n] = this.readInt(i + 1);
                i = await readAndGlow(begin, delay(125));
                stack.push([begin, n]);
            } else if (c == ')') {
                const [begin, n] = stack.pop();
                if (n == 1) {
                    // done repeating
                    await delay(1);
                    i++;
                } else {
                    i = await readAndGlow(begin, delay(125));
                    stack.push([begin, n - 1]);
                }
            }
        }
    }
}
