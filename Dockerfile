# Build
FROM node:20.2-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .

# Expose port 5000
EXPOSE 5000

# Start
ENV PORT=5000
CMD ["yarn", "start"]
