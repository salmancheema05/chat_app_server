import { Server } from "socket.io";
import { userIsonlineOrOffine } from "../models/userModel.js";
import { fileSave } from "./chatServer.js";
import { ChatInsert, chatsSeen } from "./ChatingSave.js";
import { sendRequest, acceptedrequest } from "./request.js";

const Sockethandle = (mainServer) => {
  const io = new Server(mainServer);
  io.on("connection", (socket) => {
    let lastInsertedData = null;
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
    socket.on("requestsend", async (data) => {
      try {
        const { sender_id, receiver_id } = data;
        const lastInsertedData = await sendRequest(sender_id, receiver_id);
        socket.broadcast.emit("requestdatareceive", lastInsertedData);
      } catch (error) {
        console.error(error);
      }
    });
    socket.on("accept", async (data) => {
      try {
        const { sender_id, receiver_id } = data;
        const lastInsertedData = await acceptedrequest(sender_id, receiver_id);
        socket.broadcast.emit("accepted", lastInsertedData);
      } catch (error) {
        console.error(error);
      }
    });
    socket.on("seenchats", async (data) => {
      try {
        const { sender_id, receiver_id } = data;
        socket.broadcast.emit("yourchatsseen", data);
        await chatsSeen(sender_id, receiver_id);
      } catch (error) {
        console.error(error);
      }
    });
  });
};
export default Sockethandle;
