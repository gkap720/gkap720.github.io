#!/bin/bash
#464 × 268
cd ./public/images
for i in $(find . -name '*.jpg'); do
    echo "$i"
    convert $i -write mpr:img ${i%.*}.webp
    convert $i -write mpr:img -resize 464x268 ${i%.*}_small.webp 
    convert $i -write mpr:img -resize 1024x720 ${i%.*}_large.webp 
done
for i in $(find . -name '*.png'); do
    echo "$i"
    convert $i -write mpr:img ${i%.*}.webp
    convert $i -write mpr:img -resize 464x268 ${i%.*}_small.webp 
    convert $i -write mpr:img -resize 1024x720 ${i%.*}_large.webp 
done