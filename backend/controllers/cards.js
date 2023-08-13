const mongoose = require('mongoose');

const Card = require('../models/card');

const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const Forbidden = require('../errors/Forbidden');

// getCards - для получения всех карточек
const getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      next(err);
    });
};

// createCard - для создания новой карточки
const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest('Некорректный запрос'));
      } else {
        next(err);
      }
    });
};

// deleteCard - для удаления карточки
const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => {
      const owner = card.owner.toString();
      const _id = req.user._id.toString();
      if (owner === _id) {
        Card.deleteOne(card)
          .then(() => {
            res.status(200).send({ message: 'Запрос выполнен' });
          })
          .catch(next);
      } else {
        throw new Forbidden('Доступ запрещён');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некорректный запрос'));
      } else {
        next(err);
      }
    });
};

// likeCard - для добавления лайка карточке
const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => {
      res.status(200).send({ data: card, message: 'Запрос выполнен' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некорректный запрос'));
      } else {
        next(err);
      }
    });
};

//  dislikeCard - для удаления лайка с карточки
const dislikeCard = (req, res, next) => {
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'BadRequest') {
        next(new BadRequest('Некорректный запрос'));
        return;
      }
      next(err);
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
