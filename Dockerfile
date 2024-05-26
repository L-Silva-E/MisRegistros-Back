FROM node:17.3.1-alpine3.14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate

COPY tsconfig.json ./

COPY . .

EXPOSE 9000

RUN npm run build

CMD [ "node", "./build/server.js" ]
