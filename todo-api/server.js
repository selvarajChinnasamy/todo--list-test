require('dotenv').config();
const express = require('express'),
  app = express(),
  port = process.env.API_APP_PORT || 3002,
  host = process.env.HOST,
  bodyParser = require('body-parser'),
  swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('./swagger.json'),
  apiRouter = require('./controllers/api');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('This is the api app for ToDo');
});

app.use('/api', apiRouter);

app.listen(port, host, () => console.log('App booted'));