"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const ENVIRONMENT = process.env.NODE_ENV;
const PORT = process.env.PORT || 8000;
const MONGO_URI = ENVIRONMENT === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;
exports.default = { PORT, MONGO_URI };
