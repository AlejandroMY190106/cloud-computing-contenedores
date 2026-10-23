# Etapa 1: Compilar frontend React
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Etapa 2: Preparar backend Node.js y empaquetar
FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --only=production
COPY backend/ ./
COPY --from=frontend-builder /app/frontend/dist ./public

EXPOSE 3000
CMD ["npm", "start"]