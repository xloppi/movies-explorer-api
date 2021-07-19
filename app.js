const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error-handler');

const CORS_WHITELIST = [
  'http://localhost:3000',
  'https://localhost:3000',
];
const corsOption = {
  credentials: true,
  origin: function checkCorsList(origin, callback) {
    if (CORS_WHITELIST.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

const {
  ENV_PORT,
  MONGO_DB_URL,
  MONGO_DB_CONFIG,
} = require('./utils/conf');

const app = express();

app.use(helmet());

mongoose.connect(MONGO_DB_URL, MONGO_DB_CONFIG);

app.use(bodyParser.json());
app.use(cookieParser());

app.use(requestLogger);

app.use(cors(corsOption));

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(ENV_PORT);
