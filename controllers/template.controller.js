var Template = require('../models/Template');

module.exports = {
    createTemplate(req,res){
        let template = new Template(req.body);
        template.save(function(err){
            if(!err){
                res.jsonp({
                    code:200,
                    status:'Template Created'
                })
            }
            else {
                res.jsonp({
                    code:200,
                    status:'Error occured while creating template',
                    error : err
                });
            }
        })
    },
    updateTemplate(req,res){
        let newTemplate = new Template(req.body);
        newTemplate._id = req.params.id
        Template.findOneAndUpdate({_id:req.params.id},newTemplate,function(err){
            if(!err){
                res.jsonp({
                    code:200,
                    status:'Template Updated'
                })
            }
            else {
                res.jsonp({
                    code:200,
                    status:'Error occured while updating template',
                    error : err
                });
            }
        })
    },
    deleteTemplate(req,res){
        Template.findOneAndUpdate({_id:req.params.id},{status:'Deleted'},function(err){
            if (!err) {
                res.jsonp({
                    code:200,
                    status:'Template Removed',
                });
            }
            else {
                res.jsonp({
                    code:200,
                    status:'Error occured while removing template',
                    error : err
                });
            }
        })
    },
    getTemplate(req,res){
        Template.findOne({_id:req.params.id}).lean().exec(function (err, template) {
            if (!err) {
                res.jsonp({
                    code:200,
                    status:'Template Retrived',
                    template:template
                });
            }
            else {
                res.jsonp({
                    code:200,
                    status:'Error occured while retrieving template',
                    error : err
                });
            }
        })
    }
};