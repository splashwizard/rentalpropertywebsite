const mongoose = require('mongoose');

const AppliedSchema = new mongoose.Schema({
  propertyId:mongoose.Schema.Types.ObjectId,
  templateId:mongoose.Schema.Types.ObjectId,
  landLord:{
    userId: mongoose.Schema.Types.ObjectId,
    userName:String
  },
  tenant:{
    userId: mongoose.Schema.Types.ObjectId,
    userName:String
  },
  appliedStatus:{
    type:String,
    enum:['Pending','Approved','Declined']
  },
  declinedBy:{
    type:String,
    enum:['Tenant','Landlord']
  },
  tenancyDuration:Number,
  acceptBy: Date
}, { timestamps: true });

const Applied = mongoose.model('Applied', AppliedSchema);

module.exports = Applied;