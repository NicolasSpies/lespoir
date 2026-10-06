// pm2 process definition for the L'Espoir asbl Astro-SSR server.
// Must be .cjs (package.json is "type":"module"; a .js config would load as ESM
// and pm2 could not read module.exports).
//
// ContentCore-VPS ports: Fabry 4321, Mercedes 4322, Celine 4323, Henkes 4324, L'Espoir 4325.
// The proxy_pass port in the nginx block (deploy/nginx/lespoir.laconis.be) must match.
module.exports = {
  apps: [{
    name: 'lespoir',
    script: 'server/entry.mjs',
    cwd: '/var/www/lespoir',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    max_restarts: 10,
    time: true,
    // Safety net against the Astro memory leak (CS-MEMLIMIT, 6 Oct 2026): already
    // set live via pm2 save; anchored here so a deploy cannot reset it.
    max_memory_restart: '400M',
    // Actually load .env (CMS_HOST). This was `env_file:` — pm2 does not know that
    // key (0 hits in pm2 7.0.1 source) and silently ignores it: the .env was never
    // loaded. It did not matter while the host was baked into the build. Node can
    // load it itself. Values in `env` below take precedence over the file.
    //
    // `--env-file-if-exists`, NOT `--env-file`: if the file is missing, `--env-file`
    // aborts the start (Node 20: "not found", Exit 9) and the site goes offline.
    // This way it starts with a warning and cmsHost uses the fallback, visible
    // externally as data-source="fallback" on the meta tag.
    //
    // NOTE: `pm2 restart <name>` does NOT re-read this file. A change here takes
    // effect only after `pm2 delete <name> && pm2 start ecosystem.config.cjs`
    // (see deploy-vps.sh).
    node_args: '--env-file-if-exists=/var/www/lespoir/.env',
    env: { NODE_ENV: 'production', HOST: '127.0.0.1', PORT: '4325' },
  }],
};
