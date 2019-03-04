# 客户端 npm 包
FROM node:alpine as clientBase
WORKDIR /clientBase
COPY ./package.json .
COPY ./yarn.lock .
RUN npm install -g yarn && \
    yarn config set registry 'https://registry.npm.taobao.org' && \
    yarn --network-timeout 100000 install

FROM node:alpine as clientBuild
WORKDIR /app
COPY . .
COPY --from=clientBase /clientBase/node_modules ./node_modules
RUN yarn build

# 需要的资源加入镜像
FROM nginx:latest
WORKDIR /app
COPY --from=clientBuild /app/build/ /usr/share/nginx/html/
COPY --from=clientBuild /app/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=clientBuild /app/nginx/mime.types /etc/nginx/mime.types

EXPOSE 9010
