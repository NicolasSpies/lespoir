# lespoir.laconis.be — L'Espoir asbl · Astro SSR frontend
#
# Source of truth: deploy/nginx/lespoir.laconis.be in the repo.
# Safe-deploy: backup -> cp -> nginx -t -> systemctl reload nginx.
#
# Architecture:
#   nginx (80/443) -> Astro SSR Node process (127.0.0.1:4325, pm2 app "lespoir")
#   Hashed build assets (/assets/) served directly by nginx (immutable cache).
#   Short micro-cache in front of SSR HTML (snippets/astro-cache.conf) — CMS
#   changes visible within ~30s; session/preview requests bypass it.
#
# TLS: uses the shared acme.sh WILDCARD cert *.laconis.be (no per-domain certbot,
# consistent with the other laconis subdomains). An exact server_name matches
# BEFORE the *.laconis.be wildcard fallback block, so this vhost wins on :443.

# --- HTTP :80 — ACME + redirect to HTTPS ---
server {
    listen 80;
    listen [::]:80;
    server_name lespoir.laconis.be;

    location ^~ /.well-known/acme-challenge/ { root /var/www/certbot; default_type "text/plain"; }
    location / { return 301 https://$host$request_uri; }
}

# --- HTTPS :443 — SSR ---
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name lespoir.laconis.be;

    ssl_certificate     /etc/ssl/laconis-wildcard/fullchain.pem;
    ssl_certificate_key /etc/ssl/laconis-wildcard/key.pem;

    root /var/www/lespoir/client;

    add_header X-Content-Type-Options   "nosniff" always;
    add_header X-Frame-Options          "SAMEORIGIN" always;
    add_header Referrer-Policy          "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy       "geolocation=(), microphone=(), camera=(), interest-cohort=()" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # Hashed, content-addressed build assets — immutable
    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable" always;
        try_files $uri =404;
    }

    # Public static files shipped in client/ (favicon, fonts, images, css/js, robots, …)
    location ~* \.(ico|webmanifest|svg|jpg|jpeg|png|webp|avif|gif|woff2?|ttf|otf|css|js|txt|xml)$ {
        add_header Cache-Control "public, max-age=86400" always;
        try_files $uri @node;
    }

    location / { try_files $uri @node; }

    # SSR Node process + micro-cache
    location @node {
        include snippets/astro-cache.conf;
        proxy_pass http://127.0.0.1:4325;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
