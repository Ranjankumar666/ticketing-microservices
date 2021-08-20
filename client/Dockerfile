FROM node:alpine AS deps

WORKDIR /usr/app

COPY package.json .
RUN apk add --no-cache dumb-init
RUN yarn install
COPY . .

CMD ["dumb-init", "yarn", "dev"]
