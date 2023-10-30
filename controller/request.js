import {
  senderData,
  accepted,
  deleted,
  searchQuery,
  send,
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
      console.log(dataObject);
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
    const data = req.body;
    const result = await accepted(["accept", data.sender_id, data.receiver_id]);
    res.status(200).send({ message: "accepted request" });
  } catch (error) {
    res.status(500).send({ error: "server error" });
  }
};
const deleteRequest = async (req, res) => {
  try {
    const data = req.body;
    const result = await deleted([data.sender_id, data.receiver_id]);
    if (result.rowCount == 1) {
      res.status(200).send({ message: "remove requested" });
    } else {
      res.status(400).send({ error: "something wrong" });
    }
  } catch (error) {
    res.status(500).send({ error: "server error" });
  }
};
const sendRequest = async (req, res) => {
  try {
    const data = req.body;
    const result = await send([data.sender_id, data.receiver_id, "pending"]);
    if (result.rowCount == 1) {
      res.status(200).send({ message: "requst sent" });
    } else {
      res.status(400).send({ error: "something wrong" });
    }
  } catch (error) {
    res.status(500).send({ error: "server error" });
  }
};
const searchPeople = async (req, res) => {
  try {
    let newArray = [];
    const search = req.params.search;
    const result = await searchQuery(search);
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
export {
  receiveRequest,
  acceptedrequest,
  deleteRequest,
  searchPeople,
  sendRequest,
};
