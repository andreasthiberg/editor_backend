const database = require("./database.js");

const users = {
    getAll: async function getAll() {
        let db;

        try {
            db = await database.getDb();

            let result = await db.usersCollection.find({}).toArray();

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

module.exports = users;
