import mongoose from "mongoose";
import { IUser } from "./user.model";

export interface IProduct {
  _id?: mongoose.Types.ObjectId;
  
  title: string;
  description: string;
  price: number;

  stock: number;
  isStockAvailable?: boolean;
    vendor: IUser;
  image1: string;
  image2?: string;
  image3?: string;
  image4?: string;

  category: string;
  isWearable: boolean;
  sizes?: string[];

  veificationStatus: "pending" | "approved" | "rejected";
  requestedAt?: Date;
  approvedAt?: Date;
  rejectedReason?: string;

  isActive?: boolean;

  replacementDays?: number;
  freeDelivery?: boolean;
  warrenty?: number;
  payOnDelivery?: boolean;

  detailsPoints?: string[];

  reviews?: {
    user: IUser;
    rating: number;
    comment?: string;
    createdAt?: Date;
    images?: string;
  }[];

  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new mongoose.Schema<IProduct>({
    title: { type: String},
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number },
    isStockAvailable: { type: Boolean, default: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    image1: { type: String },
    image2: { type: String  },
    image3: { type: String },
    image4: { type: String },
    category: { type: String,required: true },
    isWearable: { type: Boolean,default: false },
    sizes: [{ type: String ,default: [] }],
    veificationStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    requestedAt: { type: Date },
    approvedAt: { type: Date },
    rejectedReason: { type: String },
    isActive: { type: Boolean, default: false },
    replacementDays: { type: Number, default: 0 },
    freeDelivery: { type: Boolean, default: false },
    warrenty: { type: Number, default: 0 },
    payOnDelivery: { type: Boolean, default: false },

    detailsPoints: [{ type: [String], default: [] }],
    
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String, trim: true },
        createdAt: { type: Date, default: Date.now },
        images: { type: String },
      },
    ],


}, { timestamps: true });

const Product = mongoose.models?.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;