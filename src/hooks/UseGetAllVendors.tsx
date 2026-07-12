"use client";

import { setAllVendorsData } from "@/redux/vendorSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

function UseGetAllVendors() {
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    const fetchAllVendor = async () => {
      try {
        const result = await axios.get("/api/vendor/AllVendor");
        dispatch(setAllVendorsData(result.data.vendors));
      } catch (error) {
        console.log("Error", error);
        dispatch(setAllVendorsData([]));
      }
    };

    fetchAllVendor();
  }, []);
}

export default UseGetAllVendors;
