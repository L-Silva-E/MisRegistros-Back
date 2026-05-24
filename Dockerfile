FROM node:17.3.1-alpine3.14

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY src/shared/prisma ./src/shared/prisma

RUN npx prisma generate

COPY tsconfig.json ./

COPY . .

EXPOSE 9000

RUN pnpm run build

CMD [ "node", "./build/server.js" ]
