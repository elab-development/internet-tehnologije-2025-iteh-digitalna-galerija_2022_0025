FROM node:18

WORKDIR /app

COPY package*.json ./

# ⬇⬇ OVO MENJA npm install
RUN npm ci

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
