const mongoose = require('mongoose');

const IssuesSchema = new mongoose.Schema({
    raisedBy: {
        userId: mongoose.Schema.Types.ObjectId,
        userType: {
            type: String,
            enum: ['Landlord', 'Tenant']
        },
        userName: String
    },
    submittedTo: {
        userId: mongoose.Schema.Types.ObjectId,
        userName: String
    },
    acceptedBy:{
        userId: mongoose.Schema.Types.ObjectId,
        userName: String
    },
    workStatus: {
        type: String,
        enum: ['Raised', 'Booked', 'Done']
    },
    propertyDetail:{
        propertyId:mongoose.Schema.Types.ObjectId
    },
    landLord:{
        userId:mongoose.Schema.Types.ObjectId,
        userName:String
    },
    priority:{
        type:String,
        enum:['Low','Medium','High']
    },
    status: {
        type: String,
        enum: ['Active', 'Deleted'],
        default: 'Active'
      }
}, { timestamps: true });

const Issues = mongoose.model('Issues', IssuesSchema);

module.exports = Issues;