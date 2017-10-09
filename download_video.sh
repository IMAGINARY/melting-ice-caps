#!/bin/bash

TARGET_DIR=video

FILES=(
'https://imaginaryexhibits.s3.amazonaws.com/melting-ice-caps/video/md5sum.txt'
'https://imaginaryexhibits.s3.amazonaws.com/melting-ice-caps/video/elmerice_simulation.mp4'
'https://imaginaryexhibits.s3.amazonaws.com/melting-ice-caps/video/tl-hill.mp4'
)

if [ ! -d "$TARGET_DIR" ]; then
  echo "Targe directory ${TARGET_DIR} missing"
  exit;
fi

echo "Downloading video files:"
for f in "${FILES[@]}"
do
  echo "Downloading ${f}"
  cd $TARGET_DIR && { curl -O $f || exit $? ; } && cd -;
done

echo "Checking MD5 checksums"
cd $TARGET_DIR && { md5sum -c md5sum.txt || exit $? ; } && cd -;
