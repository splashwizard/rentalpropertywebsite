const config = {
    "mode": "production",
    'process.env.PORT': 3021,
    "database": {
        "userName": "",
        "password": "",
        "port": 27017,
        "host": "",
        "databaseName": "",
    },
    "redis": {
		"host": "127.0.0.1",
		"port": 6379,
		"password": ""
	}
 };
 module.exports = config;