const tileWidth = 62;
const tileHeight = 62;
const worldWidth = tileWidth * 36;
const worldHeight = tileHeight * 27;

const levels = [
    {
        difficulty: 0,
        tiles: [ '  R OG'
               , 'EO Y B'
               , '      '
               , 'X  XXX'
        ]
    },
    {
        difficulty: 0,
        tiles: [ '  R OG'
               , 'EO Y B'
               , '      '
               , 'X  XXX'
        ],
        done: true
    },
    {
        difficulty: 1,
        tiles: [ '  R OG'
               , 'EO Y B'
               , '      '
               , 'X  XXX'
        ]
    },
    {
        difficulty: 1,
        tiles: [ '  R OG'
               , 'EO Y B'
               , '      '
               , 'X  XXX'
        ],
        done: true
    },
    {
        difficulty: 2,
        tiles: [ '  R OG'
               , 'EO Y B'
               , '      '
               , 'X  XXX'
        ]
    },
    {
        difficulty: 2,
        tiles: [ '  R OG'
               , 'EO Y B'
               , '      '
               , 'X  XXX'
        ],
        done: true
    },
    {
        difficulty: 3,
        tiles: [ '  R OG'
               , 'EO Y B'
               , '      '
               , 'X  XXX'
        ]
    },
    {
        difficulty: 3,
        tiles: [ '  R OG'
               , 'EO Y B'
               , '      '
               , 'X  XXX'
        ],
        done: true
    }
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
