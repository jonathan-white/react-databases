const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  userId: {type: String, required: true},
  databaseId: String,
  title: {type: String, required: true},
  summary: String,
  website: String,
  image: String,
  dateAdded: { type: Date, default: Date.now },
  dateCreated: Date
});

const Project = mongoose.model('Project', ProjectSchema);
module.exports = Project;
