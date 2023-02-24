# syntax=docker/dockerfile:1

FROM node:18.14.2
ENV NODE_ENV=production

WORKDIR /app

COPY "dist" .

CMD [ "node", "server.cjs" ]
