FROM caddy:2.10.0-alpine

RUN adduser -D runner
USER runner
COPY Caddyfile /etc/caddy/Caddyfile
COPY ./dist /dist

EXPOSE 8050