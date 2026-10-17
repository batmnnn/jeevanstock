#!/usr/bin/env bash
# Loudness-normalise the two renders and join them into the merged cut.
set -euo pipefail
cd "$(dirname "$0")/../out"
norm() { ffmpeg -y -loglevel error -i "$1" -c:v copy -af loudnorm=I=-16:TP=-1.5:LRA=11 -c:a aac -b:a 192k -ar 48000 "$2"; }
norm launch-raw.mp4 jeevanstock-launch.mp4
norm demo-raw.mp4 jeevanstock-demo.mp4
ffmpeg -y -loglevel error -i jeevanstock-launch.mp4 -f lavfi -i "color=c=0x07090f:s=1920x1080:r=30:d=0.6" -f lavfi -i "anullsrc=r=48000:cl=stereo:d=0.6" -i jeevanstock-demo.mp4 \
  -filter_complex "[0:v][0:a][1:v][2:a][3:v][3:a]concat=n=3:v=1:a=1[v][a]" -map "[v]" -map "[a]" \
  -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart jeevanstock-full.mp4
for f in jeevanstock-launch.mp4 jeevanstock-demo.mp4 jeevanstock-full.mp4; do
  printf '%s %ss\n' "$f" "$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")"
done
