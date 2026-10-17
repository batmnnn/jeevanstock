#!/usr/bin/env bash
# Build a standalone bundle and zip-deploy it to an existing Azure App Service (Linux, Node 22).
# App settings (keys, PINs, SESSION_SECRET, HOSTNAME=0.0.0.0) are set once in the portal or with
# `az webapp config appsettings set`; nothing secret is baked into the build.
# Usage: AZ_RG=jeevanstock-rg AZ_APP=jeevanstock scripts/deploy-azure.sh
set -euo pipefail
RG="${AZ_RG:-jeevanstock-rg}"
APP="${AZ_APP:-jeevanstock}"
OUT=.next-deploy
STAGE="$(mktemp -d)"

env -i PATH="$PATH" HOME="$HOME" NEXT_OUTPUT=standalone NEXT_DIST_DIR="$OUT" npx next build
# -L: Turbopack links externals into the bundle; zip deploy does not keep symlinks.
cp -RL "$OUT/standalone/." "$STAGE/"
cp -R public "$STAGE/public"
cp -R "$OUT/static" "$STAGE/$OUT/static"
rm -rf "$STAGE"/node_modules/@img/sharp-darwin-* "$STAGE"/node_modules/@img/sharp-libvips-darwin-*
(cd "$STAGE" && zip -qr ../deploy.zip .)
az webapp config set -g "$RG" -n "$APP" --startup-file "node server.js" >/dev/null
az webapp deploy -g "$RG" -n "$APP" --src-path "$STAGE/../deploy.zip" --type zip --async false
rm -rf "$STAGE" "$STAGE/../deploy.zip"
