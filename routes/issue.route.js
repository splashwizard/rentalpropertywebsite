var issueController = require('../controllers/issue.controller');


module.exports = function(app){
    app.post('/createIssue',issueController.createIssue);
    app.get('/getIssue/:id',issueController.getIssue);
    app.put('/updateIssue/:id',issueController.updateIssue);
    app.delete('/deleteIssue/:id',issueController.deleteIssue);
};
