const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  templateDetail:String,
  status: {
    type: String,
    enum: ['Active', 'Deleted'],
    default: 'Active'
  }
}, { timestamps: true });

const Template = mongoose.model('Template', TemplateSchema);

module.exports = Template;