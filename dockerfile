# Imagen base
FROM node:20

# Crear directorio de trabajo
WORKDIR /app

# Copiar dependencias del backend
COPY backend/package*.json ./
RUN npm install

# Copiar el backend
COPY backend .

# Copiar el frontend dentro del contenedor
COPY frontend ./frontend

# Exponer el puerto del servidor
EXPOSE 5000

# Comando de inicio
CMD ["node", "src/server.js"]
