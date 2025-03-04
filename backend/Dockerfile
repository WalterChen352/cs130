FROM node:18


COPY package*.json ./
RUN npm install
COPY . .
RUN chmod +x ./node_modules/.bin/tsx
EXPOSE 8080

CMD ["npm", "start"]