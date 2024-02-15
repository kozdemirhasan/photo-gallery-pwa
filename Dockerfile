# Node.js resmi Docker imajını kullanarak başlayın
FROM node:latest

# Uygulamanızın çalışacağı dizini oluşturun
WORKDIR /app

# Bağımlılıkları kopyalayın ve yükleyin
COPY package*.json ./
RUN npm install

# Uygulamanızın kodunu kopyalayın
COPY . .

# Uygulamanızın bağlantı noktasını belirtin
EXPOSE 3000

# Uygulamanızı çalıştırın
CMD ["node", "app.js"]