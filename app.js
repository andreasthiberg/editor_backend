const express = require("express");
const morgan = require('morgan');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/* GraphQL */
const { graphqlHTTP }  = require('express-graphql');
const { GraphQLSchema } = require("graphql");
const visual = true;
const RootQueryType = require("./graphql/root.js");
const schema = new GraphQLSchema({
    query: RootQueryType
});


/* Expess */
const app = express();
const port = process.env.PORT || 1337;

app.use(express.json());
app.use(cors());


/* Get route modules */
const docs = require('./routes/docs');
const index = require('./routes/index');
const auth = require('./routes/auth');
const email = require('./routes/email');

app.use('/', index);
app.use('/docs', docs);
app.use('/auth', auth);
app.use('/email', email);



/* Graphql route and middleware */
const graphqlTokenMiddleware = (req, res, next) => {
    const token = req.headers['x-access-token'];
    console.log(token);
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
            res.send(err);
        } else {
            next();
        }
    })
}
app.use('/graphql', graphqlTokenMiddleware, graphqlHTTP({
    schema: schema,
    graphiql: visual
}));


// Web socket with socket.io
const httpServer = require("http").createServer(app);

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


let throttleTimer;

io.on('connection', (socket) => {
    console.log("Connection on socket " + socket.id)
    socket.on("doc", (doc) => {
        socket.join(doc["_id"]);
        io.to(doc["_id"]).emit("update", doc);
        clearTimeout(throttleTimer);
        console.log("Waiting for writing to finish.");
        throttleTimer = setTimeout(function() {
            console.log("Saving changes to database!");
            socket.emit("save","Time to save!")
            io.emit("change",doc);
        }, 1000);
    });
});


// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}


// Start up server
const server = httpServer.listen(port, () => console.log(`Editor API listening on port ${port}!`));


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

module.exports = server;