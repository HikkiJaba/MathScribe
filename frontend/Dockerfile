# Стадия сборки
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

# Копируем собранные файлы из стадии сборки
COPY --from=build /app/build /usr/share/nginx/html

# Конфигурация Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
