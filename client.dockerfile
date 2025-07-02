FROM caddy:2.10.0-alpine

RUN adduser -D runner && apk add curl
USER runner
COPY Caddyfile /etc/caddy/Caddyfile
COPY ./dist /dist

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [ "curl", "0.0.0.0:8050" ]

EXPOSE 8050