var Property = require('../models/Property');
const _ = require('lodash');

module.exports = {
    getPropertyList(req, res) {
        // let filter = _.pick(req.query, ['propertyType','rentStatus','Country', 'State', 'City'])
        Property.distinct("Country").lean().exec(function (err, countryList) {
            if (!err) {
                let filter = {Country: !req.query['Country'] ? countryList[0] :req.query['Country']};
                Property.distinct( "Region", {...filter}).lean().exec(function (err, regionList) {
                    if (!err) {
                        let filter = { isPopular: 1};
                        Property.find( filter).lean().exec(function (err, propertyList) {
                            if (!err) {
                                res.render('pages/properties', {countryList: countryList, regionList: regionList, propertyList: propertyList, user: req.user});
                            } else {
                                res.jsonp({
                                    code: 200,
                                    status: 'Error occured while retrieving property list',
                                    error: err
                                });
                            }
                        })
                    } else {
                        res.jsonp({
                            code: 200,
                            status: 'Error occured while retrieving property list',
                            error: err
                        });
                    }
                })
            }
            else {
                res.jsonp({
                    code: 200,
                    status: 'Error occured while retrieving property list',
                    error: err
                });
            }
        })
    },
    getFilteredProperty(req, res) {
        const region = req.body.region;
        Property.find({Region: region}).lean().exec(function (err, propertyList) {
            if (!err) {
                console.log(propertyList);
                res.render('pages/properties_filtered', {propertyList: propertyList, region: region});
            } else {
                res.jsonp({
                    code: 200,
                    status: 'Error occured while retrieving property list',
                    error: err
                });
            }
        })
    },
    getRegionList(req, res) {
        let filter = _.pick(req.query, ['Country']);
        Property.distinct("Region", {...filter}).lean().exec(function (err, regionList) {
            if (!err) {
                res.jsonp({
                    regionList: regionList
                });
            }
            else {
                res.jsonp({
                    code: 200,
                    status: 'Error occured while retrieving property list',
                    error: err
                });
            }
        })
    },
    getRegionListWithCountry(req, res) {
        const filter = {"Region": req.body.region};
        Property.distinct("Region").lean().exec(function (err, regionList) {
            if (!err) {
                res.jsonp({
                    regionList: regionList
                });
            }
            else {
                res.jsonp({
                    code: 200,
                    status: 'Error occured while retrieving property list',
                    error: err
                });
            }
        })
    },
    createProperty(req, res) {
        let property = new Property(req.body);
        property.save(function (err) {
            if (!err) {
                res.jsonp({
                    code: 200,
                    status: 'Property Created'
                })
            }
            else {
                res.jsonp({
                    code: 200,
                    status: 'Error occured while creating property',
                    error: err
                });
            }
        })
    },
    updateProperty(req, res) {
        let newProperty = new Property(req.body);
        newProperty._id = req.params.id
        Property.findOneAndUpdate({ _id: req.params.id }, newProperty, function (err) {
            if (!err) {
                res.jsonp({
                    code: 200,
                    status: 'Property Updated'
                })
            }
            else {
                res.jsonp({
                    code: 200,
                    status: 'Error occured while updating property',
                    error: err
                });
            }
        })
    },
    deleteProperty(req, res) {
        Property.findOneAndUpdate({ _id: req.params.id }, { status: 'Deleted' }, function (err) {
            if (!err) {
                res.jsonp({
                    code: 200,
                    status: 'Property Removed',
                });
            }
            else {
                res.jsonp({
                    code: 200,
                    status: 'Error occured while removing property',
                    error: err
                });
            }
        })
    },
    getProperty(req, res) {
        Property.findOne({ _id: req.params.id, rentStatus: req.params.status, cooling: req.params.cooling }).lean().exec(function (err, property) {
            if (!err) {
                res.jsonp({
                    code: 200,
                    status: 'Property Retrived',
                    property: property
                });
            }
            else {
                res.jsonp({
                    code: 200,
                    status: 'Error occured while retrieving property',
                    error: err
                });
            }
        })
    },

    toggleSponsorProperty(req, res) {
        let propertyId = req.params.id

        Property.findById(propertyId).then(property => {
            property.sposored = !property.sposored
            property.save().then(updated => {
                console.log('Property sponsor variable has been toggeled successfully')
                return res.status(200).json({
                    StatusCode: 200,
                    Message: 'Sponsor property has been updated successfully'
                })
            }).catch(err => {

                return res.status(404).json({
                    StatusCode: 404,
                    Message: err
                })
            })

        }).catch(err => {
            throw new Error(err)
        })

    }
};
