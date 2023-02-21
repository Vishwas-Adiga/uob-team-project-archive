# syntax=docker/dockerfile:1

FROM node:latest
ENV NODE_ENV=production

WORKDIR /app

COPY "dist" .

CMD [ "node", "server.cjs" ]
