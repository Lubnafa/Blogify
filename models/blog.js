const { Schema, model } = require("mongoose");

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    coverImageURL: {
        type: String,
        required: false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user", // Reference to the User model
        required: true // It's required because each blog should have a creator
    }
}, { timestamps: true });

const blog = model("Blog", blogSchema);
module.exports = blog;
