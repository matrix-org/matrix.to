# Stage 1: Build the application
FROM node:20-alpine as builder
WORKDIR /app
COPY . ./
ENV NODE_ENV=production
RUN yarn install --frozen-lockfile && yarn run build

# Stage 2: Serve the application with unprivileged NGINX
FROM nginxinc/nginx-unprivileged as production

ARG DOCROOT=/usr/share/nginx/html
COPY --from=builder /app/build ${DOCROOT}

EXPOSE 8080