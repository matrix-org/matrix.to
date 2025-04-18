# Stage 1: Build
FROM node:20.2-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

# Stage 2: Production
FROM nginx:alpine
WORKDIR /etc/nginx
COPY ./nginx.conf /etc/nginx/nginx.conf
WORKDIR /usr/share/nginx/html
COPY --from=build /app/build .

# Expose port 80
EXPOSE 80

# Healthcheck
HEALTHCHECK CMD curl --fail http://localhost:80 || exit 1

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
