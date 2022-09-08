let express = require('express');
const database = require('../db/database');
let router = express.Router();
const datbaase = require('../db/database');

router.get('/', function(req, res, next) {

    (async () => {
        const db = await database.getDb();
        const resultSet = await db.collection.find().toArray();
        await db.client.close();
        res.json(resultSet);
    })();
});

module.exports = router;