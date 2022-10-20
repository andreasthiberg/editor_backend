/* Routes for authenticating users - registering and logging in */

let express = require('express');
const database = require('../models/database');
const userModel = require('../models/users');
let router = express.Router();

/* Auth stuff */
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// Register a new user with email and password
router.post('/register', function(req, res) {

    (async () => {
        const db = await database.getDb();
        const password = req.body.password;
        const email = req.body.email;

        resultSet = await db.usersCollection.find({email:email}).toArray();
        if(resultSet.length !== 0){
            res.json({registerMessage:"Email redan tagen"})
        }

        let hashedPassword;
        
        bcrypt.hash(password, saltRounds, async(err, hash) => {
             hashedPassword = hash;
             newBody = {
                password: hashedPassword,
                email: email
            }
            await db.usersCollection.insertOne(newBody);
            await db.client.close();
            res.json({registerMessage:"Registrerad!"});
        });
    })();
});

// Attempt to login given email and password. Otherwise return issue message.
router.post('/login', function(req, res) {

    (async () => {
        const db = await database.getDb();
        const password = req.body.password;
        const email = req.body.email;

        resultSet = await db.usersCollection.find({email:email}).toArray();
        if(resultSet.length === 0){
            res.json({loginMessage:"Användaren finns inte"})
            await db.client.close();
        } else {
            let hash = resultSet[0].password;
            bcrypt.compare(password, hash, async(err, check) => {
                if(check){
                    const payload = {email: email, password: password}
                    const token = jwt.sign(payload, secret, { expiresIn: '1h'});
                    res.json({loginMessage:"Inloggad!",token:token});
                } else {
                    res.json({loginMessage:"Fel lösenord"});
                }
                await db.client.close()
            }); 
    
        }

    })();

});

// Get all users (emails only, not passwords)
router.get('/users', function(req, res) {

    (async () => {
        let users = await userModel.getAll()
        let emailsOnly = [];
        for(let index in users){
            emailsOnly.push({email:users[index].email})
        }
        res.json({users:emailsOnly});
    })();

});



module.exports = router;