const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TableSchema = new Schema({
  databaseId: String,
  title: {type: String, required: true},
  summary: String,
  fields: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Field'
    }
  ],
  recordCount: Number,
  dateAdded: { type: Date, default: Date.now },
  dateCreated: Date
});

const Table = mongoose.model('Table', TableSchema);
module.exports = Table;
