const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FieldSchema = new Schema({
  userId: {type: String, required: true},
  tableId: {type: String, required: true},
  title: {type: String, required: true},
  summary: String,
  dataType: String,
  dataLength: Number,
  allowNull: {type: Boolean, default: false},
  key: String,
  defaultValue: {type: String, default: "Null"},
  dateAdded: { type: Date, default: Date.now }
});

const Field = mongoose.model('Field', FieldSchema);
module.exports = Field;
