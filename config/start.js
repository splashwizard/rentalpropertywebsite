var mode = process.env.NODE_ENV ? process.env.NODE_ENV : "development";

switch (mode) {
    case "development":

        config = require('./development.js');
        break;

    case "production":

        config = require("./production.js");
        break;
    case "staging":

        config = require("./staging.js");
        break;
    default:
        config = require("./development.js");

}
module.exports = config