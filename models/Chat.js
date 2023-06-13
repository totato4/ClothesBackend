import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
      unique: true,
    },
    room: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("chatData", ChatSchema);
