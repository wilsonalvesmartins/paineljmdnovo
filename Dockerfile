# Build Stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production Stage (Node.js)
FROM node:18-alpine
WORKDIR /app

# Copia dependencias e instala apenas as de produção
COPY package*.json ./
RUN npm ci --only=production

# Copia o código do servidor
COPY server.js ./

# Copia o build do frontend gerado no estágio anterior
COPY --from=build /app/dist ./dist

# Cria pasta para persistência de dados
RUN mkdir -p data

EXPOSE 80
CMD ["npm", "start"]
