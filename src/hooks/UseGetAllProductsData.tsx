"use client";

import { setAllProductsData } from "@/redux/vendorSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

function UseGetAllProducts() {
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    const fetchAllProduct = async () => {
      try {
        const result = await axios.get("/api/vendor/allProduct");
        dispatch(setAllProductsData(result.data.products));
      } catch (error) {
        dispatch(setAllProductsData([]));
      }
    };

    fetchAllProduct();
  }, []);
}

export default UseGetAllProducts