convert '2dClassroomAssetPackByStyloo/WallFloorDoor second version tiling/strokespritesheet20129.png' -alpha extract -threshold 10% -define connected-components:verbose=true -connected-components 8 -auto-level info:
convert '2dClassroomAssetPackByStyloo/WallFloorDoor second version tiling/strokespritesheet20121.png' -crop 248x145+454+55 floor.png
# convert '2dClassroomAssetPackByStyloo/WallFloorDoor second version tiling/strokespritesheet20121.png' -crop 248x201+74+740 -scale 50% wall_top.png
convert '2dClassroomAssetPackByStyloo/WallFloorDoor second version tiling/strokespritesheet20121.png' -crop 248x202+74+359 -scale 50% door.png
convert '2dClassroomAssetPackByStyloo/WallFloorDoor second version tiling/strokespritesheet20129.png' -crop 249x200+71+91 -scale 50% wall.png
