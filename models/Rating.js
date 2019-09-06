const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    userId:mongoose.Schema.Types.ObjectId,
    propertyId:mongoose.Schema.Types.ObjectId,
    userName:String,
    picture:String,
    rating:Number,
    userType:{
        type:String,
        enum:['Landlord','Tenant']
    },
    status: {
        type: String,
        enum: ['Active', 'Deleted'],
        default: 'Active'
    }
}, { timestamps: true });

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
