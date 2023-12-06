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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_1 = __importDefault(require("../models/blog"));
const checkTypes_1 = require("../utils/checkTypes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const getIdFrom = (token) => {
    if (token === null)
        return "";
    const decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET || "");
    return decodedToken.id;
};
const blogsRouter = (0, express_1.Router)();
blogsRouter.get("/", (_, response) => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield blog_1.default.find({});
    response.json(blogs);
}));
blogsRouter.post("/", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const body = request.body;
    const userData = request.user;
    if (!userData || !userData.id)
        return response.status(401).json({ error: "invalid id" });
    const user = yield user_1.default.findById(userData.id);
    if ((0, checkTypes_1.isNewBlog)(body) && (0, checkTypes_1.isUser)(user)) {
        const blog = {
            title: body.title,
            url: body.url,
            likes: body.likes || 0,
            user: {
                username: user.username,
                name: user.name,
                id: user.id,
            },
        };
        const newBlog = yield new blog_1.default(blog).save();
        user.blogs = user.blogs.concat({
            title: newBlog.title,
            url: newBlog.url,
            id: newBlog.id,
        });
        yield user.save();
        return response.status(201).json(newBlog);
    }
    response.status(400).end();
}));
blogsRouter.delete("/:id", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    const userData = request.user;
    const blog = yield blog_1.default.findById(id);
    if (!(0, checkTypes_1.isBlog)(blog))
        return response.status(204).end();
    if (!userData || blog.user.id.toString() !== userData.id)
        return response.status(401).json({ error: "invalid user id" });
    yield blog.deleteOne();
    const user = yield user_1.default.findById(userData.id);
    if ((0, checkTypes_1.isUser)(user)) {
        user.blogs = user.blogs.filter((blog) => blog.id !== id);
        yield user.save();
    }
    response.status(204).end();
}));
blogsRouter.put("/:id", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    const body = request.body;
    const userData = request.user;
    const blog = yield blog_1.default.findById(id);
    if (!userData || !(0, checkTypes_1.isBlog)(blog))
        return response.status(400).json({ error: "invalid blog id" });
    if ((blog === null || blog === void 0 ? void 0 : blog.user.id.toString()) !== userData.id)
        return response.status(401).json({ error: "invalid user id" });
    if ((0, checkTypes_1.isNewBlog)(body)) {
        const blog = Object.assign(Object.assign({}, body), { likes: body.likes || 0 });
        const updatedBlog = yield blog_1.default.findByIdAndUpdate(id, blog, {
            new: true,
        });
        const user = yield user_1.default.findById(userData.id);
        if ((0, checkTypes_1.isUser)(user) && (0, checkTypes_1.isBlog)(updatedBlog)) {
            user.blogs = user.blogs.map((blog) => blog.id !== id
                ? blog
                : {
                    title: updatedBlog === null || updatedBlog === void 0 ? void 0 : updatedBlog.title,
                    url: updatedBlog === null || updatedBlog === void 0 ? void 0 : updatedBlog.url,
                    id: updatedBlog === null || updatedBlog === void 0 ? void 0 : updatedBlog.id,
                });
            yield user.save();
        }
        return response.json(updatedBlog);
    }
    response.status(400).end();
}));
exports.default = blogsRouter;
