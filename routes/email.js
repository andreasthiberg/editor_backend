/* Routes for sending email */
let express = require('express');
const emailModel = require('../models/email');
let router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to confirm incoming JWT.
router.use((req,res,next) => {
    const token = req.headers['x-access-token'];
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
            res.send("err");
        } else {
            next();
        }
    });
})

// Send an email to register for document access
router.post('/send', function(req, res) {
    const email = req.body.email;
    const id = req.body.id;
    const name = req.body.name;
    emailModel.sendEmail(email,id,name)
});
module.exports = router;