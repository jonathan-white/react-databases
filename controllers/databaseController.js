const db = require('../models');

module.exports = {
  findAll: (req, res) => {
    db.Database
      .find(req.query)
      .populate({ path: 'tables', populate: { path: 'fields' }})
      .populate('projects')
      .sort({ _id: 1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findAllShowIDsOnly: function(req, res) {
    db.Database
      .find(req.query)
      .sort({ dateAdded: -1 })
      .then(dbModel => res.json(dbModel.map(l => ({
          _id: l._id,
          title: l.title
        })
      )))
      .catch(err => res.status(422).json(err));
  },
  findById: function(req, res) {
    db.Database
      .find({_id: req.params.id})
      .populate({ path: 'tables', populate: { path: 'fields' }})
      .populate('projects')
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function(req, res) {
    db.Database
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  addProject: function(req, res) {
    db.Project
      .find({_id: req.body.projectId})
      .then(dbProject => {
        return db.Database.findOneAndUpdate(
          {_id: req.params.id},
          { $push: { "projects": req.body.projectId } },
          { new: true })
          .populate({ path: 'tables', populate: { path: 'fields' }})
          .populate('projects');
      })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  removeProject: function(req, res) {
    db.Database
      .findOneAndUpdate(
        {_id: req.params.id},
        { $pull: { "projects": req.body.projectId } })
      .populate({ path: 'tables', populate: { path: 'fields' }})
      .populate('projects')
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  update: async function(req, res) {
    db.Database
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .populate({ path: 'tables', populate: { path: 'fields' }})
      .populate('projects')
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function(req, res) {
    db.Database
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};
