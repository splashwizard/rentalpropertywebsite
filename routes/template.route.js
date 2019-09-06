var templateController = require('../controllers/template.controller');


module.exports = function(app){
    app.post('/createTemplate',templateController.createTemplate);
    app.get('/getTemplate/:id',templateController.getTemplate);
    app.put('/updateTemplate/:id',templateController.updateTemplate);
    app.delete('/deleteTemplate/:id',templateController.deleteTemplate);
};
