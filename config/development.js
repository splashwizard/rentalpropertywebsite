const config = {
    "mode": "development",
    'process.env.PORT': 3020,
    "database": {
        "userName": "",
        "password": "",
        "port": 27017,
        "host": "localhost",
        "databaseName": "rentalDB",

    },
    "facebook": {
        "clientID": "871609083225268",
        "clientSecret": "65c61febfba0d93703107ea5653ced35",
        "callbackURL": "http://localhost:3020/auth/facebook/callback",
        "profileFields": ['id', 'displayName', 'photos', 'email', 'gender', 'location'],
    },
    "google": {
        "clientID": "88423927145-9c1d2sm8brih8qog06vdvoqsvqpg4632.apps.googleusercontent.com",
        "clientSecret": "rxCrPiRIavqaKe4QML7uEaMT",
        "callbackURL": "http://localhost:3020/auth/google/callback",
        "scope": ['email', 'profile']
    },
    "linkedin": {
        "clientID": "810wj62q5q2dkv",      //LINKEDIN_API_KEY
        "clientSecret": "hDY0znDwd2hsgb68",   //LINKEDIN_SECRET_KEY
        "callbackURL": "http://localhost:3020/auth/linkedin/callback",
        "scope": ['r_liteprofile', 'r_emailaddress'], //'r_fullprofile',
        "state": true,
    },
};
module.exports = config;

