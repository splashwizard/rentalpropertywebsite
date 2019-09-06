const express = require('express')
const mongoose = require('mongoose')

const _ = require('lodash')
const axios = require('axios')
const fetch = require('node-fetch')

const Property = require('../models/Property')

let adminRouter = express.Router()


// Get all properties Just for test
adminRouter.get('/get', (req, res) => {
    Property.find({}).then(data => { return res.status(200).json(data) }).catch(err => { return res.status(404).json(err) })
})

/**
 * Add property to Database
 * 
 */
adminRouter.post('/property/&houseNumber=:houseNumber&street=:street&city=:city&state=:state&postalCode=:postalCode&country=:country', (req, res)=>{
    
    // Here.com api url
    let fetchUrl = "https://geocoder.api.here.com/6.2/geocode.json?app_id=zOen7VUeLwMhJ0sqAJkb&app_code=CCKGN97m29DGFoqoOeuyUg"

    // Add house number to url
    fetchUrl += `&houseNumber=${req.params.houseNumber}`

    // Add street
    fetchUrl += `&street=${req.params.street}`

    // Add City 
    fetchUrl += `&city=${req.params.city}`

    // Add state
    fetchUrl += `&state=${req.params.state}`

    // Add postal code
    fetchUrl += `&postalCode=${req.params.postalCode}`
    
    // Add country
    fetchUrl += `&country=${req.params.country}`
   
    // Get response from Here.com API
    axios.get(encodeURI(fetchUrl)).then(response => {
        data = response.data.Response.View[0].Result[0]

        // If State doesn't match the country
        if(data.MatchQuality.Country != 1 || data.MatchQuality.State != 1){
            return res.status(404).json({
                Error: "Country and State doesn't match"
            })
        }

        // If the city Doesn't match the State
        if(data.MatchQuality.City != 1 || data.MatchQuality.State != 1){
            return res.status(404).json({
                Error: "City and State doesn't match"
            })
        }

        // ##### CHECK THIS IF YOU WANT TO FULLY VALIDATE ADDRESS
        // // If the address isn't valid 
        // if(data.MatchLevel !== 'street' && data.MatchLevel !== 'houseNumber'){
        //     return res.status(404).json({
        //         Error: "Address not found"
        //     })
        // }

        let property = data.Location
        // Create the new property
        let propertyData = {
            Address : property.Address.Label,
            HouseNumber : req.params.houseNumber,
            Street: req.params.Street,
            City : property.Address.City,
            Region: property.Address.County,
            State: property.Address.State,
            PostalCode: property.Address.PostalCode,
            Country: property.Address.Country,
            Position: {
                Latitude: property.DisplayPosition.Latitude,
                Longitude: property.DisplayPosition.Longitude
            }
        }
        let newProperty = new Property(propertyData)
        newProperty.save().then(dbResponse => {
            // Save the new property
            return res.status(200).json(dbResponse)
        }).catch(err => {
            // In case of any errors
            return res.status(500).json(err)
        })
    }).catch(err => {
        // In case of any errors
        return res.status(500).json(err)
    })
})

adminRouter.delete('/property/:id', (req, res) => {
    let id = req.params.id

    Property.findByIdAndRemove(id).then(dbResponse => {
        if (dbResponse){
            return res.status(200).json({
                Message: "Property has been removed successfully"
            })
        }
        return res.status(404).json({
            Message: "Property not found"
        })
    }).catch(err => {
        return res.status(500).json(err)
    })
})

module.exports = adminRouter