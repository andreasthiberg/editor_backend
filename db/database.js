require('dotenv').config();
const dbConfig = {
    "dsn": `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.peuabyi.mongodb.net/editor`,
    "collection": "documents"
}

const mongo = require("mongodb").MongoClient;


const database = {
    getDb: async function getDb () {
        let dsn = dbConfig.dsn;
        let collectionName = dbConfig.collection;


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