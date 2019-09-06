# Rental Property Website

This is the back-end for a Rental Property Web App using Node.js, Express, Mongoose and some other packages.

## Requirements

For development, you will need you will [Node.js](https://nodejs.org/en/), [NPM](https://www.npmjs.com/) and all the packages in package.json to be installed.

## Note

A 'superadmin' type user is seeded from a .env file like so:

'SA_EMAIL=super@admin.com'

The GET '/seedSuperAdmin' endpoint will provide a randomly generated password for this user when first run.


## Install

To install all the required packages, run the command below in the terminal after installing [Node.js](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/).

```sh
$ npm install
```

## Usage
If the OS is linux, you must install redis-server on your system first. Please see https://tecadmin.net/install-redis-ubuntu/ for installing redis-server on your system.

To start the server run the command below in the terminal.

If Linux:
```sh
$ npm start
```

If Windows:
```sh
$ npm run start-win
```


Install an API Development Environment like [Postman](https://www.getpostman.com/) to make API requests. You need to set Header of content type 'application/json' and use JSON to pass in the values/fields to make a request.

## Server end-points

### endpoints for 'Issues'

#### Create an issue

```sh
POST '/createIssue'
form-fields:
{
  'raisedBy': {
        'userId': ObjectId(),
        'userType': {
            'type': 'String',
            'enum': ['Landlord', 'Tenant']
        },
        'userName': 'String'
    },
    'submittedTo': {
        'userId': ObjectId(),
        'userName': 'String'
    },
    'acceptedBy':{
        'userId': ObjectId(),
        'userName': 'String'
    },
    'workStatus': {
        'type': 'String',
        'enum': ['Raised', 'Booked', 'Done']
    },
    'propertyDetail':{
        ObjectId()
    },
    'landLord':{
        'userId': ObjectId(),
        'userName': 'String'
    },
    'priority':{
        'type': 'String',
        'enum':['Low','Medium','High']
    },
    'status': {
        'type': 'String',
        'enum': ['Active', 'Deleted'],
        'default': 'Active'
      }
}
```

#### Get an Issue by ID

```sh
GET '/getIssue/{replace with id}'
query parameter:
{
  '_id': ObjectId()
}
```

#### Update an issue by ID

```sh
PUT '/updateIssue/{replace with id}'
query parameter:
{
  '_id': ObjectId()
}
```

#### Delete an issue by ID

```sh
DELETE '/deleteIssue/{replace with id}'
query parameter:
{
  '_id': ObjectId()
}
```

### endpoints for 'Properties'

#### Get all of the properties

```sh
GET '/getPropertyList'
```

This endpoint has also optional filters (propertyType,rentStatus,Country, State, City)

```sh
GET '/getPropertyList?propertyType=house&rentStatus=rent&Country=USA&State=NY&City=Utica'
query parameters: 
{
  'Country': String,
  'State': String,
  'City' : String,
  'propertyType' : String,
  'rentStatus' : String
}
```

#### Create a property

```sh
POST '/createProperty'
form-fields:
{
  status: {
    type: String,
    enum: ['Active', 'Deleted'],
    default: 'Active'
  },
  propertyType: {
    type: String,
    enum: ['house', 'flat', 'maisonette', 'bungalow', 'room only', 'garage'],
    default: 'house'
  },
  propertySubType: String,
  propertyImageUrls:[{type:String}],
  leaseType:String,
  Country:String,
  Region:String,
  State: String,
  City:String,
  PostalCode: Number,
  State: String,
  HouseNumber: Number,
  Address:String,
  Position: {
    Latitude: Number,
    Longitude: Number,
  },
  viewRequested:Boolean,
  rentStatus: {
    type: String,
    enum: ['for sale', 'rent'],
    default: 'for sale'
  },
  availability: {
    type: String,
    enum: ['taken', 'let agreed', 'available'],
    default: 'available'
  },
  condition: {
    type: String,
    enum: ['furnished', 'part-furnished', 'unfurnished'],
    default: 'unfurnished'
  },
  cooling: String,
  IsLet: Boolean,
  Heating: String,
  NumberOfRoom: Number,
  EnSuite: Number,
  duration: Date,
  propertyPrice: Number,
  propertyCurrency: Number,
  propertyPhotos: Array,
  propertVideos: Array,
  sponsored: Boolean
}
```

#### Get a property by ID

```sh
GET '/getProperty/{replace with id}'
query parameter:
{
  '_id': ObjectId()
}
```

#### Update a property by ID

```sh
PUT '/updateProperty/{replace with id}'
query parameter:
{
  '_id': ObjectId()
}
```

#### Delete a property by ID

```sh
DELETE '/deleteProperty/{replace with id}'
query parameter:
{
  '_id': ObjectId()
}
```

#### Toggle sponspored attribute of a property using ID

```sh
PUT '/toggleSponsorProperty/:id'
query parameter:
{
  '_id': ObjectId()
}
```

### endpoints for 'Ratings'

#### Create a rating

```sh
POST '/createRating'
form-fields:
{
  'userId': ObjectId(),
  'propertyId': ObjectId(),
    'userName': 'String',
    'picture': 'String',
    'rating': 'Number',
    'userType':{
        'type': 'String',
        'enum':['Landlord','Tenant']
    },
    'status': {
        'type': 'String',
        'enum': ['Active', 'Deleted'],
        'default': 'Active'
    }
}
```

#### Get Ratings by Property ID

```sh
GET '/getAllRating/{replace with the property id}'
query parameter:
{
  '_id': ObjectId()
}
```

#### Get rating by ID

```sh
GET '/getRating/{replace with id}
query parameter:
{
  '_id': ObjectId()
}
```

#### Update a rating by ID

```sh
PUT '/updateRating/{replace with id}'
query parameter:
{
  '_id': ObjectId()
}
```

#### Delete a rating by ID

```sh
DELETE '/deleteRating/{replace with id}'
query parameter:
{
  '_id': ObjectId()
}
```

### endpoints for 'Templates'

#### Create a template

```sh
POST '/createTemplate'
form-fields:
{
  'templateDetail': 'String',
  'status': {
    'type': 'String',
    'enum': ['Active', 'Deleted'],
    'default': 'Active'
  }
}
```

### Get a template by ID

```sh
GET '/getTemplate/{replace with id}
query parameter:
{
  '_id': ObjectId()
}
```

#### Update a template by ID

```sh
PUT '/updateTemplate/{replace with id}'
query parameter:
{
  '_id': ObjectId()
}
```

#### Delete a template by ID

```sh
DELETE '/deletTemplate/{replace with id}'
query parameter:
{
  '_id': ObjectId()
}
```

### endpoints for 'Users'

#### Seed super-admin

```sh
GET '/seedSuperAdmin'
```

#### Login a user

```sh
POST '/login'
form-fields:
{
  'email': 'String',
  'password': 'String'
}
```

#### Logout a user

```sh
POST '/logout'
```

#### Create a user

```sh
POST '/createUser'
form-fields:
{
    email: { type: String, unique: true },
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    userType: {
      type: String,
      enum: ["Landlord", "Tenant", "Contractor", "Admin", "SuperAdmin"]
    },
    status: {
      type: String,
      enum: ["Active", "Deleted"],
      default: "Active"
    },
    region: String, // Will update it
    profile: {
      name: String,
      gender: String,
      location: String,
      picture: {
        imageURL: String,
        imageID: String
      }
    },
    provider: {
      type: String,
      default: "local"
    }
}
```

### Get a user by ID

```sh
GET '/getUser/{replace with id}
query parameter:
{
  '_id': ObjectId()
}
```

#### Update a user by ID

```sh
PUT '/updateUser/{replace with id}'
query parameter:
{
  '_id': ObjectId()
}
```

#### Delete a user by ID

```sh
DELETE '/deleteUser/{replace with id}'
query parameter:
{
  '_id': ObjectId()
}
```

#### Login as admin

```sh
POST '/adminLogin'
query parameter:
{
admin: process.env.USER,
password: process.env.PWD
}
```

#### Logout for admin

```sh
GET '/adminLogout'
```
### endpoints for 'Admin API'

#### Admin create property and validate address

Admin create property is an endpoint that helps create accurate properties by checking the giving address
and make sure of its accuracy. 

The address format is: 
houseNumber, street, city, state postalcode, country

```sh
POST '/adminapi/property/&houseNumber={housenumber}&street={street}&city={city}&state={state}&postalCode={postalCode}&country={country}'

EXAMPLE: 
'/adminapi/property/&houseNumber=132&street=Sea%20St&city=Castine&state=ME&postalCode=04421&country=USA'
```
#### Admin delete property

```sh
DELETE '/deleteProperty/{replace with id}'
```

### endpoints for 'Social Login'

#### Login with facebook

Login with facebook and create a user with data fetched from facebook.
You can see detail in 'config/passport.js' about login and register.

You have to change 'facebook.clientID' and 'facebook.clientSecret' in 'config/development.js' to yours with below page.
(https://developers.facebook.com)

```sh
GET '/auth/facebook'
form-fields:
{
    'email': { 'type': 'String', 'unique': 'true' },
    'profile': {
      'name': 'String',
      'gender': 'String',
      'location': 'String',
      'picture': {
        'imageURL': 'String',
        'imageID': 'String'
      }
    },
    'provider': 'facebook'
}
```

#### Login with google

Login with google and create a user with data fetched from google.
You can see detail in 'config/passport.js' about login and register.

You have to change 'google.clientID' and 'google.clientSecret' in 'config/development.js' to yours with below page.
(https://console.developers.google.com)

```sh
GET '/auth/google'
form-fields:
{
    'email': { 'type': 'String', 'unique': 'true' },
    'profile': {
      'name': 'String',
      'gender': 'String',
      'location': 'String',
      'picture': {
        'imageURL': 'String',
        'imageID': 'String'
      }
    },
    'provider': 'google'
}
```

#### Login with linkedin

Login with linkedin and create a user with data fetched from linkedin.
You can see detail in 'config/passport.js' about login and register.

You have to change 'linkedin.clientID' and 'linkedin.clientSecret' in 'config/development.js' to yours with below page.
(https://www.linkedin.com/developers)

```sh
GET '/auth/linkedin'
form-fields:
{
    'email': { 'type': 'String', 'unique': 'true' },
    'profile': {
      'name': 'String',
      'gender': 'String',
      'picture': {
        'imageURL': 'String',
        'imageID': 'String'
      }
    },
    'provider': 'linkedin'
}
```
#### message endpoints

join chatting room api
```sh
Join chatting: '/message/chat/:userid/:roomid/:propertyId'
Admin Chatting: 'admin/message/'
```
if propertyId is 0, get rooms from rooms collection
else if propertyId is not 0, create new room with propertyId and get rooms.

if roomid is 0, currentRoom is set to first room in rooms getting from rooms collection.
if roomid is not 0, currentRoom is set to the room with roomid

### socketio endpoint
```sh
join room: io('/chatroom')
```
In client side, when socket get connect signal, emit join signal
```sh
join room: io.connect('/join', roomid, username) // join the room with roomid and username
```
when server socket is receiving 'join',
if user is admin, send all messages to client.
if user is normal user, find message with roomid and username and send them to client.

In server side, when socket get join signal, emit updateUserList, updateMessageList signal
```sh
update message signal: io.on('/updateMessageList', messages)
```
In client side, when socket get updateMessageList signal, update message history with received datas.

```sh
update user signal: io.on('/updateUserList', messages)
```
In client side, when socket get User signal, update user list with received datas.

```sh
new message: io.on('/newMessage', username, roomid, message)
```
In server side, when get newMessage signal, insert message to messages collection and send it to peer and admin.
# rentalpropertywebsite
