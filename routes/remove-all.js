let express = require('express');
const database = require('../db/database');
let router = express.Router();

router.get('/', function(req, res, next) {

    (async () => {
        const db = await database.getDb();
        await db.collection.deleteMany();
        await db.client.close();
    })();
});

module.exports = router;