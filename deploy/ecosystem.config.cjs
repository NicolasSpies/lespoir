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
    env_file: '/var/www/lespoir/.env',
    env: { NODE_ENV: 'production', HOST: '127.0.0.1', PORT: '4325' },
  }],
};
