process.env.NODE_ENV = "test"
const dbModel = require("../models/database");
const request = require("supertest")
const app = require("../app.js");
let jwt;
let db;

beforeAll(async () => {
    db = await dbModel.getDb();
    await db.docsCollection.deleteMany({});
    await db.docsCollection.insertOne({
        name: "Test document 1",
        content: "Some test content",
        owner: "test@email.com",
        mode: "text",
        allowed_users: ["test@email.com"]
    });
    await db.docsCollection.insertOne({
        name: "Test document 2",
        content: "Some more test content",
        owner: "test@email.com",
        mode: "code",
        allowed_users: ["test@email.com"]
    });
    await db.usersCollection.deleteMany({});
});

describe('/auth', () => {
    test('registering a user works', async () => {
        const response = await request(app).post("/auth/register").send({
            email: "test@email.com",
            password: "321"
        });
        expect(response.body.registerMessage).toBe("Registrerad!")
        const result = await db.usersCollection.find({email: "test@email.com"}).toArray()
        expect(result[0].email === "test@email.com")
    });

    test('logging in with that user works', async () => {
        const response = await request(app).post("/auth/login").send({
            email: "test@email.com",
            password: "321"
        });
        expect(response.body.loginMessage).toBe("Inloggad!")
        expect(response.body.token).toBeDefined();
        jwt = response.body.token;
    })
});

describe('Document routes', () => {
    test('docs/create creates a document and returns it', async () => {
        const response = await request(app).post("/docs/create").send({
            name: "Test document 3",
            content: "Even more test content",
            owner: "test@email.com",
            mode: "text"
        }).set({"x-access-token": jwt});
        expect(response.body[0].name).toBe("Test document 3")
    });
    test('/grapqhl gets all (3) documents', async () => {
        const graphqlQuery = {
            "query": `{ documents { _id name content owner allowed_users mode comments { row content } } }`,
        };
        const response = await request(app).post("/graphql/").send(graphqlQuery).set({"x-access-token": jwt});
        expect(response.body.data.documents.length).toBeGreaterThan(2);
    });
    test('docs/adduser adds a user to a document', async () => {
        let doc = await db.docsCollection.find({name: "Test document 1"}).toArray();
        let id = doc[0]._id
        const result = await request(app).post("/docs/adduser").send({user:"user2@email.com", id:id}).set({"x-access-token": jwt})
        expect(result.text).toBe("Saved")
        doc = await db.docsCollection.find({name: "Test document 1"}).toArray();
        expect(doc[0].allowed_users).toContain("user2@email.com")
    })
    test('docs/remove removes all documents', async () => {
        let result = await db.docsCollection.find().toArray()
        expect(result.length).toBeGreaterThan(0);
        await request(app).get("/docs/remove-all").set({"x-access-token": jwt});
        result = await db.docsCollection.find().toArray()
        expect(result.length).toBe(0);
    });
});

afterAll(async () => {
    app.close()
    await db.client.close();
})