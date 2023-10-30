import { pool } from "../ConnectionDb.js";
import existsTable from "./existsTable.js";
export const chatingtable = async () => {
  try {
    const createChatingTable = `
            CREATE TABLE chating(
                id SERIAL PRIMARY KEY,
                senderid INT,
                receiverid INT,
                chat TEXT NOT NULL,
                chatstatus TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                FOREIGN KEY (senderid) REFERENCES users (id),
                FOREIGN KEY (receiverid) REFERENCES users (id)
            ) 
        `;
    const result = await existsTable("chating");
    if (result.rows[0].exists) {
      console.log("chating Table already exists");
    } else {
      await pool.query(createChatingTable);
      console.log("chating table has been created");
    }
  } catch (error) {
    console.log(error);
  }
};
