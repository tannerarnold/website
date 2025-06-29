FROM node:24

RUN adduser runner && mkdir /database && chown -R runner /database && mkdir /posts && chown -R runner /posts
USER runner
COPY --chown=runner package.json /app/package.json
COPY --chown=runner package-lock.json /app/package-lock.json
COPY --chown=runner ./src/database/migrations /app/src/database/migrations
COPY --chown=runner ./dist/server.js /app/server.js
WORKDIR /app
ENV DATABASE_URL=../database/database.db WATCH_DIR=/posts
RUN npm i

EXPOSE 8080
EXPOSE 465

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [ "curl", "0.0.0.0:8080" ]

ENTRYPOINT [ "node", "./server.js" ]