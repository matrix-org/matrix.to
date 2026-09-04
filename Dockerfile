FROM node:lts-alpine

RUN apk update

WORKDIR /app

COPY . ./

RUN yarn

RUN yarn build

EXPOSE 5000

ENTRYPOINT ["yarn", "start"]
