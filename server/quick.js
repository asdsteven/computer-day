let question = [];
const players = [];
const playerIndex = new Map();

function onConnection(io, socket) {
    console.log("Player connected:", socket.id);

    socket.on('newRound', newQuestion => {
        question = newQuestion;
        console.log(`newRound ${question}`);
        socket.broadcast.emit('newRound', question);
    });

    socket.on('join', (sprite, callback) => {
        for (let i = 0; ; i++) {
            if (i == players.length) {
                players.push({
                    progress: 0,
                    sprite: sprite
                });
                playerIndex.set(socket.id, i);
                break;
            }
            if (!players[i]) {
                players[i] = {
                    progress: 0,
                    sprite: sprite
                };
                playerIndex.set(socket.id, i);
                break;
            }
        }
        callback([players, playerIndex.get(socket.id), question]);
        socket.broadcast.emit('newPlayer', playerIndex.get(socket.id), sprite);
        console.log(`join at ${playerIndex.get(socket.id)}`);
        console.log(players);
    });
    socket.on("progress", progress => {
        const i = playerIndex.get(socket.id);
        players[i].progress = progress;
        console.log(`progress ${i} = ${progress}`);
        socket.broadcast.emit("progress", i, progress);
    });
    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);
        if (!playerIndex.has(socket.id)) {
            return;
        }
        const i = playerIndex.get(socket.id);
        playerIndex.delete(socket.id);
        players[i] = null;
        while (!players.at(-1)) {
            players.pop();
        }
        console.log(players);
        socket.broadcast.emit('deletePlayer', i);
    });
}

module.exports = { onConnection };
