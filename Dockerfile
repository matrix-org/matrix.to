# Verwenden Sie ein Node.js-Image als Basis
FROM node:20-alpine

# Setzen Sie das Arbeitsverzeichnis im Container
WORKDIR /app

# Kopieren Sie die package.json und yarn.lock Dateien und installieren Sie die Abhängigkeiten
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Kopieren Sie den Rest des Codes in das Arbeitsverzeichnis
COPY . .

# Exponieren Sie den Port 5000
EXPOSE 5000

# Starten Sie die Anwendung und setzen Sie die PORT-Umgebungsvariable auf 5000
ENV PORT=5000
CMD ["yarn", "start"]