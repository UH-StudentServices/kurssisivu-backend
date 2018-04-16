FROM node:8-wheezy

WORKDIR /usr/src/app
COPY package.json .
COPY package.json package-lock.json ./

RUN npm install

COPY . .

ENV PATH=".:${PATH}"

EXPOSE 3001
CMD [ "npm", "start" ]