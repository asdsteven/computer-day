class Interpreter {
    constructor(player, opcodes) {
        this.player = player;
        this.opcodes = opcodes
    }

    stop() {
        this.shouldStop = true;
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
        for (let i = 0; i < this.opcodes.length && !this.shouldStop; ) {
            const c = this.opcodes[i];
            if (c == '#') {
                i = await readAndGlow(i + 1, delay(300));
            } else if (c == '^') {
                i = await readAndGlow(i + 1, this.player.forward());
            } else if (c == '<') {
                i = await readAndGlow(i + 1, this.player.turn(-1));
            } else if (c == '>') {
                i = await readAndGlow(i + 1, this.player.turn(1));
            } else if (c == '(') {
                const [begin, n] = this.readInt(i + 1);
                i = await readAndGlow(begin, delay(300));
                stack.push([begin, n]);
            } else if (c == ')') {
                const [begin, n] = stack.pop();
                if (n == 1) {
                    // done repeating
                    await delay(1);
                    i++;
                } else {
                    i = await readAndGlow(begin, delay(300));
                    stack.push([begin, n - 1]);
                }
            }
        }
    }
}
