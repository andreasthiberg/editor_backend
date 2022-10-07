const database = require("./database.js");

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
    }
};

module.exports = documents;
