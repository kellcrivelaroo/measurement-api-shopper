FROM node:20-alpine

RUN apk add --no-cache bash curl

WORKDIR /app

COPY . .

RUN yarn install --production

RUN yarn db:generate

RUN curl -o /wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh

RUN chmod +x /wait-for-it.sh

CMD ["/wait-for-it.sh", "postgres:5432", "--", "yarn", "start"]