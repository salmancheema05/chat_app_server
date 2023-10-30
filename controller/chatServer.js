import path from "path";
import fs from "fs";
import util from "util";
import { ChatInsert } from "./ChatingSave.js";
const destinationPath = path.join(process.cwd(), "documents/");
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const fileSave = async (file) => {
  try {
    let fileName = null;
    let filePathUri = null;
    const { fileuri, messageId, senderid, receiverid } = file;
    if (file.type == "audiovoice") {
      fileName = `recording-${messageId}.3gp`;
      filePathUri = fileuri;
    } else {
      const { name, fileuri } = file;
      fileName = name;
      filePathUri = fileuri;
    }
    const filePath = path.join(destinationPath, fileName);
    fs.mkdir(destinationPath, { recursive: true }, (err) => {
      if (err) {
        console.error("Error creating directory:", err);
      } else {
        // Directory created or already exists
        writeFileAsync(filePath, filePathUri, { encoding: "base64" });
      }
    });
    const fileObject = {
      text: `file-${fileName}`,
      senderid: senderid,
      receiverid: receiverid,
    };
    await ChatInsert(fileObject);
  } catch (error) {
    console.error(error);
  }
};

const fetchFile = async (file) => {
  try {
    const { messageId, currentDateTime, senderId, receiverId, type, fileName } =
      file;
    const filePath = path.join(destinationPath, fileName);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error(`Error reading the file: ${err}`);
      } else {
        // Encode the file data as a base64 string
        const base64Data = data.toString("base64");

        // You can now use the base64Data as needed
        console.log(`Base64 data: ${base64Data}`);

        // For example, you can send the base64Data in an HTTP response or save it to a database
      }
    });
    const fileObject = {
      messageId: messageId,
      currentDateTime: currentDateTime,
      senderId: senderId,
      receiverId: receiverId,
      type: type,
      // fileuri: filebase64,
    };
    return fileObject;
  } catch (error) {
    console.error("file not fetch");
  }
};
export { fileSave, fetchFile };
