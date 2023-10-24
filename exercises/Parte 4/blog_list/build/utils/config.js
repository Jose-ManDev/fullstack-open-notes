"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;
exports.default = { PORT, MONGO_URI };
