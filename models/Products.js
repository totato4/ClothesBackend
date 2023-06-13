import mongoose from "mongoose";

const ProductsSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  humanCategory: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  imageUrl: String,
  brand: {
    type: String,
    required: true,
  },
  clothesCategory: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
});

export default mongoose.model("products", ProductsSchema);
