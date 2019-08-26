var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var url = require('./constants/url.js');
const homeData = require('./constants/homeData.js');
var mongo = require('./constants/mongo.js');
var app = express();
var db;
mongo.getCollection(function (dbs) {
    db = dbs;
}, function () {
    console.log("error connecting to db...")
})

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../dist/smarthomes-angular')));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Autherization");
    res.header("Content-Type", "application/json");
    next();
})
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../dist/smarthomes-angular/index.html'));
});

app.post(url.applHomeReqBody, function (req, res) {
    console.log(req.body.homes, req.body.appliances);
    var buildingMetaCursor, homeIdArray;
    if (req.body.homes === undefined || req.body.homes.length === 0) {
        homeIdArray = [0, 1, 2, 3, 4, 5];
        if (req.body.appliances === undefined || req.body.appliances.length === 0) {
            buildingMetaCursor = db.collection('buildingMeta').find({

            }).sort({
                "homeId": 1
            })
        } else {
            var applArrBody = [];
            req.body.appliances.forEach(function (id) {
                applArrBody.push({
                    applianceId: Number(id)
                })
            })
            buildingMetaCursor = db.collection('buildingMeta').find({
                $or: applArrBody
            }).sort({
                "homeId": 1
            })
        }
    } else {
        homeIdArray = req.body.homes;
        if (req.body.appliances === undefined || req.body.appliances.length === 0) {
            //we have to send all data
            console.log("its in here");

            var homeArrBody = [];
            req.body.homes.forEach(function (id) {
                homeArrBody.push({
                    homeId: Number(id)
                })
            })
            buildingMetaCursor = db.collection('buildingMeta').find({
                $or: homeArrBody
            }).sort({
                "homeId": 1
            })
        } else {
            var homeArrBody = [];
            req.body.homes.forEach(function (id) {
                homeArrBody.push({
                    homeId: Number(id)
                })
            })
            var applArrBody = [];
            req.body.appliances.forEach(function (id) {
                applArrBody.push({
                    applianceId: Number(id)
                })
            })
            buildingMetaCursor = db.collection('buildingMeta').find({
                $and: [{
                    $or: homeArrBody
                }, {
                    $or: applArrBody
                }]
            }).sort({
                "homeId": 1
            })
        }
    }
    buildingMetaCursor.toArray(function (err, docs) {
        if (!err) {
            /********************
            Might have to remove here
            ********************/
            homeDataObj = {};
            homeIdArray.forEach(function (id) {
                homeDataObj[id] = [];
                docs.forEach(function (e) {
                    if (id === e.homeId) {
                        homeDataObj[id].push(e.applMongoCode)
                    }
                })

            })
            for (var key in homeDataObj) {
                if (homeDataObj[key].length === 0) {
                    delete homeDataObj[key];
                }
            }
            /********************
            Might have to remove here
            ********************/
            res.send(homeDataObj);
            //            res.send(docs);

        } else {
            res.send(err);
        }
    })
});

app.post(url.getHomesList, function (req, res) {
    console.log(req.body.appliances);
    var buildingMetaCursor;
    if (req.body.appliances === undefined || req.body.appliances.length === 0) {
        buildingMetaCursor = db.collection("buildingMeta").aggregate([{
            "$group": {
                "_id": "$homeId",
                "homeId": {
                    "$first": "$homeId"
                },
                "homeTitle": {
                    "$first": "$homeTitle"
                },
                "homeDescription": {
                    "$first": "$homeDescription"
                },
                "clicked": {
                    "$first": true
                } //for event
            }
        }, {
            "$sort": {
                homeId: 1
            }
        }])
    } else {
        var applArrBody = [];
        req.body.appliances.forEach(function (id) {
            applArrBody.push({
                applianceId: Number(id)
            })
        })
        buildingMetaCursor = db.collection("buildingMeta").aggregate([{
            "$match": {
                $or: applArrBody
            },
        }, {
            "$group": {
                "_id": "$homeId",
                "homeId": {
                    "$first": "$homeId"
                },
                "homeTitle": {
                    "$first": "$homeTitle"
                },
                "homeDescription": {
                    "$first": "$homeDescription"
                },
                /* "clicked": {
                    "$first": true
                } //for event */
            }
        }, {
            "$sort": {
                homeId: 1
            }
        }])
    }
    //    console.log(buildingMetaCursor);
    buildingMetaCursor.toArray(function (err, docs) {
        if (!err) {
            res.send(docs);

        } else {
            res.send(err);
        }
    })
});

app.post(url.getApplianceList, function (req, res) {
    console.log(req.body.homes);
    var buildingMetaCursor;
    if (req.body.homes === undefined || req.body.homes.length === 0) {
        buildingMetaCursor = db.collection("buildingMeta").aggregate([{
            "$group": {
                "_id": "$applianceId",
                "applianceId": {
                    "$first": "$applianceId"
                },
                "applianceTitle": {
                    "$first": "$applianceTitle"
                },
                "clicked": {
                    "$first": true
                }
            }
        }, {
            "$sort": {
                applianceId: 1
            }
        }])
    } else {
        var homesArrBody = [];
        req.body.homes.forEach(function (id) {
            homesArrBody.push({
                homeId: Number(id)
            })
        })
        buildingMetaCursor = db.collection("buildingMeta").aggregate([{
            "$match": {
                $or: homesArrBody
            },
        }, {
            "$group": {
                "_id": "$applianceId",
                "applianceId": {
                    "$first": "$applianceId"
                },
                "applianceTitle": {
                    "$first": "$applianceTitle"
                },
                "clicked": {
                    "$first": true
                }
            }
        }, {
            "$sort": {
                applianceId: 1
            }
        }])
    }
    //    console.log(buildingMetaCursor);
    buildingMetaCursor.toArray(function (err, docs) {
        if (!err) {
            res.send(docs);

        } else {
            res.send(err);
        }
    })
});

app.get(url.minAndMax, function (req, res) {
    //    console.log(req.query.houseIds);
    var temp = {};
    req.query.houseId.split(",").forEach(function (d) {
        temp[d] = true;
    })
    var houseIdStrings = [];
    var i = 0;
    for (var key in temp) {
        houseIdStrings.push(key);
    }
    //    var houseIdStrings = req.query.houseId.split(",");
    var minMaxArray = [];
    var count = 0;
    houseIdStrings.forEach(function (houseId) {
        var collectionName = 'building' + houseId + 'minute';
        console.log(collectionName);
        db.collection(collectionName).aggregate([{
            $group: {
                _id: {},
                max: {
                    $max: "$_id"
                },
                min: {
                    $min: "$_id"
                }
            }
        }]).toArray(function (err, doc) {
            minMaxArray.push(doc[0]);
            count++;
            if (count === houseIdStrings.length) {
                var min = [],
                    max = [];
                minMaxArray.forEach(function (d) {
                    min.push(new Date(d.min).getTime());
                    max.push(new Date(d.max).getTime());
                })
                res.send({
                    min: min.sort(function (a, b) {
                        return b - a
                    })[0],
                    max: max.sort(function (a, b) {
                        return a - b
                    })[0],
                });
            }
        })
    })
    //    })
});

app.post(url.allApplHomesSummary, function (req, res) {
    console.log("from: " + req.body.from + ", To: " + req.body.to);
    var houseData = req.body.houseData;
    /*    var houseData = {
            "0": [1, 2, 3, 4, 5, 6, 7, 8],
            "1": [1, 2, 3, 4, 5, 6, 7, 8, 9],
            "2": [1, 2, 3, 4, 5, 6, 7, 8, 9],
            "3": [1, 2, 3, 4, 5, 6, 7, 8, 9],
            "4": [2, 3, 4, 5, 6, 7, 8, 9],
            "5": [1, 2, 3, 4, 5, 6, 7, 8, 9],
        }*/
    var houseDataArray = [];
    for (key in houseData) { /* to clean data and to remove duplicates */
        var temp = {};
        houseData[key].forEach(function (d) {
            temp[d] = true;
        })
        var test = [];
        for (k in temp) {
            test.push(k);
        }
        houseData[key] = test;
        houseDataArray.push(key);
    }
    console.log("Krish houseDataArray", houseDataArray, houseData);

    var resultToSend = [];
    var completeData = [];
    var total = 0;
    var objCount = 0;
    function resultReStructureSummary() {
        console.log("last", Object.keys(houseData).length - 1, objCount);
        // restructuring data
        var homesArrBody = [];
        houseDataArray.forEach(function (id) {
            homesArrBody.push({
                homeId: Number(id)
            })
        })
        /******
        for restructring the data
        ******/
        db.collection("buildingMeta").aggregate([{
            "$match": {
                $or: homesArrBody
            },
        }, {
            "$group": {
                "_id": {
                    $concat: [{
                        $substr: ["$homeId", 0, 2]
                    }, "_", {
                        $substr: ["$applMongoCode", 0, 2]
                    }]
                },
                "mongoRefCode": {
                    "$first": {
                        $concat: [{
                            $substr: ["$homeId", 0, 2]
                        }, "_", {
                            $substr: ["$applMongoCode", 0, 2]
                        }]
                    }
                },
                "applianceId": {
                    "$first": "$applianceId"
                }
            }
        }, {
            "$sort": {
                "applianceId": 1
            }
        }]).toArray(function (err, applHomeRefCode) {
            if (!err) {
                //                console.log("mongoRefs", applHomeRefCode);
                var temp = {},
                    applUniqueArray = [];
                applHomeRefCode.forEach(function (d) {
                    temp[d.applianceId] = true;
                })
                for (var key in temp) {
                    applUniqueArray.push(Number(key));
                }
                var finalDataArray = [];
                resultToSend.forEach(function (r) {
                    var finalDataObject = { total: 0 };
                    applUniqueArray.forEach(function (u) {
                        finalDataObject["y" + u] = 0;
                        applHomeRefCode.forEach(function (d) {
                            if (u === d.applianceId) {
                                // console.log(u,d._id,resultToSend[0]["y"+d._id]);
                                var toBeSummed = r["y" + d._id];
                                if (toBeSummed) {
                                    finalDataObject["y" + u] = finalDataObject["y" + u] + r["y" + d._id];
                                    finalDataObject["total"] = finalDataObject["total"] + r["y" + d._id];
                                } else {
                                    finalDataObject["y" + u] = finalDataObject["y" + u] + 0;
                                    finalDataObject["total"] = finalDataObject["total"] + 0;
                                }
                            }
                            finalDataObject["x"] = r["x"];
                        })
                    })
                    finalDataArray.push(finalDataObject)
                })
                //                        console.log(finalDataArray);
                res.send(finalDataArray);
            }
        });
    }
    for (var key in houseData) {
        var collectionName = 'building' + key + 'minute';
        var pipeLine = [{
            "$match": {
                _id: {
                    $gt: new Date(Number(req.body.from)),
                    $lt: new Date(Number(req.body.to))
                }
            }
        }, {
            $group: {
                _id: {}
            }
        }, {
            $sort: {
                _id: 1
            }
        }];
        var applianceArray = [];
        houseData[key].forEach(function (d) {
            //            applianceArray.push("$value.appliance" + d);
            pipeLine[1].$group["y" + key + "_" + d] = {
                $sum: "$a" + d
            };
        })
        /*pipeLine[1].$group["y" + key] = {
            $sum: {
                $sum: applianceArray
            }
        };*/
        db.collection(collectionName).aggregate(pipeLine).toArray(function (err, docs) {
            if (!err) {
                completeData.push(docs);
                if (objCount === Object.keys(houseData).length - 1) {
                    resultToSend = [];
                    resultToSend.push({});
                    completeData.forEach(function (docs, objCount, c) {
                        docs.forEach(function (doc, k, j) {
                            resultToSend.forEach(function (d, e, f) {
                                for (var key in doc) {
                                    if (key != "x" && key != "_id")
                                        d[key] = doc[key];
                                }
                            })
                        })
                    })
                    resultReStructureSummary();
                }
                objCount++;
                /*if (objCount === 0) {
                    console.log("first loop", Object.keys(houseData).length);
                    docs.forEach(function (doc) {
                        var eachObj = {};
                        for (var keyRes in doc) {
                            //                            console.log(keyRes);
                            //                            if (keyRes === "x") {
                            //                                eachObj[keyRes] = doc[keyRes];
                            //                            } else
                            if (keyRes != "_id") {
                                eachObj[keyRes] = doc[keyRes];
                                //                                eachObj["y" + Object.keys(houseData)[objCount]] = doc[keyRes]; //Object.keys(houseData)[objCount] is the key that we need;
                            }
                        }
                        //                        console.log(eachObj);
                        resultToSend.push(eachObj);
                    })
                    if (Object.keys(houseData).length === 1) {
                        resultReStructureSummary();
                    }
                } else {
                    console.log("not last", Object.keys(houseData).length - 1, objCount);
                    docs.forEach(function (doc, k) {
                        for (var keyRes in doc) {
                            //                            console.log(keyRes);
                            if (keyRes === "x") {
                                //                                resultToSend[k][keyRes] = doc[keyRes];
                            } else if (keyRes != "_id") {
                                resultToSend[k][keyRes] = doc[keyRes];
                                //                                resultToSend[k]["y" + Object.keys(houseData)[objCount]] = doc[keyRes];
                            }
                        }
                    })
                    if (objCount === Object.keys(houseData).length - 1) {
                        resultReStructureSummary();
                    }
                }
                objCount++;*/
            } else {
                res.send(err);
            }
        })
    }
});

app.post(url.allApplHomesData, function (req, res) {
    console.log("from: " + req.body.from + ", To: " + req.body.to + " - For: " + req.body.houseData);
    var houseData = req.body.houseData;
    var minuteOrHour;
    if (Number(req.body.to) - Number(req.body.from) > 5399999995 / 2) {
        minuteOrHour = 'hour';
        console.log("hour data");
    } else {
        console.log("minute data");
        minuteOrHour = 'minute';
    }
    

    /* to clean data and to remove duplicates */
    var houseDataArray = [];
    for (key in houseData) {
        var temp = {};
        houseData[key].forEach(function (d) {
            temp[d] = true;
        })
        var test = [];
        for (k in temp) {
            test.push(k);
        }
        houseData[key] = test;
        houseDataArray.push(key);
    }
    console.log("houseDataArray", houseDataArray);
    //    var resArray = [];
    var completeData = [];
    var resultToSend = [];
    var objCount = 0;
    for (var key in houseData) {
        //    for (var i = 0; i < Object.keys(houseData).length; i++) {
        //        var key = Object.keys(houseData)[i];
        //        console.log('building' + key + minuteOrHour);
        //        console.log(houseData[key]);

        var collectionName = 'building' + key + minuteOrHour;
        var pipeLine = [{
            "$match": {
                _id: {
                    $gt: new Date(Number(req.body.from)),
                    $lt: new Date(Number(req.body.to))
                }
            }
        }, {
            $group: {
                _id: {
                    hour: {
                        $hour: "$_id"
                    },
                    minute: {
                        $floor: {
                            $divide: [{
                                $minute: "$_id"
                            }, 60]
                            //                            }, req.body.interval]
                        }
                    }
                },
                x: {
                    $first: "$_id"
                }
            }
        }, {
            $sort: {
                _id: 1
            }
        }];
        var applianceArray = [];
        houseData[key].forEach(function (d) {
            //            applianceArray.push("$value.appliance" + d);
            pipeLine[1].$group["y" + key + "_" + d] = {
                $avg: "$a" + d
            };
        })
        /*pipeLine[1].$group["y" + key] = {
            $avg: {
                $sum: applianceArray
            }
        };*/
        //        console.log(JSON.stringify(pipeLine));
        function resultReStructure() {
            console.log("last", Object.keys(houseData).length - 1, objCount);
            // restructuring data
            var homesArrBody = [];
            houseDataArray.forEach(function (id) {
                homesArrBody.push({
                    homeId: Number(id)
                })
            })
            /******
            for restructring the data
            ******/
            db.collection("buildingMeta").aggregate([{
                "$match": {
                    $or: homesArrBody
                },
            }, {
                "$group": {
                    "_id": {
                        $concat: [{
                            $substr: ["$homeId", 0, 2]
                        }, "_", {
                            $substr: ["$applMongoCode", 0, 2]
                        }]
                    },
                    "mongoRefCode": {
                        "$first": {
                            $concat: [{
                                $substr: ["$homeId", 0, 2]
                            }, "_", {
                                $substr: ["$applMongoCode", 0, 2]
                            }]
                        }
                    },
                    "applianceId": {
                        "$first": "$applianceId"
                    }
                }
            }, {
                "$sort": {
                    "applianceId": 1
                }
            }]).toArray(function (err, applHomeRefCode) {
                if (!err) {
                    //                    console.log("mongoRefs", applHomeRefCode);
                    var temp = {},
                        applUniqueArray = [];
                    applHomeRefCode.forEach(function (d) {
                        temp[d.applianceId] = true;
                    })
                    for (var key in temp) {
                        applUniqueArray.push(Number(key));
                    }
                    var finalDataArray = [];
                    resultToSend.forEach(function (r) {
                        var finalDataObject = { total: 0 };
                        applUniqueArray.forEach(function (u) {
                            finalDataObject["y" + u] = 0;
                            applHomeRefCode.forEach(function (d) {
                                if (u === d.applianceId) {
                                    // console.log(u,d._id,resultToSend[0]["y"+d._id]);
                                    var toBeSummed = r["y" + d._id];
                                    if (toBeSummed) {
                                        finalDataObject["y" + u] = finalDataObject["y" + u] + r["y" + d._id];
                                        finalDataObject["total"] = finalDataObject["total"] + r["y" + d._id];
                                    }
                                }
                                finalDataObject["x"] = r["x"];
                            })
                        })
                        finalDataArray.push(finalDataObject)
                    })
                    //                        console.log(finalDataArray);
                    res.send(finalDataArray);
                }
            });
        }
        db.collection(collectionName).aggregate(pipeLine).toArray(function (err, docsAll) {
            if (!err) {
                completeData.push(docsAll);
                if (objCount === Object.keys(houseData).length - 1) {
                    var timeUniq = {};
                    resultToSend = [];
                    completeData.forEach(function (d) {
                        d.forEach(function (e) {
                            timeUniq[e._id.hour] = true;
                        })
                    })
                    for (var key in timeUniq) {
                        resultToSend.push({ xH: Number(key) });
                    }

                    completeData.forEach(function (docs, objCount, c) {
                        docs.forEach(function (doc, k, j) {
                            resultToSend.forEach(function (d, e, f) {
                                if (d.xH === doc._id.hour) {
                                    for (var key in doc) {
                                        if (key != "_id")
                                            d[key] = doc[key];
                                    }
                                }
                            })
                        })
                    })
                    resultReStructure();
                }
                objCount++;
                /*if (objCount === 0) {
                    console.log("first loop", Object.keys(houseData).length);
                    docs.forEach(function (doc) {
                        var eachObj = {};
                        for (var keyRes in doc) {
                                                        console.log(doc[keyRes]);
                            //                            if (keyRes === "x") {
                            //                                eachObj[keyRes] = doc[keyRes];
                            //                            } else
                            if (keyRes != "_id") {
                                eachObj[keyRes] = doc[keyRes];
                                //                                eachObj["y" + Object.keys(houseData)[objCount]] = doc[keyRes]; //Object.keys(houseData)[objCount] is the key that we need;
                            }
                        }
                        //                        console.log(eachObj);
                        resultToSend.push(eachObj);
                    })
                    if (Object.keys(houseData).length === 1) {
                        resultReStructure();
                    }
                } else {
                    console.log("not last", Object.keys(houseData).length - 1, objCount);
                    docs.forEach(function (doc, k) {
                        for (var keyRes in doc) {
                            //                            console.log(keyRes);
                            if (keyRes === "x") {
                                //                                resultToSend[k][keyRes] = doc[keyRes];
                            } else if (keyRes != "_id") {
                                resultToSend[k][keyRes] = doc[keyRes];
                                //                                resultToSend[k]["y" + Object.keys(houseData)[objCount]] = doc[keyRes];
                            }
                        }
                    })
                    if (objCount === Object.keys(houseData).length - 1) {
                        resultReStructure();
                    }
                }
                objCount++;*/
            } else {
                res.send(err);
            }
        })
    }
});

app.post(url.allApplHomesDataNormal, function (req, res) { //for data over the time
    console.log("from: " + req.body.from + ", To: " + req.body.to + " - For: " + req.body.homeId);
    var minuteOrHour;
    minuteOrHour = 'hour';
    
    /* if (Number(req.body.to) - Number(req.body.from) > 30*24*60*60*1000) {
        minuteOrHour = 'day';
        console.log("day data");
    } else {
        console.log("hour data");
        minuteOrHour = 'hour';
    } */
    var houseData = req.body.houseData;

    /* to clean data and to remove duplicates */
    var houseDataArray = [];
    for (key in houseData) {
        var temp = {};
        houseData[key].forEach(function (d) {
            temp[d] = true;
        })
        var test = [];
        for (k in temp) {
            test.push(k);
        }
        houseData[key] = test;
        houseDataArray.push(key);
    }

    var dateForm = function (inputDate) {
        return new Date(new Date(inputDate).getFullYear() + "-" + (new Date(inputDate).getMonth() + 1) + "-" + new Date(inputDate).getDate())
    }
    var nextDay = function (inputDate) {
        return new Date(new Date(inputDate).getFullYear() + "-" + (new Date(inputDate).getMonth() + 1) + "-" + (new Date(inputDate).getDate() + 1))
    }
    console.log("houseDataArray", houseDataArray);
    var resultToSend = [];
    var completeData = [];
    var objCount = 0;
    for (var key in houseData) {
        var collectionName = 'building' + key + minuteOrHour;
        var pipeLine = [{
            "$match": {
                _id: {
                    $gt: new Date(Number(req.body.from)),
                    $lt: new Date(Number(req.body.to))
                }
            }
        }, {
            $group: {
                _id: {
                    year: {
                        $year: "$_id"
                    },
                    month: {
                        "$month": "$_id"
                    },
                    day: {
                        "$dayOfMonth": "$_id"
                    },
                },
                x: {
                    $first: "$_id"
                }
            }
        }, {
            $sort: {
                _id: 1
            }
        }];
        houseData[key].forEach(function (d) {
            pipeLine[1].$group["y" + key + "_" + d] = {
                $avg: "$a" + d
            };
        })
        function resultReStructure() {
            console.log("last", Object.keys(houseData).length - 1, objCount);
            // restructuring data
            var homesArrBody = [];
            houseDataArray.forEach(function (id) {
                homesArrBody.push({
                    homeId: Number(id)
                })
            })
            /******
            for restructring the data
            ******/
            db.collection("buildingMeta").aggregate([{
                "$match": {
                    $or: homesArrBody
                },
            }, {
                "$group": {
                    "_id": {
                        $concat: [{
                            $substr: ["$homeId", 0, 2]
                        }, "_", {
                            $substr: ["$applMongoCode", 0, 2]
                        }]
                    },
                    "mongoRefCode": {
                        "$first": {
                            $concat: [{
                                $substr: ["$homeId", 0, 2]
                            }, "_", {
                                $substr: ["$applMongoCode", 0, 2]
                            }]
                        }
                    },
                    "applianceId": {
                        "$first": "$applianceId"
                    }
                }
            }, {
                "$sort": {
                    "applianceId": 1
                }
            }]).toArray(function (err, applHomeRefCode) {
                if(err) throw err;
                if (!err) {
                    var temp = {},
                        applUniqueArray = [];
                    applHomeRefCode.forEach(function (d) {
                        temp[d.applianceId] = true;
                    })
                    for (var key in temp) {
                        applUniqueArray.push(Number(key));
                    }

                    var finalDataArray = [];
                    resultToSend.forEach(function (r) {
                        var finalDataObject = { total: 0 };
                        applUniqueArray.forEach(function (u) {
                            applHomeRefCode.forEach(function (d) {
                                if (u === d.applianceId) {
                                    var toBeSummed = r["y" + d._id];
                                    if (toBeSummed)
                                        finalDataObject["total"] = finalDataObject["total"] + toBeSummed;
                                    else
                                        finalDataObject["total"] = finalDataObject["total"] + 0;
                                }
                                finalDataObject["x"] = r["x"];
                            })
                        })
                        finalDataArray.push(finalDataObject)
                    })
                    res.send(finalDataArray);
                }
            });
        }
        db.collection(collectionName).aggregate(pipeLine).toArray(function (err, docs) {
            if(err) throw err;
            if (!err) {
                completeData.push(docs);
                if (objCount === Object.keys(houseData).length - 1) {
                    resultToSend = [];
                    for (var i = req.body.from + (1000 * 60 * 60 * 24); i < req.body.to + (1000 * 60 * 60 * 24); i += (1000 * 60 * 60 * 24)) {
                        resultToSend.push({ x: dateForm(i).getTime() })
                    }
                    completeData.forEach(function (docs, objCount, c) {
                        docs.forEach(function (doc, k, j) {
                            resultToSend.forEach(function (d, e, f) {
                                if (dateForm(d.x).getTime() === dateForm(doc.x).getTime()) {
                                    for (var key in doc) {
                                        if (key != "x" && key != "_id")
                                            d[key] = doc[key];
                                    }
                                }
                            })
                        })
                    })
                    resultReStructure();
                }
                objCount++;
            } else {
                res.send(err);
            }
        })
    }
});


var server = app.listen(process.env.PORT || 5000, function () {
    console.log("Listening on port: ", server.address().port);
})



