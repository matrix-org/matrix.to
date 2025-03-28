# Build
FROM node:20.2-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .

# Expose port 80
EXPOSE 80

# Start
ENV PORT=80
CMD ["yarn", "start"]
