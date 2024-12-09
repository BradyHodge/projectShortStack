FROM node:20-alpine

RUN apk add --no-cache sqlite sqlite-dev python3 make g++ build-base

RUN mkdir -p /data
VOLUME /data

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY src/ ./src/

RUN npm run build

RUN cp src/whitelistDomains.csv dist/ && \
    cp -r src/public dist/

RUN npm prune --production

RUN apk del python3 make g++ build-base

EXPOSE 3000

ENV DB_PATH=/data

CMD ["npm", "start"]