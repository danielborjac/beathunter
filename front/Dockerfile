# Etapa de compilación
FROM node:20-alpine AS build

WORKDIR /app

ENV VITE_API_URL=http://localhost:8001/api
ENV VITE_API_BASE_URL=http://localhost:8001/api

COPY package*.json ./

COPY . .


RUN npm install

RUN npm run build

# Etapa de producción (Nginx)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]