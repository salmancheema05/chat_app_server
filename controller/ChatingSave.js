import {
  chatInsert,
  fetchChatsQuery,
  updateChatsSeen,
} from "../models/ChatModal.js";
import path from "path";
import fs from "fs";
const destinationPath = path.join(process.cwd(), "documents/");
const ChatInsert = async (data) => {
  try {
    const { chat, senderid, receiverid } = data;
    await chatInsert([senderid, receiverid, chat, "unseen"]);
  } catch (error) {
    console.log(error);
  }
};
const fetchChats = async (req, res) => {
  try {
    let chatArray = [];
    const senderid = req.params.senderid;
    const receiverid = req.params.receiverid;
    const result = await fetchChatsQuery([senderid, receiverid]);
    const resultLength = result.rows.length;
    for (let i = 0; i < resultLength; i++) {
      const data = result.rows[i];
      if (data.chat.startsWith("file-")) {
        const FileDate = data;
        const removeFileString = data.chat.slice(5);
        FileDate.chat = removeFileString;
        const getfileObject = readFile(data);
        chatArray.push(getfileObject);
      } else {
        chatArray.push(data);
      }
    }
    res.status(200).send(chatArray);
  } catch (error) {
    console.log(error);
  }
};
const readFile = (data) => {
  const fileName = data.chat;
  const filePath = path.join(destinationPath, fileName);
  const fileBase64 = fs.readFileSync(filePath, { encoding: "base64" });
  data.chat = fileBase64;
  data.type = "audiovoice";
  data.audiostatus = false;
  return data;
};
const chatsSeen = async (sender_id, receiver_id) => {
  try {
    await updateChatsSeen([sender_id, receiver_id]);
  } catch (error) {
    console.log(error);
  }
};
export { ChatInsert, fetchChats, chatsSeen };
