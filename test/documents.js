process.env.NODE_ENV = 'test';

const chai = require('chai')
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should();

chai.use(chaiHttp);

const database = require("../db/database");
const collectionName = "documents";

describe('Documents', () => {
    before(() => {
        return new Promise(async (resolve) => {
            const db = await database.getDb();
            db.db.listCollections(
                { name: collectionName }
            )
                .next()
                .then(async function(info) {

                    if (info) {
                        await db.collection.deleteMany({});
                    }
                })
                .catch(function(err) {
                    console.error(err);
                })
                .finally(async function() {
                    await db.client.close();
                    resolve();
                });
        });
    });
 
    describe('POST /create', () => {

        it('should create a new document and get it in a response', (done) => {
            chai
                .request(server)
                .post("/create")
                .set("Content-type", "application/json; charset=UTF-8")
                .send({name: 'testname', content:'testcontent'})
                .end((err,res) => {
                    res.body.should.be.an("array");
                    res.body[0].should.have.property("content","testcontent");
                    done();
                });
        
        });

        it('should have added the new doc to the database', (done) => {
            chai.request(server)
                .get("/docs")
                .end((err,res) => {
                    res.body[0].should.have.property("content","testcontent");
                    done();
                });
        });
    });

    describe('GET /docs', () => {

        it('should return document data', (done) => {

            chai.request(server)
                .get("/docs")
                .end((err,res) => {
                    res.body[0].should.have.property("content");
                    res.body[0].should.have.property("name");
                    res.body[0].should.have.property("_id");
                    done();
                });
        });
    });

    describe('GET /remove-all', () => {

        it('should return a "removed" message', (done) => {

            chai.request(server)
                .get("/remove-all")
                .end((err,res) => {
                    res.text.should.equal("Documents removed!");
                    done();
                });
        });
        it('should result in empty collection', (done) => {

            chai.request(server)
                .get("/docs")
                .end((err,res) => {
                    res.body.should.be.empty;
                    done();
                });
        });
    });


});
