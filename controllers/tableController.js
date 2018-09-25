const db = require('../models');

module.exports = {
  findAll: (req, res) => {
    db.Table
      .find(req.query)
      .populate('fields')
      .sort({ _id: 1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function(req, res) {
    db.Table
      .find({_id: req.params.id})
      .populate('fields')
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findByDatabase: function(req, res) {
    db.Table
      .find({databaseId: req.params.id})
      .populate('fields')
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function(req, res) {
    db.Table
      .create(req.body)
      .then(dbTable => {
        return db.Database.findOneAndUpdate({_id: req.body.databaseId}, { $push: { "tables": dbTable._id } }, { new: true });
      })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  update: function(req, res) {
    db.Table
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function(req, res) {
    db.Table
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};
