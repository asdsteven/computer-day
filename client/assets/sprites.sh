# https://opengameart.org/content/grass-tileset-16x16
# https://styloo.itch.io/2dclassroom
# Raw assets:
# quick-track.png
# grass_tileset_16x16.png
# stop.svg
# shoe-prints-solid.svg
# arrow-rotate-left-solid.svg
# arrow-rotate-right-solid.svg
# lpc-*.png

classroom() {
    cd 2dClassroomAssetPackByStyloo
    convert 'Classroom/Classroom First Spritesheet 1.png' \
            -alpha extract -threshold 0% \
            -define connected-components:verbose=true -connected-components 8 \
            -auto-level info:
    convert 'WallFloorDoor second version tiling/strokespritesheet20121.png' \
            -crop 248x144+454+55 -scale 25% ../floor.png
    # convert 'WallFloorDoor second version tiling/strokespritesheet20121.png' \
    #         -crop 248x145+62+55  floor2.png
    # convert 'WallFloorDoor second version tiling/strokespritesheet20121.png' \
    #         -crop 248x200+74+360 -scale 50% ../door.png
    # convert 'WallFloorDoor second version tiling/strokespritesheet20129.png' \
    #         -crop 248x200+72+91  -scale 50% ../wall.png
    convert 'WallFloorDoorWstroke/Wallfloordoorw First Spritesheet 1.png' \
            -crop 124x208+136+352 -scale 25% ../door.png
    convert \( 'WallFloorDoorWstroke/WallFloorDoorW second spritesheet 1.png' \
            -crop 248x208+72+84 -scale 25% \) \
            \( 'WallFloorDoorWstroke/Wallfloordoorw First Spritesheet 1.png' \
            -crop 124x208+74+734 -scale 25% \) \
            +append ../wall0.png
    convert \( 'WallFloorDoorWstroke/Wallfloordoorw First Spritesheet 1.png' \
            -crop 124x208+74+734 -scale 25% \) \
            \( 'WallFloorDoorWstroke/WallFloorDoorW second spritesheet 1.png' \
            -crop 248x208+72+84 -scale 25% \) \
            +append ../wall1.png
    convert 'WallFloorDoorWstroke/Wallfloordoorw First Spritesheet 3.png' \
            -crop 8x144+194+665 -scale 25% ../wall-side.png
    convert 'WallFloorDoorWstroke/Wallfloordoorw First Spritesheet 3.png' \
            -crop 8x348+194+664 -scale 25% ../wall-side-bottom.png
    convert 'Classroom/Classroom First Spritesheet 1.png' \
            -crop 135x125+44+666 -scale 20% ../desk.png
    cd ..
}

lpc() {
    for i in raw-*.png
    do
        convert $i -crop 576x256+0+512 ${i##raw-}
    done
}

grass() {
    convert grass_tileset_16x16.png -crop 144x144+0+0 grass.png
}

buttons() {
    convert -size 30x30 xc:transparent -fill white -stroke transparent \
            -draw "roundrectangle 0,0 29,29 5,5" \
            \( stop.svg -resize 20x20 \) \
            -gravity center -composite stop.png
    convert -size 30x30 xc:transparent -fill white -stroke transparent \
            -draw "roundrectangle 0,0 29,29 5,5" \
            \( ../scratch-blocks/media/green-flag.svg -resize 20x20 \) \
            -gravity center -composite start.png
}

colortiles() {
    convert -size 29x29 xc:none \
        -fill "#DC464680" -stroke "#A53232D0" -strokewidth 2 \
        -draw "roundrectangle 0,0 28,28 5,5" colortileR.png
    convert -size 29x29 xc:none \
        -fill "#3CB45080" -stroke "#246B32D0" -strokewidth 2 \
        -draw "roundrectangle 0,0 28,28 5,5" colortileG.png
    convert -size 29x29 xc:none \
        -fill "#508CE680" -stroke "#2C5BB7D0" -strokewidth 2 \
        -draw "roundrectangle 0,0 28,28 5,5" colortileB.png
    convert -size 29x29 xc:none \
        -fill "#F0DC6480" -stroke "#BFA235D0" -strokewidth 2 \
        -draw "roundrectangle 0,0 28,28 5,5" colortileY.png
}

classroom
grass
buttons
colortiles
