import { config } from "dotenv";

config();

const ENVIRONMENT = process.env.NODE_ENV;
const PORT = process.env.PORT || 8000;
const MONGO_URI =
  ENVIRONMENT === "test"
    ? (process.env.TEST_MONGODB_URI as string)
    : (process.env.MONGODB_URI as string);

export default { PORT, MONGO_URI };
