const Card = require('../models/card')

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({data: cards}))
    .catch(err => res.status(500).send({err: err.message}))
};

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({name, link, owner})
    .then(card => res.status(201).send({data: card}))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({message: err.message});
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findOneAndDelete(_id, req.params.cardId)
    .then((card) => {
      if(card !== null){
        res.status(200).send({data: card})
      } else {
        res.status(404).send({ message: "Данной карточки не существует"})
      }
      })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'id карточки не валидный' });
      }
      return res.status(500).send({message: err.message});
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id}}, { new: true })
    .then((card) => {
      if (card === null) {
        return res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
  req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card === null) {
        return res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные.' });
      }
      next(err);
    })
};