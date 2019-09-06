var Issue = require('../models/Issues');

module.exports = {
    createIssue(req,res){
        let issue = new Issue(req.body);
        issue.save(function(err){
            if(!err){
                res.jsonp({
                    code:200,
                    status:'Issue Created'
                })
            }
            else {
                res.jsonp({
                    code:200,
                    status:'Error occured while creating issue',
                    error : err
                });
            }
        })
    },
    updateIssue(req,res){
        let newIssue = new Issue(req.body);
        newIssue._id = req.params.id
        Issue.findOneAndUpdate({_id:req.params.id},newIssue,function(err){
            if(!err){
                res.jsonp({
                    code:200,
                    status:'Issue Updated'
                })
            }
            else {
                res.jsonp({
                    code:200,
                    status:'Error occured while updating issue',
                    error : err
                });
            }
        })
    },
    deleteIssue(req,res){
        Issue.findOneAndUpdate({_id:req.params.id},{status:'Deleted'},function(err){
            if (!err) {
                res.jsonp({
                    code:200,
                    status:'Issue Removed',
                });
            }
            else {
                res.jsonp({
                    code:200,
                    status:'Error occured while removing issue',
                    error : err
                });
            }
        })
    },
    getIssue(req,res){
        Issue.findOne({_id:req.params.id}).lean().exec(function (err, issue) {
            if (!err) {
                res.jsonp({
                    code:200,
                    status:'Issue Retrived',
                    issue:issue
                });
            }
            else {
                res.jsonp({
                    code:200,
                    status:'Error occured while retrieving issue',
                    error : err
                });
            }
        })
    }
};