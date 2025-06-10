const tileWidth = 62;
const tileHeight = 62;
const worldWidth = tileWidth * 36;
const worldHeight = tileHeight * 27;

const levels = [
    {
        difficulty: 0,
        hint: 'Can she get out of the classroom?',
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" deletable="false" movable="false" x="10" y="30"><next><block type="forward"><next><block type="forward"><next><block type="forward"></block></next></block></next></block></next></block></xml>',
        tiles: [ 'S     '
               , '      '
               , 'X     '
        ]
    },
    {
        difficulty: 0,
        hint: 'Make a turn',
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" deletable="false" movable="false" x="10" y="30"><next><block type="turn_right"><next><block type="forward"><next><block type="forward"><next><block type="forward"></block></next></block></next></block></next></block></next></block></xml>',
        tiles: [ 'E     '
               , '      '
               , 'X     '
        ]
    },
    {
        difficulty: 0,
        hint: 'Make a big turn',
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" deletable="false" movable="false" x="10" y="30"><next><block type="forward"><next><block type="forward"><next><block type="turn_right"><next><block type="forward"><next><block type="forward"><next><block type="forward"></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>',
        tiles: [ 'E     '
               , '      '
               , '  X   '
        ]
    },
    {
        difficulty: 0,
        hint: 'Either exits are fine',
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" deletable="false" movable="false" x="10" y="30"><next><block type="turn_right"><next><block type="forward"><next><block type="forward"><next><block type="forward"></block></next></block></next></block></next></block></next></block></xml>',
        tiles: [ 'E     '
               , '      '
               , 'X X   '
        ]
    },
    {
        difficulty: 0,
        hint: 'Turn behind',
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" deletable="false" movable="false" x="10" y="30"><next><block type="turn_right"><next><block type="turn_right"><next><block type="forward"><next><block type="forward"><next><block type="forward"><next><block type="turn_left"><next><block type="forward"><next><block type="forward"><next><block type="forward"></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>',
        tiles: [ '   E  '
               , '      '
               , 'X     '
        ]
    },
    {
        difficulty: 0,
        hint: 'Desks would block the way',
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" deletable="false" movable="false" x="10" y="30"><next><block type="turn_left"><next><block type="forward"><next><block type="turn_right"><next><block type="control_repeat"><statement name="SUBSTACK"><block type="forward"></block></statement><value name="TIMES"><shadow type="math_whole_number"><field name="NUM">3</field></shadow></value><next><block type="turn_right"><next><block type="forward"><next><block type="turn_left"><next><block type="forward"></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>',
        tiles: [ 'S     '
               , 'O     '
               , '      '
               , 'X     '
        ]
    },
    {
        difficulty: 0,
        hint: 'Only one forward / turn block is allowed',
        blocks: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" deletable="false" movable="false" x="10" y="30"><next><block type="forward" deletable="false"><next><block type="turn_left" deletable="false"><next><block type="turn_right" deletable="false"></block></next></block></next></block></next></block></xml>',
        tiles: [ 'S   '
               , '    '
               , '    '
               , 'X   '
        ]
    },
    {
        difficulty: 0,
        hint: 'You have completed the introduction!',
        tiles: [ 'S'
               , ' '
               , 'X'
        ],
    },
    {
        difficulty: 0,
        hint: 'You have completed the introduction!',
        tiles: [ 'S'
               , ' '
               , 'X'
        ],
        done: true
    },
    {
        difficulty: 1,
        hint: 'Only one forward / turn block is allowed',
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" deletable="false" movable="false" x="10" y="30"><next><block type="control_repeat"><statement name="SUBSTACK"><block type="control_repeat"><statement name="SUBSTACK"><block type="forward" deletable="false"></block></statement><value name="TIMES"><shadow type="math_whole_number"><field name="NUM">4</field></shadow></value><next><block type="turn_right" deletable="false"></block></next></block></statement><value name="TIMES"><shadow type="math_whole_number"><field name="NUM">4</field></shadow></value></block></next></block><block type="turn_left" deletable="false" x="435" y="108"></block></xml>',
        blocks: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" deletable="false" movable="false" x="10" y="30"><next><block type="forward" deletable="false"><next><block type="turn_left" deletable="false"><next><block type="turn_right" deletable="false"></block></next></block></next></block></next></block></xml>',
        tiles: [ 'E   '
               , '    '
               , '    '
               , '   X'
        ]
    },
    {
        difficulty: 1,
        hint: 'Only one forward / turn block is allowed',
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" deletable="false" movable="false" x="10" y="30"><next><block type="control_repeat"><statement name="SUBSTACK"><block type="control_repeat"><statement name="SUBSTACK"><block type="forward" deletable="false"></block></statement><value name="TIMES"><shadow type="math_whole_number"><field name="NUM">10</field></shadow></value><next><block type="turn_right" deletable="false"></block></next></block></statement><value name="TIMES"><shadow type="math_whole_number"><field name="NUM">4</field></shadow></value></block></next></block><block type="turn_left" deletable="false" x="141" y="100"></block></xml>',
        blocks: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" deletable="false" movable="false" x="10" y="30"><next><block type="forward" deletable="false"><next><block type="turn_left" deletable="false"><next><block type="turn_right" deletable="false"></block></next></block></next></block></next></block></xml>',
        tiles: [ 'E      '
               , '       '
               , '       '
               , '      X'
        ]
    },
    {
        difficulty: 1,
        hint: 'You have completed the level!',
        tiles: [ 'S'
               , ' '
               , 'X'
        ],
    },
    {
        difficulty: 1,
        hint: 'You have completed the level!',
        tiles: [ 'S'
               , ' '
               , 'X'
        ],
        done: true
    },
    {
        difficulty: 2,
        hint: 'You have completed the level!',
        tiles: [ 'S'
               , ' '
               , 'X'
        ],
    },
    {
        difficulty: 2,
        hint: 'You have completed the level!',
        tiles: [ 'S'
               , ' '
               , 'X'
        ],
        done: true
    },
    {
        difficulty: 3,
        hint: 'You have completed the level!',
        tiles: [ 'S'
               , ' '
               , 'X'
        ],
    },
    {
        difficulty: 3,
        hint: 'You have completed the level!',
        tiles: [ 'S'
               , ' '
               , 'X'
        ],
        done: true
    },
];
const levelBegins = [null, null, null, null];

for (const [i, level] of levels.entries()) {
    if (levelBegins[level.difficulty] == null) {
        levelBegins[level.difficulty] = i;
    }
    const tiles = level.tiles;
    const info = {};
    info.cols = tiles[0].length;
    info.rows = tiles.length;
    info.roomWidth = info.cols * tileWidth;
    info.roomHeight = info.rows * tileHeight;
    info.viewWidth = info.roomWidth + tileWidth * 4;
    info.viewHeight = info.roomHeight + tileHeight * 4;
    for (let r = 0; r < info.rows; r++) {
        for (let c = 0; c < info.cols; c++) {
            const t = tiles[r][c];
            if ('NESW'.includes(t)) {
                info.SR = r;
                info.SC = c;
                info.dir = 'NESW'.indexOf(t);
            }
        }
    }
    level.info = info;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { levelBegins };
}
