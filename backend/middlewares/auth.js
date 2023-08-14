const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Unauthorized = require('../errors/Unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';

  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  const token = authorization.replace(bearer, '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
    req.user = {
      _id: new mongoose.Types.ObjectId(payload._id),
    };
    next();
  } catch (err) {
    return next(Unauthorized('Необходима авторизация'));
  }
};

// const jwt = require('jsonwebtoken');
// const Unauthorized = require('../errors/Unauthorized');

// const { NODE_ENV, JWT_SECRET } = process.env;

// module.exports = (req, res, next) => {
//   const { authorization } = req.headers;
//   // eslint-disable-next-line no-console
//   if (!authorization || !authorization.startsWith('Bearer ')) {
//     throw new Unauthorized('Необходима авторизация');
//   }

//   const token = authorization.replace('Bearer ', '');
//   let payload;

//   try {
//     payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
//   } catch (err) {
//     throw new Unauthorized('Необходима авторизация');
//   }
//   req.user = payload;

//   return next();
// };
