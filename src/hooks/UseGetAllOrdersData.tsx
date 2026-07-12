"use client";

import { setAllProductsData } from "@/redux/vendorSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setAllOrdersData } from "@/redux/userSlice";

function UseGetAllOrdersData() {
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const result = await axios.get("/api/order/allOrders");
        // Check if orders exist in response
        if (result.data && result.data.orders) {
          dispatch(setAllOrdersData(result.data.orders));
        } else {
          dispatch(setAllOrdersData([]));
        }
      } catch (error: any) {
        console.log("Error fetching orders:", error);
        dispatch(setAllOrdersData([]));
      }
    };

    fetchAllOrders();
  }, [dispatch]);
}

export default UseGetAllOrdersData