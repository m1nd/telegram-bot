FROM node:10-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./
RUN npm install && npm run build
COPY . .
EXPOSE 8443