
ARG NODE_VERSION=20.11.1

FROM node:${NODE_VERSION}-alpine

RUN npm i npm@latest -g
 
COPY package.json package-lock.json ./

RUN npm install

WORKDIR /src

COPY . .

ENV NODE_ENV dev

EXPOSE 3052

CMD node server.js
