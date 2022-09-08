var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    const data = {
        data: {
            msg: "Start pages"
        }
    };

    res.json(data);
});

module.exports = router;