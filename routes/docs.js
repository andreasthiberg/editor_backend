// Routes for interacting with document database.

let express = require('express');
const database = require('../models/database');
let router = express.Router();
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;

// Middleware to confirm incoming JWT.
router.use((req,res,next) => {
    const token = req.headers['x-access-token'];

    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
            res.send(err);
        } else {
            next();
        }
    });
}) 

// Returns all documents.
router.get('/', function(req, res) {

    (async () => {
        const db = await database.getDb();
        const resultSet = await db.docsCollection.find().toArray();
        await db.client.close();
        res.json({docs:resultSet});
    })();
});


// Creates a new document based on input.
router.post('/create', function(req, res) {

    (async () => {
        const db = await database.getDb();
        const newDocBody = {
            name: req.body.name,
            content: req.body.content,
            owner: req.body.owner,
            allowed_users: [req.body.owner],
            comments: []
        }
        const result = await db.docsCollection.insertOne(newDocBody);
        const newId = result.insertedId;
        const newDocument = await db.docsCollection.find({_id : newId}).toArray();
        await db.client.close();
        res.json(newDocument);
    })();
});

//Deletes all documents from the database.
router.get('/remove-all', function(req, res, next) {

    (async () => {
        const db = await database.getDb();
        await db.docsCollection.deleteMany();
        await db.client.close();
        res.send("Documents removed!");
    })();
});


//Saves changes to a document with new content.
router.post('/save', function(req, res) {

    (async () => {
        
        const db = await database.getDb();
        const filter = { _id: ObjectId(req.body["_id"]) };
        const updateDocument = { $set: { 
            name: req.body.name,
            content: req.body.content
        }};
        await db.docsCollection.updateOne(filter,updateDocument);
        await db.client.close();
        res.send("Saved");
    })();

});

//Add allowed user to document
router.post('/adduser', function(req, res) {

    (async () => {
        
        const db = await database.getDb();
        const filter = { _id: ObjectId(req.body["id"]) };
        console.log(await db.docsCollection.find(filter).toArray())
        const matchingDocs = await db.docsCollection.find(filter).toArray();
        const previousDoc = matchingDocs[0];
        const previousUsers = [...previousDoc.allowed_users];
        previousUsers.push(req.body["user"]);
        
        const updateDocument = { $set: {    
            allowed_users: previousUsers
        }};

        await db.docsCollection.updateOne(filter,updateDocument);
        await db.client.close();
        res.send("Saved");
    })();

});

//Add comment to specified document row
router.post('/addcomment', function(req, res) {

    (async () => {
        
        const db = await database.getDb();
        const filter = { _id: ObjectId(req.body["id"]) };
        const matchingDocs = await db.docsCollection.find(filter).toArray();
        const previousDoc = matchingDocs[0];
        let previousComments = [];
        if(previousDoc.comments.length > 0){
            previousComments = copyObjectArray(previousDoc.comments);
        }
        const newComment = {"row":req.body["row"],"content":req.body["comment"]}
        previousComments.push(newComment);
        
        const updateDocument = { $set: {    
            comments: previousComments
        }};

        await db.docsCollection.updateOne(filter,updateDocument);
        await db.client.close();
        res.send("Added");
    })();

});

function copyObjectArray(arr){
    console.log(arr)
    let newArray = [];
    for (i in arr){
        newArray.push({...arr[i]})
    }
    console.log(newArray)
    return newArray
}

module.exports = router;