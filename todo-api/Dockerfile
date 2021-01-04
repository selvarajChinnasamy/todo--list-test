FROM node:12
WORKDIR /usr/src/app
COPY ["package*.json", "server.js", "swagger.json", ".env", "./"]
RUN npm install
EXPOSE 8080
CMD [ "npm", "run", "devServer" ]