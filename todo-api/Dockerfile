FROM node:12
WORKDIR /usr/src/app
COPY ["package*.json", "server.js", "swagger.json", ".env", "./"]
RUN npm install
EXPOSE 3002
CMD [ "npm", "run", "devServer" ]