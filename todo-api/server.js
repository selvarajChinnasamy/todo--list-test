require('dotenv').config();
const express = require('express'),
  app = express(),
  port = process.env.API_APP_PORT || 3002,
  host = process.env.HOST,
  bodyParser = require('body-parser'),
  swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('./swagger.json'),
  apiRouter = require('./controllers/api'),
  middlewares = require('./middlewares/common');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(middlewares.enableCors);
app.use(middlewares.authenticate);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

global.jwt = require('jsonwebtoken');

app.get('/', (req, res) => {
  res.send('This is the api app for ToDo');
});

app.use('/api', apiRouter);

app.use(middlewares.errorHandler);

app.listen(port, host, () => console.log('App booted'));