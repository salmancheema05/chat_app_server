import { Server } from "socket.io";
import { userIsonlineOrOffine } from "../models/userModel.js";
import { fileSave, fetchFile } from "./chatServer.js";
import { ChatInsert } from "./ChatingSave.js";
const Sockethandle = (mainServer) => {
  const io = new Server(mainServer);
  io.on("connection", (socket) => {
    socket.on("yourFriendonline", async (data) => {
      try {
        const result = await userIsonlineOrOffine(["online", data.friendid]);
        socket.broadcast.emit("activestatus", data);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("yourFriendOffline", async (data) => {
      await userIsonlineOrOffine(["offline", data.friendid]);
      socket.broadcast.emit("inactivestatus", data);
    });
    socket.on("newMessageFromMe", async (messageData) => {
      if (messageData.type == "audiovoice" || messageData.type == "image") {
        const copyObject = { ...messageData };
        const base64Image = copyObject.chat.toString("base64");
        copyObject.fileuri = base64Image;
        socket.broadcast.emit("sendMessage", copyObject);
        await fileSave(messageData);
      } else {
        const { chat, senderid, receiverid } = messageData;
        const textObject = {
          chat: chat,
          senderid: senderid,
          receiverid: receiverid,
        };
        await ChatInsert(textObject);
        socket.broadcast.emit("sendMessage", messageData);
      }
    });
  });
};
export default Sockethandle;
