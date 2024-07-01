FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn --immutable

COPY . .

RUN yarn tsc
CMD ["node", "dist/index.js"]