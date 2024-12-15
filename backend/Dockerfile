# Используем базовый образ Python
FROM python:3.11-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем зависимости
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем все файлы проекта
COPY . .

# Указываем порт приложения
EXPOSE 8000

# Запускаем приложение (замените команду на вашу, если нужно)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
