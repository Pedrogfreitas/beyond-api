FROM node:lts-alpine

# Qual pasta eu quero salvar o meu projeto
WORKDIR /usr/src/app

# Copiando o package.json para /usr/src/app
COPY package.json ./

# Roda o comando de instalar as dependencias
RUN npm install

# Copia o resto dos arquivos para /usr/src/app
COPY . .

# Exponho a porta 8080
EXPOSE 8080

# Roda o comando node index.js
CMD ["node", "index.js"]