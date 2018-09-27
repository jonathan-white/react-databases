const db = require('../models');

module.exports = {
  findAll: (req, res) => {
    db.Database
      .find({ userId: req.body.userId })
      .populate({ path: 'tables', populate: { path: 'fields' }})
      .populate('projects')
      .sort({ _id: 1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findAllShowIDsOnly: function(req, res) {
    db.Database
      .find({ userId: req.body.userId })
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
      .find({ userId: req.body.userId, _id: req.params.id})
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
      .find({userId: req.body.userId, _id: req.body.projectId})
      .then(dbProject => {
        return db.Database.findOneAndUpdate(
          {userId: req.body.userId, _id: req.params.id},
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
        {userId: req.body.userId, _id: req.params.id},
        { $pull: { "projects": req.body.projectId } })
      .populate({ path: 'tables', populate: { path: 'fields' }})
      .populate('projects')
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  update: async function(req, res) {
    db.Database
      .findOneAndUpdate({ userId: req.body.userId, _id: req.params.id }, req.body)
      .populate({ path: 'tables', populate: { path: 'fields' }})
      .populate('projects')
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function(req, res) {
    db.Database
      .findById({ userId: req.body.userId, _id: req.params.id })
      .populate({ path: 'tables', populate: { path: 'fields' }})
      .then(dbModel => {
        // Delete database tables
        dbModel.tables.forEach(table => 
          db.Table.findById({ userId: req.body.userId, _id: table._id})
            .populate('fields')
            .then(dbTable => {
              // Delete database fields
              dbTable.fields.forEach(field => 
                db.Field.findById({ userId: req.body.userId, _id: field._id})
                  .then(dbField => {
                    dbField.remove();
                  })
              );
              dbTable.remove();
            })
        );
        dbModel.remove();
      })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};
