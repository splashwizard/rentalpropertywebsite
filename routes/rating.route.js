var ratingController = require('../controllers/rating.controller');


module.exports = function(app){
    app.post('/createRating',ratingController.createRating);
    app.get('/getAllRating/:id',ratingController.getAllRating);
    app.get('/getRating/:id',ratingController.getRating);
    app.put('/updateRating/:id',ratingController.updateRating);
    app.delete('/deleteRating/:id',ratingController.deleteRating);
};
