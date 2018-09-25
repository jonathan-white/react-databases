const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DatabaseSchema = new Schema({
  title: {type: String, required: true},
  type: {type: String, required: true},
  summary: String,
  tables: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Table'
    }
  ],
  projects: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Project'
    }
  ],
  dateAdded: { type: Date, default: Date.now },
  dateCreated: Date
});

const Database = mongoose.model('Database', DatabaseSchema);
module.exports = Database;
