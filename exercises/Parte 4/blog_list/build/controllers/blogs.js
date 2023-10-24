"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_1 = __importDefault(require("../models/blog"));
const blogsRouter = (0, express_1.Router)();
blogsRouter.get("/", (request, response) => {
    blog_1.default.find({}).then((blogs) => {
        response.json(blogs);
    });
});
blogsRouter.post("/", (request, response) => {
    const blog = new blog_1.default(request.body);
    blog.save().then((result) => {
        response.status(204).json(result);
    });
});
exports.default = blogsRouter;
