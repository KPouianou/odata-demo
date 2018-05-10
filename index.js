// Assign the required packages and dependencies to variables
const express = require('express');
const ODataServer = require('simple-odata-server');
const Adapter = require('simple-odata-server-mongodb');
const { MongoClient } = require('mongodb');
const cors = require('cors');

// Create app variable to initialize Express
const app = express();

// Enable Cross-origin resource sharing (CORS) for app.
app.use(cors());

// Define Odata model of the resource entity i.e. Product.
// The metadata is defined using OData type system called the Entity Data Model (EDM),
// consisting of EntitySets, Entities, ComplexTypes and Scalar Types.
const model = {
  namespace: 'demo',
  entityTypes: {
    Product: {
      _id: { type: 'Edm.String', key: true },
      ProductNum: { type: 'Edm.Int32' },
      Name: { type: 'Edm.String' },
      Description: { type: 'Edm.String' },
      ReleaseDate: { type: 'Edm.DateTime' },
      DiscontinuedDate: { type: 'Edm.DateTime' },
      Rating: { type: 'Edm.Int32' },
      Price: { type: 'Edm.Double' }
    }
  },
  entitySets: {
    products: {
      entityType: 'demo.Product'
    }
  }
};

// Instantiates ODataServer and assigns to odataserver variable.
const odataServer = ODataServer().model(model);

// Connection to demo database in MongoDB
MongoClient.connect('mongodb://localhost/demo', (err, db) => {
  odataServer.adapter(Adapter((cb) => {
    cb(err, db.db('demo'));
  }));
});

// The directive to set app route path.
app.use('/odata', (req, res) => {
  odataServer.handle(req, res);
});

// The app listens on port 3010 and prints the endpoint URI in console window.
const server = app.listen(3010, () => {
  console.log('Server running at http://127.0.0.1:3010/');
});

module.exports = server;

