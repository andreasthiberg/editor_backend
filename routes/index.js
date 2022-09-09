let express = require('express');
let router = express.Router();

router.get('/', (req, res,) => {
    res.send("Välkommen till mitt API.");
});

module.exports = router;