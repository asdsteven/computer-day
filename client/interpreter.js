class Interpreter {
    constructor(player, start, stop) {
        this.player = player;
        this.running = false;
        this.shouldStop = false;
        this.start = start;
        this.stop = stop;
        this.onSolved = [];
        start.on('pointerdown', async () => {
            if (this.running || this.player.solved()) {
                return;
            }
            this.running = true
            this.shouldStop = false;
            this.opcodes = Blockly.OpCode.greenFlagToCode();
            this.player.reset();
            start.disableInteractive().setAlpha(0.5);
            stop.setInteractive().setAlpha(1);
            const f = () => { this.shouldStop = true; };
            workspace.addChangeListener(f);
            try {
                await this.execute();
            } catch (e) {
                console.log(e);
            }
            this.running = false;
            workspace.removeChangeListener(f);
            start.setInteractive().setAlpha(1);
            stop.disableInteractive().setAlpha(0.5);
            if (this.player.solved()) {
                this.onSolved.forEach(f => f());
            }
        });
        stop.on('pointerdown', () => {
            this.shouldStop = true;
        });
    }

    destroy() {
        this.player.sprite.destroy();
        this.start.destroy();
        this.stop.destroy();
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

    async solved() {
        await new Promise(resolve => {
            this.onSolved.push(resolve);
        });
    }

    async execute() {
        const delay = ms => this.player.sprite.scene.delay(ms);
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
        for (let i = 0; i < this.opcodes.length && !this.shouldStop && !this.player.solved(); ) {
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
