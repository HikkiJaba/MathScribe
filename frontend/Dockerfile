# Используем базовый образ Node.js для сборки
FROM node:18 as build

# Установка рабочей директории
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Копируем весь проект и собираем
COPY . .
RUN npm run build

# Production сервер
FROM nginx:1.23
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
