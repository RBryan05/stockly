FROM node:24-bookworm-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "src/index.js"]