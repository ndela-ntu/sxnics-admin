import mongoose, { Schema } from "mongoose";

export interface IShopItem {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  imageURL: string;
  imagePublicId: string;
}

const ShopItemSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  imageURL: { type: String, required: true },
  imagePublicId: { type: String, required: true },
});

const ShopItem =
  (mongoose.models && mongoose.models.ShopItem) ||
  mongoose.model("ShopItem", ShopItemSchema);
export default ShopItem;
