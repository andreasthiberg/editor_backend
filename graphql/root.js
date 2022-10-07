const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql');

const DocumentType = require('./document.js');
const UserType = require('./user.js');

const documents = require("../models/documents.js")
const users = require("../models/users.js")

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        // Return a document based on ID
        document: {
            type: DocumentType,
            description: 'A single document',
            args: {
                documentId: { type: GraphQLString }
            },
            resolve: async function(parent, args) {
                let documentArray = await documents.getAll()
    
                return documentArray.find(document => document._id.equals(args.documentId));
            }
        },
        // Return all documents
        documents: {
            type: GraphQLList(DocumentType),
            description: 'List of all documents',
            resolve: async function() {
                return await documents.getAll();
            }
        },
        // Return documents with allowed user email
        userDocuments: {
            type: GraphQLList(DocumentType),
            description: 'Documents with given user set as allowed',
            args: {
                userEmail: { type: GraphQLString }
            },
            resolve: async function(parent, args) {
                let documentArray = await documents.getAll()
                let matchingDocuments = [];
                for (i in documentArray){
                    if (documentArray[i].allowed_users.includes(args.userEmail)){
                        matchingDocuments.push(documentArray[i]);
                    }
                }

                return matchingDocuments;
            }
        },
        // Return a user by id
        user: {
            type: UserType,
            description: 'A single user',
            args: {
                userId: { type: GraphQLString }
            },
            resolve: async function(parent, args) {
                let userArray = await users.getAll()
    
                return userArray.find(user => user._id.equals(args.userId));
            }
        },
        // Return all users
        users: {
            type: new GraphQLList(UserType),
            description: 'List of all users',
            resolve: async function() {
                return await users.getAll();
            }
        },
    })
});

module.exports = RootQueryType;
