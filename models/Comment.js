const { Schema, model, getModel } = require('ottoman');
const {scopeName} = require("../config/dbConnect")

const commentSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    author: {type: String, ref: 'User'},
    article: {type: String, ref: 'Article'}
},
    {
        timestamps: true
    });


commentSchema.methods.toCommentResponse = async function (user) {
    let authorObj = await getModel('User').findById(this.author);
    return {
        id: this.id,
        body: this.body,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        author: authorObj.toProfileJSON(user)
    }
};

module.exports = { Comment: model('Comment', commentSchema, { scopeName: scopeName }), commentSchema: commentSchema};