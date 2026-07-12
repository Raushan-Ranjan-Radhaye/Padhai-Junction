

import { createSlice } from '@reduxjs/toolkit';
import { IUser } from '../model/user.model';

// Extended types for populated order data
interface PopulatedProduct {
  _id: string;
  title: string;
  image1: string;
  price: number;
  category: string;
  stock: number;
  vendor: string;
  replacementDays: number;
}

interface PopulatedVendor {
  _id: string;
  name: string;
  shopName: string;
  email: string;
}

interface IOrderData {
  _id: string;
  products: {
    product: PopulatedProduct;
    quantity: number;
    price: number;
  }[];
  buyer: string | { _id: string };
  productVendor: PopulatedVendor;
  productsTotal: number;
  deliveryCharge: number;
  serviceCharge: number;
  totalAmount: number;
  paymentMethod: "cod" | "stripe";
  isPaid: boolean;
  orderStatus: "pending" | "confirmed" | "shipped" | "delivered" | "returned" | "cancelled";
  address: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface IUserData {
  userData : IUser | null,
  allOrdersData : IOrderData[]
}

const initialState : IUserData = {
  userData : null,
  allOrdersData : []
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload;
    },
    setAllOrdersData: (state, action) => {
      state.allOrdersData = action.payload;
    }
  },
});

export const { setUser } = userSlice.actions;
export const { setAllOrdersData } = userSlice.actions;

export default userSlice.reducer;
