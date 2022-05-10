FROM node:lts

RUN npm i -g nodemon typescript

USER node

WORKDIR /app

COPY --chown=node . .

RUN npm i

CMD npm run migrate && npm run dev
