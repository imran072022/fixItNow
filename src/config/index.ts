import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

if (!process.env.DATABASE_URL) {
  throw new Error("Database URL is missing");
}

const config = {
  database_url: process.env.DATABASE_URL,
  port: process.env.PORT,
  node_env: process.env.NODE_ENV,
};

export default config;
