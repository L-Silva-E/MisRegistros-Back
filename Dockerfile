FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache openssl

RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY src/shared/prisma ./src/shared/prisma

RUN npx prisma generate

COPY tsconfig.json ./

COPY . .

EXPOSE 9000

RUN pnpm run build

CMD [ "node", "./build/server.js" ]
