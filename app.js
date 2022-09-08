const express = require("express");
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 1337;

app.use(express.json());
app.use(cors());


/* Import database module */
const db = require('./db/database');

/* Get route modules */
const index = require('./routes/index');
const hello = require('./routes/hello');
const docs = require('./routes/docs');
const create = require('./routes/create');
const removeAll = require('./routes/remove-all');
const save = require('./routes/save');

app.use('/', index);
app.use('/hello', hello);
app.use('/docs', docs);
app.use('/create', create);
app.use('/remove-all', removeAll);
app.use('/save', save);


// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

// Start up server
app.listen(port, () => console.log(`Example API listening on port ${port}!`));



/* MIDDLEWARE */

// Add routes for 404 and error handling
// Catch 404 and forward to error handler
// Put this last
app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "detail": err.message
            }
        ]
    });
});