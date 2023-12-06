"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: String,
    name: String,
    id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
}, { _id: false });
const blogSchema = new mongoose_1.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
    user: userSchema,
});
blogSchema.set("toJSON", {
    transform: (_, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        returnedObject.user.id = returnedObject.user.id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
const Blog = (0, mongoose_1.model)("Blog", blogSchema);
exports.default = Blog;
