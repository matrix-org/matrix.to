# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean
COPY . .

# Stage 2: Production
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# Expose ports 80 and 443
EXPOSE 80
EXPOSE 443

# Healthcheck
HEALTHCHECK CMD curl --fail http://localhost:80 || exit 1

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
