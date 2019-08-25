var mongo = module.exports = {};

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

mongo.getCollection = function (callbackSuccess, callbackError) {
    MongoClient.connect("mongodb://localhost:27017/",
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
