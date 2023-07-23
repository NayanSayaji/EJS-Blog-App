const {Schema, model, SchemaTypeOptions } = require("mongoose");
const { schema } = require("./blog");

const commentSchema = new SchemaTypeOptions({
    content:{
        type: String,
        required: true,
    },
    blogId:{
        type: Schema.Types.ObjectId,
        ref:"blog",
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref:"user",
    },
},
{ timespace: true }
);


const Comment = model("comment", commentSchema);

module.exports = Comment;