const tileWidth = 31;
const tileHeight = 31;

function parseTileInfo(tiles) {
    const m = {
        cols: tiles[0].length,
        rows: tiles.length,
        Xs: tiles.at(-1).split('X').map(x => x.length)
    };
    m.roomWidth = m.cols * tileWidth;
    m.roomHeight = m.rows * tileHeight;
    m.worldWidth = m.roomWidth * 3;
    m.worldHeight = m.roomHeight * 3;
    m.viewWidth = m.roomWidth + tileWidth * 4;
    m.viewHeight = m.roomHeight + tileHeight * 4;
    for (let r = 0; r < tiles.length; r++) {
        for (let c = 0; c < tiles[r].length; c++) {
            const t = tiles[r][c];
            if ('NESW'.includes(t)) {
                m.SR = r;
                m.SC = c;
                m.dir = 'NESW'.indexOf(t);
            }
        }
    }
    return m;
}

const levels = [
    {
        tiles: [ '  R OG'
               , 'EO Y B'
               , '      '
               , 'X  XXX'
        ]
    }
];
