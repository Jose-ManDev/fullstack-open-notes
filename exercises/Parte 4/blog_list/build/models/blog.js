"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const blogSchema = new mongoose_1.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
});
const Blog = (0, mongoose_1.model)("Blog", blogSchema);
exports.default = Blog;
