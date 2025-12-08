FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock* ./
COPY shared ./shared

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 3003

CMD ["yarn", "dev"]
