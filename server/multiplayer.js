const teacherRoom = new Map();
const playerRoom = new Map();
const rooms = {};

const { levelBegins } = require('../client/levels');
const { lpc } = require('../client/lpc');

[['1A', '2A'], ['3A', '3S', 'P4'], ['5A', '5S', '6A', '6S']].forEach((grade, i) => {
    for (const room of grade) {
        rooms[room] = {
            level: levelBegins[i + 1],
            players: {},
            struggling: new Set(),
            autoAdvance: true,
            advanceTimer: null
        };
    }
});

function onConnection(io, socket) {
    const shortId = socket.id.slice(0, 6);;
    console.log(shortId, 'connect');
    socket.on('disconnect', () => {
        if (teacherRoom.has(socket.id)) {
            const room = teacherRoom.get(socket.id);
            console.log(shortId, room, 'teacher perform leave');
            teacherRoom.delete(socket.id);
            return;
        }
        if (playerRoom.has(socket.id)) {
            const room = playerRoom.get(socket.id);
            const p = rooms[room].players[socket.id];
            console.log(shortId, room, 'player perform leave:', p.name);
            playerRoom.delete(socket.id);
            rooms[room].struggling.delete(socket.id)
            delete rooms[room].players[socket.id];
            socket.to(room).emit('leave', rooms[room].level, socket.id);
            return;
        }
        console.log(shortId, '  ', 'stranger perform leave');
    });
    const roleOn = (role, roleRoom, event, listener) => socket.on(event, (level, ...args) => {
        if (!roleRoom.has(socket.id)) {
            console.log(shortId, '  ', `error: ${role} perform ${event}: stranger`);
            args.at(-1)({
                ok: false,
                msg: 'stranger'
            });
            return;
        }
        const room = roleRoom.get(socket.id);
        if (level != rooms[room].level) {
            console.log(shortId, room, `error: ${role} perform ${event}: level differ:`, rooms[room].level, level);
            args.at(-1)({
                ok: false,
                msg: 'level differ',
                level: rooms[room].level
            });
            return;
        }
        args.at(-1)(listener(room, level, ...args));
    });
    const teacherOn = (event, listener) => roleOn('teacher', teacherRoom, event, listener);
    const playerOn = (event, listener) => roleOn('player', playerRoom, event, listener)
    const cancelAdvance = room => {
        if (!rooms[room].advanceTimer) {
            return;
        }
        console.log(shortId, room, 'cancel: server perform advance');
        clearTimeout(rooms[room].advanceTimer);
        rooms[room].advanceTimer = null;
    };
    const allStruggling = room => {
        for (const id in rooms[room].players) {
            rooms[room].struggling.add(id);
        }
    };

    socket.on('teach', (room, callback) => {
        if (!rooms[room]) {
            console.log(shortId, '  ', 'error: teacher perform join: lost:', room);
            // This is malicious.  Not doing callback.
            return;
        }
        if (teacherRoom.has(socket.id)) {
            const prevRoom = teacherRoom.get(socket.id);
            console.log(shortId, prevRoom, 'teacher perform teach:', room);
            socket.leave(prevRoom);
        } else {
            console.log(shortId, '  ', 'teacher perform teach:', room);
        }
        teacherRoom.set(socket.id, room);
        socket.join(room);
        callback({
            level: rooms[room].level,
            players: rooms[room].players
        });
    });
    teacherOn('skip', room => {
        const level = ++rooms[room].level;
        console.log(shortId, room, 'teacher perform skip:', level);
        rooms[room].autoAdvance = true;
        cancelAdvance(room);
        allStruggling(room);
        io.to(room).emit('level', level);
        return { ok: true };
    });
    teacherOn('stay', room => {
        console.log(shortId, room, 'teacher perform stay');
        rooms[room].autoAdvance = false;
        cancelAdvance(room)
        return { ok: true };
    });

    socket.on('join', (room, name, avatar, callback) => {
        if (playerRoom.has(socket.id)) {
            console.log(shortId, playerRoom.get(socket.id), 'error: player perform join: resident:', name, room);
            // This is malicious.  Not doing callback.
            return;
        }
        if (!rooms[room]) {
            console.log(shortId, '  ', 'error: player perform join: lost:', name, room);
            // This means student accessed with wrong url.
            callback({
                ok: false,
                msg: `lost: ${room}`
            });
            return;
        }
        console.log(shortId, room, 'player perform join:', name, lpc[avatar]);
        playerRoom.set(socket.id, room);
        socket.join(room);
        socket.to(room).emit('join', rooms[room].level, socket.id, name, avatar);
        callback({
            ok: true,
            level: rooms[room].level,
            players: rooms[room].players
        });
        rooms[room].players[socket.id] = {
            name: name,
            avatar: avatar
        };
        rooms[room].struggling.add(socket.id);
        cancelAdvance(room);
    });
    playerOn('pardon', (room, level, id) => {
        const e = rooms[room].players[id];
        if (e) {
            return { ok: true, ...e };
        }
        return { ok: false, msg: `lost: ${id}` };
    });
    playerOn('solve', room => {
        rooms[room].struggling.delete(socket.id);
        if (rooms[room].struggling.size > 0 || !rooms[room].autoAdvance) {
            return;
        }
        console.log(shortId, room, 'server perform ready');
        io.to(room).emit('ready', rooms[room].level);
        rooms[room].advanceTimer = setTimeout(() => {
            const level = ++rooms[room].level;
            console.log(shortId, room, 'server perform advance:', level);
            allStruggling(room);
            io.to(room).emit('level', level);
        }, 10000);
        return { ok: true };
    });
    playerOn('forward', (room, level, row, col, dir) => {
        const p = rooms[room].players[socket.id];
        p.row = row;
        p.col = col;
        p.dir = dir;
        socket.to(room).emit('forward', level, socket.id, row, col, dir);
        return { ok: true };
    });
    playerOn('turn', (room, level, row, col, dir, ddir) => {
        const p = rooms[room].players[socket.id];
        p.row = row;
        p.col = col;
        p.dir = dir;
        socket.to(room).emit('turn', level, socket.id, row, col, dir, ddir);
        return { ok: true };
    });
    playerOn('wander', (room, level, x, y) => {
        const p = rooms[room].players[socket.id];
        p.x = x;
        p.y = y;
        socket.to(room).emit('wander', level, socket.id, x, y);
        return { ok: true };
    });
}

module.exports = { onConnection };
