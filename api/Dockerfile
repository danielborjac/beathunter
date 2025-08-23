# Etapa de construcción
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Etapa de ejecución
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app ./

EXPOSE 8001
CMD ["npm", "start"]
