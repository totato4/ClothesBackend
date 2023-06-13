import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import {
  loginValidation,
  postCreateValidation,
  registerValidation,
} from "./validations/validations.js";
import {
  PostController,
  UserController,
  ProductsController,
} from "./controllers/index.js";
import { handleValidationErrors, checkAuth } from "./utils/index.js";
import cors from "cors";
import * as http from "http";
import { Server } from "socket.io";
import { emitChatMessage } from "./controllers/ChatController.js";
// import { addUser } from "./controllers/ChatController.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// const types = ["image/png", "image/jpeg", "image/jpg"];

// const fileFilter = (req, file, cb) => {
//   if (types.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

const upload = multer({ storage });

mongoose
  .connect("mongodb://localhost:27017/blog")
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB err", err));

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.use(cors({ origin: "http://localhost:3000" }));
// app.use(cors({ origin: "*" }));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

io.on("connection", (socket) => {
  socket.on("join", ({ room, email, role, id }) => {
    socket.join(room);
    if (role === "user") {
      io.to(room).emit("message", {
        data: { message: "Здравствуйте! Чем я могу вам помочь?" },
      });
    }
  });
  socket.on("sendMessage", ({ message, id, room, role }) => {
    emitChatMessage(message, id, room, role);
    console.log();
  });
});

app.get("/", (req, res) => {
  res.send("111 hello world!");
});

// LOGIN

app.post(
  "/auth/login",

  loginValidation,
  handleValidationErrors,
  UserController.login
);

//  REGISTER

app.post(
  "/auth/register",

  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  try {
    if (req.file) {
      res.json({ url: `/uploads/${req.file.originalname}` });
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", PostController.update);
app.get("/products", ProductsController.getProducts);
app.get("/products/product/:id", ProductsController.getOneProduct);

server.listen(3001, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("server OK");
});
