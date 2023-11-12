import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();
const { Pool } = pkg;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
const connectdb = () => {
  pool
    .connect()
    .then(() => {
      console.log("database is connect");
    })
    .catch((error) => console.log("database is not  connect " + error));
};

export { connectdb, pool };
