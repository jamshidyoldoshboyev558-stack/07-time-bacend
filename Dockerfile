# Node.js image
FROM node:20

# Work directory
WORKDIR /app

# package fayllar
COPY package*.json ./

# dependencies o'rnatish
RUN npm install

# kodni ko'chirish
COPY . .

# build (agar NestJS bo'lsa kerak)
# RUN npm run build

# port
EXPOSE 5000

# start
CMD ["npm", "run", "start"]