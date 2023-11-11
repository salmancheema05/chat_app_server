import {
  senderData,
  accepted,
  deleted,
  searchQuery,
  send,
  receiveLastRequest,
} from "../models/requestModel.js";
import path from "path";
import fs from "fs";
const imagePath = path.join(process.cwd(), "uploadsimage");
const receiveRequest = async (req, res) => {
  try {
    let newArray = [];
    const receiverId = req.params.receiver_id;
    const fetchData = await senderData(receiverId);
    const dataArray = fetchData.rows;
    const dataLength = dataArray.length - 1;
    for (let i = 0; i <= dataLength; i++) {
      let dataObject = dataArray[i];
      if (dataObject.image_name != null) {
        let imageName = dataObject.image_name.slice(13);
        let imagePathFull = path.join(imagePath, imageName);
        let imageData = fs.readFileSync(imagePathFull, { encoding: "base64" });
        dataObject.image_name = imageData;
      }
      newArray.push(dataObject);
    }
    res.status(200).send(newArray);
  } catch (error) {
    res.status(500).send({ error: "server error" });
  }
};
const acceptedrequest = async (req, res) => {
  try {
    const senderId = req.params.senderid;
    const receiverId = req.params.receiverid;
    const result = await accepted(["accept", senderId, receiverId]);
    res.status(200).send({ message: "accepted request" });
  } catch (error) {
    res.status(500).send({ error: "server error" });
  }
};
const deleteRequest = async (req, res) => {
  try {
    const senderId = req.params.senderid;
    const receiverId = req.params.receiverid;
    await deleted([senderId, receiverId]);
    res.status(200).send({ message: "request remove" });
  } catch (error) {
    res.status(500).send({ error: "server error" });
  }
};
const sendRequest = async (sender_id, receiver_id) => {
  try {
    const result = await send([sender_id, receiver_id, "pending"]);
    if (result.rowCount == 1) {
      const lastData = await getNewRequest(
        result.rows[0].id,
        result.rows[0].receiver_id
      );
      return lastData;
    } else {
      return { error: "something wrong" };
    }
  } catch (error) {
    res.status(500).send({ error: "server error" });
  }
};
const searchPeople = async (req, res) => {
  try {
    let newArray = [];
    const userId = req.params.userid;
    const search = req.params.search;
    const result = await searchQuery([userId, search]);
    if (result.rowCount >= 1) {
      const arrayLength = result.rows.length;
      for (let i = 0; i < arrayLength; i++) {
        if (result.rows[i].image_name != null) {
          let dataObject = result.rows[i];
          let imageName = dataObject.image_name.slice(13);
          let imagePathFull = path.join(imagePath, imageName);
          let imageData = fs.readFileSync(imagePathFull, {
            encoding: "base64",
          });
          dataObject.image_name = imageData;
          newArray.push(dataObject);
        } else {
          newArray.push(result.rows[i]);
        }
      }
      res.status(200).send(newArray);
    } else {
      res.status(404).json({ message: "Not Found your Friend" });
    }
  } catch (error) {
    res.status(500).send({ error: "server error" + error });
  }
};
const getNewRequest = async (id, receiver_id) => {
  try {
    const fetchData = await receiveLastRequest([receiver_id, id]);
    const data = fetchData.rows[0];
    if (data.image_name != null) {
      let imageName = data.image_name.slice(13);
      let imagePathFull = path.join(imagePath, imageName);
      let imageData = fs.readFileSync(imagePathFull, { encoding: "base64" });
      data.image_name = imageData;
      return data;
    } else {
      return data;
    }
  } catch (error) {
    return { error: "server error" };
  }
};
export {
  receiveRequest,
  acceptedrequest,
  deleteRequest,
  searchPeople,
  sendRequest,
  getNewRequest,
};
