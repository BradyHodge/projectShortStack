FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY src/ ./src/

RUN npm run build

RUN cp src/whitelistDomains.csv dist/ && \
    cp -r src/public dist/

RUN npm prune --production

EXPOSE 3000

CMD ["npm", "start"]