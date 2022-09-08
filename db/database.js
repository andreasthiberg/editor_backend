// mongodb+srv://texteditor:<password>@cluster0.peuabyi.mongodb.net/?retryWrites=true&w=majority

const mongo = require("mongodb").MongoClient;
const collectionName = "crowd";

const database = {
    getDb: async function getDb () {
        let dsn = `mongodb://localhost:27017/mumin`;

        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test";
        }

        const client  = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;