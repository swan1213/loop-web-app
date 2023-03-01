FROM node:12-alpine as builder

COPY ./  /frontend

WORKDIR /frontend

RUN npm install
RUN yarn build

FROM nginx:1.21.1-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY columbus5.json /usr/share/nginx/html/columbus5.json
COPY --chown=node:node --from=builder /frontend/build/ /usr/share/nginx/html
