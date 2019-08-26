var mongo = module.exports = {};

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

mongo.getCollection = function (callbackSuccess, callbackError) {
    MongoClient.connect("mongodb+srv://chaitu257:cmk357@smartgrid-shqik.mongodb.net/test?retryWrites=true&w=majority",
    // MongoClient.connect("mongodb://localhost:27017/",
        { useNewUrlParser: true, useUnifiedTopology: true },
        function (err, client) {
            if (err) {
                console.log(err);
                callbackError(err);
            } else {
                callbackSuccess(client.db('smartgridnew'));
                //            callbackSuccess(db.collection(collectionName));
                //            db.close();
            }
            //    collection = db.collection('sample');
        });
}


/* "mongodb+srv://chaitu257:cmk357@smartgrid-shqik.mongodb.net/test?retryWrites=true&w=majority"

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://cmk357:<password>@smartgrid-shqik.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
}); */
