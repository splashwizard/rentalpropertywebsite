const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['Active', 'Deleted'],
    default: 'Active'
  },
  propertyType: {
    type: String,
    enum: ['house', 'flat', 'maisonette', 'bungalow', 'room only', 'garage'],
    default: 'house'
  },
  propertySubType: String,
  propertyImageUrls:[{type:String}],
  leaseType:String,
  Country:String,
  Region:String,
  State: String,
  City:String,
  PostalCode: Number,
  State: String,
  HouseNumber: Number,
  Address:String,
  Position: {
    Latitude: Number,
    Longitude: Number,
  },
  viewRequested:Boolean,
  rentStatus: {
    type: String,
    enum: ['for sale', 'rent'],
    default: 'for sale'
  },
  availability: {
    type: String,
    enum: ['taken', 'let agreed', 'available'],
    default: 'available'
  },
  condition: {
    type: String,
    enum: ['furnished', 'part-furnished', 'unfurnished'],
    default: 'unfurnished'
  },
  cooling: String,
  IsLet: Boolean,
  Heating: String,
  NumberOfRoom: Number,
  EnSuite: Number,
  duration: Date,
  propertyPrice: Number,
  propertyCurrency: Number,
  propertyPhotos: Array,
  propertVideos: Array,
  sponsored: Boolean
}, { timestamps: true });

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
