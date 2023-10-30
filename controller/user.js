import {
  user,
  TokenSave,
  logout,
  signupQuery,
  userExistsORNot,
} from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const saltRounds = 10;
const login = async (req, res) => {
  try {
    const data = req.body;
    if (data.username == "" || data.password == "") {
      res.status(404).send({ error: "requird username and password" });
    } else {
      const getInfo = await user(data.username);
      if (getInfo.rowCount === 0) {
        res.status(404).send({ error: "your username and password is wrong" });
      } else {
        const token = await verlfyPassword(data.password, getInfo.rows);
        if (token.code === 404) {
          res.status(token.code).send({ error: token.error });
        } else {
          res.status(200).send({ message: token.message });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
const verlfyPassword = async (password, data) => {
  try {
    const userPassword = data[0].password;
    const hashPassword = await bcrypt.compare(password, userPassword);
    if (hashPassword == false) {
      return { code: 404, error: "your username and password is wrong" };
    } else {
      const createJwt = await jwtToken(data);
      if (createJwt.code == 200) {
        return { code: createJwt.code, message: createJwt.message };
      } else {
        return { code: createJwt.code, error: createJwt.err };
      }
    }
  } catch (error) {
    console.log(error);
  }
};
const jwtToken = async (data) => {
  try {
    const privateKey = "39485hfy7sbgrrgthttrhegh9484742928387";
    const { id, firstname, lastname, loginstatus } = data[0];
    const user = { id, firstname, lastname, loginstatus };
    const token = jwt.sign({ user }, privateKey);
    if (token) {
      const saveToken = [token, id];
      const result = await TokenSave(saveToken);
      const lastIndex = result.rows[0].token.length - 1;
      const latestToken = result.rows[0].token[lastIndex];
      return { code: 200, message: latestToken };
    } else {
      return { code: 404, error: "server problem" };
    }
  } catch (error) {
    console.log(error);
  }
};
const userLogout = async (req, res) => {
  try {
    const { userid, loginstatus, token } = req.body;
    const result = await logout([loginstatus, token, userid]);

    if (result.rowCount == 1) {
      res.status(200).send({ message: "logout" });
    }
  } catch (error) {
    console.error(error);
  }
};
const signup = async (req, res) => {
  try {
    const { firstname, lastname, email, username, password, gender } = req.body;
    const hashPassword = await bcrypt.hash(password, saltRounds);
    const seachField = `${firstname} ${lastname} ${username}`;
    const checkuser = await userExistsORNot([username, email]);
    if (checkuser.rows[0].count == 1) {
      res
        .status(200)
        .send({ error: "This username or email is already exists" });
    } else {
      const result = await signupQuery([
        firstname,
        lastname,
        email,
        username,
        hashPassword,
        false,
        "offline",
        seachField,
        gender,
      ]);
      if (result.rowCount == 1) {
        res.status(200).send({ message: "Your Account has Been Created" });
      }
    }
  } catch (error) {
    console.error(error);
  }
};
export { login, userLogout, signup };
