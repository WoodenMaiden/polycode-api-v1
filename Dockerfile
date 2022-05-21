FROM node:17-alpine

ENV PORT 80

COPY . /www
WORKDIR /www

RUN npm i 
RUN npm run build

CMD [ "dist/app.js"]