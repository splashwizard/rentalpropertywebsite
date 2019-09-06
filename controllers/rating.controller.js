var Rating = require('../models/Rating');

module.exports = {
    createRating(req,res){
        let rating = new Rating(req.body);
        rating.save(function(err){
            if(!err){
                res.jsonp({
                    code:200,
                    status:'Rating Created'
                })
            }
            else {
                res.jsonp({
                    code:200,
                    status:'Error occured while creating rating',
                    error : err
                });
            }
        })
    },
    updateRating(req,res){
        let newRating = new Rating(req.body);
        newRating._id = req.params.id
        Rating.findOneAndUpdate({_id:req.params.id},newRating,function(err){
            if(!err){
                res.jsonp({
                    code:200,
                    status:'Rating Updated'
                })
            }
            else {
                res.jsonp({
                    code:200,
                    status:'Error occured while updating rating',
                    error : err
                });
            }
        })
    },
    deleteRating(req,res){
        Rating.findOneAndUpdate({_id:req.params.id},{status:'Deleted'},function(err){
            if (!err) {
                res.jsonp({
                    code:200,
                    status:'Rating Removed',
                });
            }
            else {
                res.jsonp({
                    code:200,
                    status:'Error occured while removing rating',
                    error : err
                });
            }
        })
    },
    getRating(req,res){
        Rating.findOne({_id:req.params.id}).lean().exec(function (err, rating) {
            if (!err) {
                res.jsonp({
                    code:200,
                    status:'Rating Retrived',
                    rating:rating
                });
            }
            else {
                res.jsonp({
                    code:200,
                    status:'Error occured while retrieving rating',
                    error : err
                });
            }
        })
    },
    getAllRating(req,res){
        Rating.find({propertyId:req.params.id}).lean().exec(function (err, rating) {
            if (!err) {
                res.jsonp({
                    code:200,
                    status:'Rating Retrived',
                    rating:rating
                });
            }
            else {
                res.jsonp({
                    code:200,
                    status:'Error occured while retrieving rating',
                    error : err
                });
            }
        })
    }
};