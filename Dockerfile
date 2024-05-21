FROM node:17.3.1-alpine3.14
ENV TZ=America/Santiago
RUN apk update && apk upgrade && \
  apk add tzdata

RUN apk add --update npm

WORKDIR /app

COPY package*.json ./

# COPY ENV variable
#COPY .env ./

# COPY tsconfig.json file
COPY tsconfig.json ./

COPY . .

RUN npm i
RUN npm run build

EXPOSE 9000

CMD [ "node", "./dist/server.js" ]
