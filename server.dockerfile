FROM node:24

RUN adduser runner && mkdir /database && chown -R runner /database
USER runner
COPY --chown=runner package.json /app/package.json
COPY --chown=runner package-lock.json /app/package-lock.json
COPY --chown=runner ./src/database /app/src/database
COPY --chown=runner ./dist/server.js /app/server.js
WORKDIR /app
ENV DATABASE_URL=file:/database/database.db?mode=rwc
RUN npm i

EXPOSE 8080
EXPOSE 465

ENTRYPOINT [ "node", "./server.js" ]