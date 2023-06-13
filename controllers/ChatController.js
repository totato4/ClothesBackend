import { trimStr } from "../utils/Trim.js";
import ChatModel from "../models/Chat.js";

let users = [];

const findUser = (user) => {
  const userName = trimStr(user.name);
  const userRoom = trimStr(user.room);

  return users.find(
    (u) => trimStr(u.name) === userName && trimStr(u.room) === userRoom
  );
};

export const addUser = (user) => {
  const isExist = findUser(user);
  console.log("users", users);
  !isExist && users.push(user);
  const currentUser = isExist || user;
  return { isExist: !!isExist, user: currentUser };
};
const getRoomUsers = (room) => {
  return users.filter((u) => u.room === room);
};

const removeUser = (user) => {
  const found = findUser(user);
  if (found) {
    users = users.filter(
      ({ room, name }) => room === found.room && name !== found.name
    );
  }
  return found;
};

export const emitChatMessage = async (message, id, room, role) => {
  try {
    // const doc = new ChatModel({
    //   title: req.body.title,
    //   text: req.body.title,
    //   imageUrl: req.body.imageUrl,
    //   tags: req.body.tags,
    //   user: req.userId,
    // });
    // const post = await doc.save();
    // res.json(post);
    console.log("message and room", message, id);
  } catch (err) {
    // console.log(err);
    // res.status(500).json({
    //   message: "Не удалось создать статью",
    // });
  }
};

export const addToRoomsList = async () => {
  try {
    const doc = new ChatModel({});
  } catch (err) {}
};
