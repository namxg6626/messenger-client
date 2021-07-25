FROM node:14.15.0-alpine

RUN mkdir -p /home/app

WORKDIR /home/app

COPY . .

RUN yarn install

EXPOSE 3000

CMD npm rebuild node-sass && yarn start
