const database = require("./database.js");
const ObjectId = require('mongodb').ObjectId;

const documents = {
    getAll: async function getAll() {
        let db;

        try {
            db = await database.getDb();

            let result = await db.docsCollection.find({}).toArray();

            return result;

        } catch (e) {
            return res.json({
                errors: {
                    status: 500,
                    name: "Database Error",
                    description: e.message,
                    path: "/",
                }
            })
        } finally {
            await db.client.close();
        }
    },
    addUserToDocument: async function addUserToDocument(user,docId){
        
        const db = await database.getDb();
        const filter = { _id: ObjectId(docId) };
        const matchingDocs = await db.docsCollection.find(filter).toArray();
        const previousDoc = matchingDocs[0];
        const previousUsers = [...previousDoc.allowed_users];
        previousUsers.push(user);
        const updateDocument = { $set: {    
            allowed_users: previousUsers
        }};
    
        await db.docsCollection.updateOne(filter,updateDocument);
        await db.client.close();
        return;
    }
};

module.exports = documents;
