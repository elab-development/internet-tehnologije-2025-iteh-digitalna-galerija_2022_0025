FROM node:18

WORKDIR /app

# Kopiraj samo package fajlove radi keširanja layera
COPY package*.json ./

RUN npm install

# Tek sada kopiraj ostatak projekta
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]

RUN npm install

# Tek sada kopiraj ostatak projekta
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
