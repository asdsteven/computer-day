# https://opengameart.org/content/grass-tileset-16x16
# https://styloo.itch.io/2dclassroom

classroom() {
    cd 2dClassroomAssetPackByStyloo
    convert 'WallFloorDoorWstroke/WallFloorDoorW second spritesheet 1.png' \
            -alpha extract -threshold 10% \
            -define connected-components:verbose=true -connected-components 8 \
            -auto-level info:
    convert 'WallFloorDoor second version tiling/strokespritesheet20121.png' \
            -crop 248x145+454+55 -scale 50% ../floor.png
    # convert 'WallFloorDoor second version tiling/strokespritesheet20121.png' \
    #         -crop 248x145+62+55  floor2.png
    # convert 'WallFloorDoor second version tiling/strokespritesheet20121.png' \
    #         -crop 248x200+74+360 -scale 50% ../door.png
    # convert 'WallFloorDoor second version tiling/strokespritesheet20129.png' \
    #         -crop 248x200+72+91  -scale 50% ../wall.png
    convert 'WallFloorDoorWstroke/Wallfloordoorw First Spritesheet 1.png' \
            -crop 248x208+74+352 -scale 25% ../door.png
    convert 'WallFloorDoorWstroke/WallFloorDoorW second spritesheet 1.png' \
            -crop 248x208+72+84 -scale 25% ../wall.png
    convert 'WallFloorDoorWstroke/Wallfloordoorw First Spritesheet 3.png' \
            -crop 8x144+194+665 -scale 25% ../wall-side.png
    convert 'WallFloorDoorWstroke/Wallfloordoorw First Spritesheet 3.png' \
            -crop 8x348+194+664 -scale 25% ../wall-side-bottom.png
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
            -draw "roundrectangle 0,0 30,30 5,5" \
            \( stop.svg -resize 20x20 \) \
            -gravity center -composite stop.png
    convert -size 30x30 xc:transparent -fill white -stroke transparent \
            -draw "roundrectangle 0,0 30,30 5,5" \
            \( ../scratch-blocks/media/green-flag.svg -resize 20x20 \) \
            -gravity center -composite start.png
}

classroom
grass
buttons
