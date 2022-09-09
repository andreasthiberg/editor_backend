let express = require('express');
const database = require('../db/database');
let router = express.Router();

router.post('/', function(req, res, next) {

    (async () => {
        const db = await database.getDb();
        const result = await db.collection.insertOne(req.body);
        const newId = result.insertedId;
        const newDocument = await db.collection.find({_id : newId}).toArray();
        await db.client.close();
        console.log(newDocument);
        res.json(newDocument);
    })();
});

module.exports = router;