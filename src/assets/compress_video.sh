#!/usr/bin/env bash

set -e

show_help() {
  cat <<EOF
FFmpeg size-target encoder (single-pass or 2-pass)

USAGE:
  $0 [options]

REQUIRED:
  -i, --input FILE            Input video file
  -o, --output FILE           Output video file
  -s, --size KB               Target output size in kilobytes

OPTIONAL:
  -f, --fps FPS               Output FPS (default: 30)
  -d, --downscale FACTOR      Scale factor (default: 1.0)
  --no-audio                  Remove audio track
  --single-pass               Use single-pass encoding (default: 2-pass)
  --in-codec CODEC            Input decoder (-vcodec)
  --out-codec CODEC           Output encoder (-c:v)

ADVANCED:
  --pass1-args "ARGS"         Extra ffmpeg args appended to pass 1
  --pass2-args "ARGS"         Extra ffmpeg args appended to pass 2

BEHAVIOR:
  - Prompts for missing values
  - Enter accepts defaults
  - Bitrate derived from target size
  - Pass logs auto-cleaned (2-pass)

EOF
}

# Track CLI-provided values
FPS_SET=0
SCALE_SET=0
AUDIO_SET=0
PASS1_ARGS_SET=0
PASS2_ARGS_SET=0
SINGLE_PASS=0

# Defaults
FPS_DEFAULT=30
SCALE_DEFAULT=1.0
REMOVE_AUDIO_DEFAULT="n"

# Parse CLI arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help) show_help; exit 0 ;;
    -i|--input) IN="$2"; shift 2 ;;
    -o|--output) OUT="$2"; shift 2 ;;
    -s|--size) TARGET_KB="$2"; shift 2 ;;
    -f|--fps) FPS="$2"; FPS_SET=1; shift 2 ;;
    -d|--downscale) SCALE="$2"; SCALE_SET=1; shift 2 ;;
    --no-audio) REMOVE_AUDIO="y"; AUDIO_SET=1; shift ;;
    --single-pass) SINGLE_PASS=1; shift ;;
    --in-codec) IN_VCODEC="$2"; shift 2 ;;
    --out-codec) OUT_VCODEC="$2"; shift 2 ;;
    --pass1-args) PASS1_ARGS="$2"; PASS1_ARGS_SET=1; shift 2 ;;
    --pass2-args) PASS2_ARGS="$2"; PASS2_ARGS_SET=1; shift 2 ;;
    *)
      echo "❌ Unknown option: $1"
      echo "Run --help for usage."
      exit 1
      ;;
  esac
done

echo "=== FFmpeg size-target encoder ==="

# Required prompts
[[ -z "$IN" ]] && read -rp "Input file: " IN
[[ -z "$OUT" ]] && read -rp "Output file: " OUT
[[ -z "$TARGET_KB" ]] && read -rp "Desired file size (kB): " TARGET_KB

# FPS
if [[ $FPS_SET -eq 0 ]]; then
  read -rp "Output FPS [default $FPS_DEFAULT]: " FPS
  FPS=${FPS:-$FPS_DEFAULT}
fi

# Scale
if [[ $SCALE_SET -eq 0 ]]; then
  read -rp "Downscale factor [default $SCALE_DEFAULT]: " SCALE
  SCALE=${SCALE:-$SCALE_DEFAULT}
fi

# Audio
if [[ $AUDIO_SET -eq 0 ]]; then
  read -rp "Remove audio track? (y/n) [default $REMOVE_AUDIO_DEFAULT]: " REMOVE_AUDIO
  REMOVE_AUDIO=${REMOVE_AUDIO:-$REMOVE_AUDIO_DEFAULT}
fi

# Optional codecs
[[ -z "$IN_VCODEC" ]] && read -rp "Optional INPUT codec (-vcodec, blank = default): " IN_VCODEC
[[ -z "$OUT_VCODEC" ]] && read -rp "Optional OUTPUT codec (-c:v, blank = default): " OUT_VCODEC

# Custom args
if [[ $PASS1_ARGS_SET -eq 0 ]]; then
  read -rp "Extra ffmpeg args for pass 1 (blank = none): " PASS1_ARGS
fi
if [[ $PASS2_ARGS_SET -eq 0 ]]; then
  read -rp "Extra ffmpeg args for pass 2 (blank = none): " PASS2_ARGS
fi

# Validate input
[[ ! -f "$IN" ]] && { echo "❌ Input file does not exist"; exit 1; }

# Duration
DURATION=$(ffprobe -v error -show_entries format=duration \
  -of default=noprint_wrappers=1:nokey=1 "$IN")

# Bitrate
BR=$(awk -v kb="$TARGET_KB" -v dur="$DURATION" \
  'BEGIN { printf "%.0f", (kb * 8192) / dur }')

echo "Bitrate: $BR bps | FPS: $FPS | Scale: $SCALE"
[[ $SINGLE_PASS -eq 1 ]] && echo "Mode: SINGLE-PASS" || echo "Mode: TWO-PASS"

# Flags
[[ "$REMOVE_AUDIO" =~ ^[Yy]$ ]] && AUDIO_FLAG="-an" || AUDIO_FLAG=""
[[ -n "$IN_VCODEC" ]] && IN_CODEC_FLAG="-vcodec $IN_VCODEC" || IN_CODEC_FLAG=""
[[ -n "$OUT_VCODEC" ]] && OUT_CODEC_FLAG="-c:v $OUT_VCODEC" || OUT_CODEC_FLAG=""
VF_FLAG="-vf scale=iw*${SCALE}:ih*${SCALE}"

if [[ $SINGLE_PASS -eq 1 ]]; then
  # Single-pass
  ffmpeg -y \
  $IN_CODEC_FLAG -i "$IN" \
  -r "$FPS" $VF_FLAG $AUDIO_FLAG \
  $OUT_CODEC_FLAG -b:v "$BR" \
  $PASS2_ARGS \
  "$OUT"
else
  # Two-pass
  ffmpeg -y \
  $IN_CODEC_FLAG -i "$IN" \
  -r "$FPS" $VF_FLAG $AUDIO_FLAG \
  $OUT_CODEC_FLAG -b:v "$BR" -pass 1 \
  $PASS1_ARGS \
  -f mp4 /dev/null

  ffmpeg \
  $IN_CODEC_FLAG -i "$IN" \
  -r "$FPS" $VF_FLAG $AUDIO_FLAG \
  $OUT_CODEC_FLAG -b:v "$BR" -pass 2 \
  $PASS2_ARGS \
  "$OUT"

  rm -f ffmpeg2pass-0.log ffmpeg2pass-0.log.mbtree
fi

echo "✅ Done → $OUT"

