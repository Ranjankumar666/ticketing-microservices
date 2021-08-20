FROM node@sha256:dd8c0730582a3d30b128d2c684aed5b1fbe0bf3c0a4dcf7f96d85f0cb0e34bba
WORKDIR /usr/app

RUN apk add dumb-init 


COPY ./package.json .
RUN yarn install --production=true
COPY . .

CMD ["dumb-init", "yarn", "dev"]