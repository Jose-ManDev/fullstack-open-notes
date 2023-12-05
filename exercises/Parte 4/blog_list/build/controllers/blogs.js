"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_1 = require("../models/blog");
const blogsRouter = (0, express_1.Router)();
blogsRouter.get("/", (_, response) => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield blog_1.Blog.find({});
    response.json(blogs);
}));
blogsRouter.post("/", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const body = request.body;
    if (body.title && body.url) {
        const blog = Object.assign(Object.assign({}, body), { likes: body.likes || 0 });
        const newBlog = yield new blog_1.Blog(blog).save();
        return response.status(201).json(newBlog);
    }
    response.status(400).end();
}));
blogsRouter.delete("/:id", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    yield blog_1.Blog.findByIdAndDelete(id);
    response.status(204).end();
}));
blogsRouter.put("/:id", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    const body = request.body;
    if (body.title && body.url) {
        const blog = Object.assign(Object.assign({}, body), { likes: body.likes || 0 });
        const updatedBlog = yield blog_1.Blog.findByIdAndUpdate(id, blog, { new: true });
        return response.json(updatedBlog);
    }
    response.status(400).end();
}));
exports.default = blogsRouter;
