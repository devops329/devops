FROM node:21-alpine

WORKDIR /usr/app

COPY package.json .

RUN npm i --quiet

COPY . .

RUN npm install pm2 -g

CMD ["pm2-runtime", "index.js"]

# FROM node:21-alpine
# WORKDIR /app
# CMD ["node", "-v"]