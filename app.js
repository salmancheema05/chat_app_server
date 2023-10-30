import express from "express";
import { connectdb } from "./ConnectionDb.js";
import { userTable } from "./createtables/usertable.js";
import { profileimagetable } from "./createtables/profileimagetable.js";
import { requesttable } from "./createtables/requestTable.js";
import route from "./route.js";
import http from "http";
import cors from "cors";
import Sockethandle from "./controller/SocketEvents.js";
import { chatingtable } from "./createtables/chatingtable.js";
const app = express();
const hostName = "192.168.1.6";
const server = http.createServer(app);
const port = 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(route);
Sockethandle(server);
connectdb();
userTable();
profileimagetable();
requesttable();
chatingtable();
server.listen(port, hostName, (error) => {
  if (error) {
    console.log(err);
  }
  console.log(`Server is running on:http://${hostName}:${port}`);
});
export { server };
