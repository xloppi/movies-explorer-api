require('dotenv').config();

const {
  NODE_ENV,
  PORT,
  JWT_SECRET,
  MONGO_URL,
  SALT_ROUNDS,
} = process.env;

const ENV_PORT = NODE_ENV === 'production' ? PORT : 3000;
const MONGO_DB_URL = NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/bitfilmsdb';
const MONGO_DB_CONFIG = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};
const JWT_SECRET_KEY = NODE_ENV === 'production' ? JWT_SECRET : 'superpupernikogdanepodbereshkey';
const SALT_R = NODE_ENV === 'production' ? Number(SALT_ROUNDS) : 10;

module.exports = {
  NODE_ENV,
  ENV_PORT,
  MONGO_DB_URL,
  MONGO_DB_CONFIG,
  JWT_SECRET_KEY,
  SALT_R,
};
