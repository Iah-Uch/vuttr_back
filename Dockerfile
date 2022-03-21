FROM node:alpine
WORKDIR /src/app
COPY package*.json .
RUN rm -rf node_modules
RUN yarn install

COPY . .

CMD ["yarn", "start"]