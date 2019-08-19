#
# Samsung2Mqtt Dockerfile
#
# Build with:
#  docker build --rm --tag=samsung2mqtt:latest .
#
# Put your cnofig in config.js and run with:
#  docker run -d -v $PWD/config.js:/app/config.js --name=samsung2mqtt samsung2mqtt
#

FROM mhart/alpine-node:12

WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm install --loglevel verbose && \
    npm cache clean --force && \
    rm -rf /tmp/* /root/.npm

COPY . /app/

ENTRYPOINT ["node", "./index.js"]
