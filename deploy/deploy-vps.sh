#!/usr/bin/env bash
# L'Espoir asbl — build the Astro-SSR site locally, ship it to the ContentCore VPS,
# (re)start the pm2 process. Runs FROM the dev machine (Mac); ships over SSH.
#
# Why build locally and rsync dist/ (not `npm ci && build` on the VPS): the built
# dist/ is platform-neutral JS. The deploy-dir install below is `npm ci --omit=dev`
# = RUNTIME deps only (@astrojs/node, isomorphic-dompurify — pure JS), so no native
# rollup/esbuild build-dep issues on Linux.
#
# ⚠️ NEVER `rsync --delete` against the deploy ROOT (/var/www/lespoir) — it holds
# node_modules + manifests. --delete is scoped to client/ and server/ ONLY.
set -euo pipefail
cd "$(dirname "$0")/.."

VPS="${VPS:-root@72.62.177.185}"
DEPLOY_DIR="${DEPLOY_DIR:-/var/www/lespoir}"
PM2_APP="${PM2_APP-lespoir}"
PORT="${PORT:-4325}"

echo "==> Build (Tailwind + Astro SSR)"
npm run build   # -> dist/client (static assets) + dist/server (Node SSR)

echo "==> Ship built halves (--delete scoped to subdirs only)"
ssh "$VPS" "mkdir -p $DEPLOY_DIR/client $DEPLOY_DIR/server"
rsync -az --delete dist/client/ "$VPS:$DEPLOY_DIR/client/"
rsync -az --delete dist/server/ "$VPS:$DEPLOY_DIR/server/"

echo "==> Ship manifests (NO --delete)"
rsync -az package.json package-lock.json "$VPS:$DEPLOY_DIR/" 2>/dev/null || rsync -az package.json "$VPS:$DEPLOY_DIR/"

echo "==> Install runtime deps IN the deploy dir + ensure pm2 config/.env"
scp deploy/ecosystem.config.cjs "$VPS:$DEPLOY_DIR/ecosystem.config.cjs"
ssh "$VPS" "cd $DEPLOY_DIR && \
  ([ -f .env ] || printf 'NODE_ENV=production\nHOST=127.0.0.1\nPORT=$PORT\n' > .env) && chmod 600 .env && \
  npm install --omit=dev --no-audit --no-fund"

if [ -n "$PM2_APP" ]; then
  echo "==> pm2 restart $PM2_APP (start if absent)"
  ssh "$VPS" "pm2 restart $PM2_APP --update-env 2>/dev/null || pm2 start $DEPLOY_DIR/ecosystem.config.cjs; pm2 save; sleep 2; \
    curl -sL -o /dev/null -w '==> verify $PM2_APP -> HTTP %{http_code}\n' http://127.0.0.1:$PORT/; \
    find /var/cache/nginx/astro -type f -delete 2>/dev/null || true"
else
  echo "==> PM2_APP empty: dry-run, pm2 skipped. Deploy dir ready at $DEPLOY_DIR"
fi
echo "==> Done."
