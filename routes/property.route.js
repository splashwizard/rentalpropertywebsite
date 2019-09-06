var propertyController = require('../controllers/property.controller');


module.exports = function(app){
    app.get('/a/properties',propertyController.getPropertyList);
    app.post('/s/properties',propertyController.getFilteredProperty);
    app.get('/getRegionList',propertyController.getRegionList);
    app.get('/getRegionListWithCountry', propertyController.getRegionListWithCountry);

    app.post('/createProperty',propertyController.createProperty);
    app.get('/getProperty/:id/:status/:cooling',propertyController.getProperty);
    app.put('/updateProperty/:id',propertyController.updateProperty);
    app.put('/toggleSponsorProperty/:id', propertyController.toggleSponsorProperty);
    app.delete('/deleteProperty/:id',propertyController.deleteProperty);
    
};
