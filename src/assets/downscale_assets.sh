#!/usr/bin/env bash
set -euo pipefail

# This bash script uses ffprobe and ffmpeg >= 5.1 to generate any images to compressed `avif`'s of various pixel densities with transparency support.

#######################################
# Config
#######################################
IMAGE_EXTENSIONS="jpg jpeg png webp tif tiff bmp gif"
DEFAULT_FORMAT="avif"

AVIF_CRF=24        # 0–32 (lower = better)
AVIF_SPEED=0       # 0 = slow/best, 10 = fast/worst

OVERWRITE=false
PARALLEL=false
PARALLEL_JOBS=$(nproc)

#######################################
# Helpers
#######################################
is_image() {
  local ext="${1##*.}"
  ext="${ext,,}"
  [[ " $IMAGE_EXTENSIONS " =~ " $ext " ]]
}

#######################################
# Core: density generation
#######################################
generate_densities() {
  local INPUT="$1"
  local FORMAT="${2:-$DEFAULT_FORMAT}"

  [ -f "$INPUT" ] || return

  local BASENAME NAME DIR
  BASENAME=$(basename "$INPUT")
  NAME="${BASENAME%.*}"
  DIR=$(dirname "$INPUT")

  declare -A SCALES=(
    ["1x"]=1
    ["0.75x"]=0.75
    ["0.5x"]=0.5
    ["0.25x"]=0.25
    ["0.125x"]=0.125
  )

  local FF_OVERWRITE="-n"
  [ "$OVERWRITE" = true ] && FF_OVERWRITE="-y"

  local HAS_ALPHA=false
  if has_alpha "$INPUT"; then
    HAS_ALPHA=true
    echo "🧪 Alpha: $HAS_ALPHA ($INPUT)"
  fi

  for DENSITY in "${!SCALES[@]}"; do
    local SCALE OUTPUT
    SCALE="${SCALES[$DENSITY]}"
    OUTPUT="${DIR}/${NAME}@${DENSITY}.${FORMAT}"

    [ -f "$OUTPUT" ] && [ "$OVERWRITE" = false ] && continue

    echo "📐 $INPUT → $OUTPUT"

    if [ "$HAS_ALPHA" = true ]; then
      encode_with_alpha
    else
      encode_without_alpha
    fi
  done
}


has_alpha() {
  local file="$1"

  ffprobe -v error \
    -select_streams v:0 \
    -show_entries stream=pix_fmt \
    -of default=nw=1:nk=1 \
    "$file" \
  | grep -Eq '^(rgba|bgra|argb|abgr|ya8|yuva|gbrap|gbrap10le|gbrap12le)'
}

encode_without_alpha() {
  ./ffmpeg \
    -nostdin \
    $FF_OVERWRITE \
    -i "$INPUT" \
    -vf "scale=iw*${SCALE}:ih*${SCALE}:flags=lanczos" \
    -frames:v 1 \
    -c:v libaom-av1 \
    -crf "$AVIF_CRF" \
    -cpu-used "$AVIF_SPEED" \
    -still-picture 1 \
    "$OUTPUT"
}

encode_with_alpha() {
  ./ffmpeg \
    -nostdin \
    $FF_OVERWRITE \
    -i "$INPUT" \
    -map 0 -map 0 \
    -filter:v:0 "scale=iw*${SCALE}:ih*${SCALE}:flags=lanczos" \
    -filter:v:1 "alphaextract,scale=iw*${SCALE}:ih*${SCALE}" \
    -frames:v 1 \
    -c:v libaom-av1 \
    -crf "$AVIF_CRF" \
    -cpu-used "$AVIF_SPEED" \
    -still-picture 1 \
    "$OUTPUT"
}

export -f generate_densities
export AVIF_CRF AVIF_SPEED OVERWRITE DEFAULT_FORMAT IMAGE_EXTENSIONS

#######################################
# Recursive mode
#######################################
convert_recursive() {
  echo "🔍 Recursively generating ALL densities → AVIF"

  if [ "$PARALLEL" = true ]; then
    find . -type f -print0 |
      xargs -0 -n 1 -P "$PARALLEL_JOBS" \
        bash -c '
          file="$1"
          ext="${file##*.}"
          ext="${ext,,}"
          [[ " '"$IMAGE_EXTENSIONS"' " =~ " $ext " ]] || exit 0
          generate_densities "$file"
        ' _
  else
    find . -type f | while read -r file; do
      is_image "$file" && generate_densities "$file"
    done
  fi
}

#######################################
# Argument parsing
#######################################
POSITIONAL=()

while [ $# -gt 0 ]; do
  case "$1" in
    -f|--overwrite)
      OVERWRITE=true
      shift
      ;;
    -p|--parallel)
      PARALLEL=true
      if [[ "${2:-}" =~ ^[0-9]+$ ]]; then
        PARALLEL_JOBS="$2"
        shift
      fi
      shift
      ;;
    -*)
      echo "Unknown option: $1"
      exit 1
      ;;
    *)
      POSITIONAL+=("$1")
      shift
      ;;
  esac
done

set -- "${POSITIONAL[@]}"

#######################################
# Entry point
#######################################
if [ $# -eq 0 ]; then
  convert_recursive
elif [ $# -eq 1 ]; then
  generate_densities "$1"
else
  echo "Usage:"
  echo "  $0 [options]              # recursive: all densities"
  echo "  $0 [options] image.png    # single image: all densities"
  echo
  echo "Options:"
  echo "  -f, --overwrite           overwrite existing outputs"
  echo "  -p, --parallel [N]        enable parallelism"
  exit 1
fi

