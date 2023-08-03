FROM node:18 as build

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY ./src/prisma/ ./prisma/

RUN yarn install

RUN npx prisma generate

COPY . .

RUN yarn build

FROM node:18-buster

COPY --from=build /app/dist/ ./

EXPOSE 5000

CMD [ "node", "./server.js" ]
