const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');
const limiter = require('./middlewares/rateLimit');
const error500 = require('./middlewares/error500');

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});
const app = express();
app.use(requestLogger);
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(router);
app.use(errorLogger);

app.use(errors());
app.use(error500);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Подключен к порту 3000 ${PORT}`);
});
