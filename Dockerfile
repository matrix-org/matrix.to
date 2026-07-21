FROM node:24-slim@sha256:6f7b03f7c2c8e2e784dcf9295400527b9b1270fd37b7e9a7285cf83b6951452d AS builder
WORKDIR /src
COPY package.json yarn.lock ./
RUN corepack enable && yarn install --frozen-lockfile
COPY . .
# CLIENTS: comma-separated allow-list of built-in client ids to include (default: all of them)
# CUSTOM_CLIENTS_DIR: directory (relative to the build context) of extra client modules to include
ARG CLIENTS=""
ARG CUSTOM_CLIENTS_DIR="custom-clients"
ENV MATRIX_TO_CLIENTS=$CLIENTS
ENV MATRIX_TO_CUSTOM_CLIENTS_DIR=$CUSTOM_CLIENTS_DIR
RUN yarn build

FROM nginx:alpine@sha256:4a73073bd557c65b759505da037898b61f1be6cbcc3c2c3aeac22d2a470c1752
COPY --from=builder /src/build /usr/share/nginx/html
EXPOSE 80
