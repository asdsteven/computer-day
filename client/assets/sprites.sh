classroom() {
    convert '2dClassroomAssetPackByStyloo/WallFloorDoor second version tiling/strokespritesheet20121.png' -alpha extract -threshold 10% -define connected-components:verbose=true -connected-components 8 -auto-level info:
    # convert '2dClassroomAssetPackByStyloo/WallFloorDoor second version tiling/strokespritesheet20121.png' -crop 248x201+74+740 -scale 50% wall_top.png
    convert '2dClassroomAssetPackByStyloo/WallFloorDoor second version tiling/strokespritesheet20121.png' -crop 248x145+454+55 floor.png
    convert '2dClassroomAssetPackByStyloo/WallFloorDoor second version tiling/strokespritesheet20121.png' -crop 248x145+62+55  floor2.png
    convert '2dClassroomAssetPackByStyloo/WallFloorDoor second version tiling/strokespritesheet20121.png' -crop 248x202+74+359 -scale 50% door.png
    convert '2dClassroomAssetPackByStyloo/WallFloorDoor second version tiling/strokespritesheet20129.png' -crop 249x200+71+91  -scale 50% wall.png
}

lpc() {
    convert lpc-raw.png -crop 576x256+0+512 -scale 200% lpc.png
}

buttons() {
    convert -size 60x60 xc:transparent -fill white -stroke transparent -draw "roundrectangle 0,0 60,60 10,10" \( stop.svg -resize 40x40 \) -gravity center -composite stop.png
    convert -size 60x60 xc:transparent -fill white -stroke transparent -draw "roundrectangle 0,0 60,60 10,10" \( ../scratch-blocks/media/green-flag.svg -resize 40x40 \) -gravity center -composite start.png
}

buttons
