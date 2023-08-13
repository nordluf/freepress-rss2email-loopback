FROM node:18-slim

CMD npm start
WORKDIR /srv/www
COPY package*.json /srv/www/

RUN npm ci --production && rm -fr $HOME/.npm

COPY ./ /srv/www/
