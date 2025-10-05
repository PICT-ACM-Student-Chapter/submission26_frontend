FROM node:16-alpine3.14

WORKDIR /src

EXPOSE 3000

RUN apk update \
    && apk upgrade \
    && apk add --no-cache --upgrade bash