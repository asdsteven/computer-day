class Interpreter {
    constructor(scene, opcodes) {
        this.scene = scene;
        this.opcodes = opcodes
    }

    async stop() {
        return new Promise(resolve => {
            this.onStop = resolve;
        });
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
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        const glowBlock = async (i, p) => {
            const [j, id] = this.readId(i);
            workspace.glowBlock(id, true);
            await p;
            workspace.glowBlock(id, false);
            await delay(100);
            return j;
        };
        const stack = [];
        for (let i = 0; i < this.opcodes.length; ) {
            if (this.onStop) {
                this.onStop();
                return false;
            }
            const c = this.opcodes[i];
            if (c == '#') {
                i = await glowBlock(i + 1, delay(300));
            } else if (c == '^') {
                i = await glowBlock(i + 1, this.scene.forward());
            } else if (c == '<') {
                i = await glowBlock(i + 1, this.scene.turn(-1));
            } else if (c == '>') {
                i = await glowBlock(i + 1, this.scene.turn(1));
            } else if (c == '(') {
                const [j, n] = this.readInt(i + 1);
                i = await glowBlock(j, delay(300));
                stack.push([i, n]);
            } else if (c == ')') {
                const [j, n] = stack.pop();
                if (n == 1) {
                    // done repeating
                    i++;
                } else {
                    stack.push([j, n - 1]);
                    i = j;
                }
            }
        }
        return true;
    }
}
