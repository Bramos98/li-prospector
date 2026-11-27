#!/bin/sh
# Renderiza la imagen principal del README y la versión para LinkedIn con Chrome headless (Mac).
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 --virtual-time-budget=4000 \
  --window-size=1600,1000 --screenshot="$PWD/../hero.png" "file://$PWD/hero.html" 2>/dev/null
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 --virtual-time-budget=4000 \
  --window-size=1080,1350 --screenshot="$PWD/../hero-linkedin.png" "file://$PWD/hero.html?f=li" 2>/dev/null
ls -la ../hero.png ../hero-linkedin.png
