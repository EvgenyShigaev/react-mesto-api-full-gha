const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const Conflict = require('../errors/Conflict');

// Создание пользователя: createUser
const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User
      .create(
        {
          name,
          about,
          avatar,
          email,
          password: hash,
        },
      ))
    .then((user) => {
      res.status(201)
        .send({
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequest('Некорректный запрос'));
      }
      if (err.name === 'MongoServerError' && err.code === 11000) {
        return next(new Conflict('Произошел конфликт запроса и данных на сервере'));
      }
      return next(err);
    });
};

// Аутентификация пользователя: login
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch(next);
};

//  Получение списка пользователей: getUsers
const getUsers = (req, res, next) => {
  User
    .find({})
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => {
      next(err);
    });
};

// Получение информации о текущем пользователе: currentUser
const currentUser = (req, res, next) => {
  User
    .findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => res.status(200).send({ data: user }))

    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некорректный запрос'));
      } else {
        next(err);
      }
    });
};
// Обновление аватара пользователя: updateAvatar
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest('Некорректный запрос'));
      } else {
        next(err);
      }
    });
};
// Обновление данных пользователя: updateUser
const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => {
      res.status(200).send(user);
    }).catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest('Некорректный запрос'));
      } else {
        next(err);
      }
    });
};

// Получение информации о определенном пользователе по id: getUser
const getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => res
      .status(200)
      .send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некорректный запрос'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  currentUser,
};
