var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//Database Connection Url
var uri =  config.database.host + ":" + config.database.port + "/" + config.database.databaseName;
var options = {
    user: config.database.userName,
    pass: config.database.password
};

//Connection Establishment

mongoose.connect(uri, options, function(error) {
    console.log( uri, options.user, options.pass)
    if(error) {
        console.log('DB connection error: ', error);

    }
    else {
        console.log(" DB Connected");
    }
});

module.exports = mongoose;