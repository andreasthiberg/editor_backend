let express = require('express');
const database = require('../db/database');
let router = express.Router();
const ObjectId = require('mongodb').ObjectId;

router.post('/', function(req, res, next) {

    (async () => {
        const db = await database.getDb();
        const filter = { _id: ObjectId(req.body["_id"]) };
        const updateDocument = { $set: { 
            name: req.body.name,
            content: req.body.content
        }};
        await db.collection.updateOne(filter,updateDocument);
        await db.client.close();

    })();
});

module.exports = router;