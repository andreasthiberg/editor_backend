const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql');

const DocumentType = new GraphQLObjectType({
    name: 'Document',
    description: 'This represents a document',
    fields: () => ({
        _id: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLNonNull(GraphQLString) },
        content: { type: GraphQLNonNull(GraphQLString) },
        owner: { type: GraphQLNonNull(GraphQLString) },
        allowed_users: {
            type: new GraphQLList(GraphQLString)
        },
        comments: {
            type: new GraphQLList(CommentType)
        }
    })
})


const CommentType = new GraphQLObjectType({
    name: 'Comment',
    description: 'This represents a document comment',
    fields: () => ({
        row: { type: GraphQLNonNull(GraphQLInt) },
        content: { type: GraphQLNonNull(GraphQLString) }
    })
})

module.exports = DocumentType;
