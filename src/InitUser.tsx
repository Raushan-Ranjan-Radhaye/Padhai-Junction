"use client";

import UseGetAllOrdersData from "./hooks/UseGetAllOrdersData";
import UseGetAllProducts from "./hooks/UseGetAllProductsData";
import UseGetAllVendors from "./hooks/UseGetAllVendors";
import UseGetCurrentUser from "./hooks/UseGetCurrentUser";

function InitUser() {
  UseGetCurrentUser();
  UseGetAllVendors()
  UseGetAllProducts()
  UseGetAllOrdersData() 
  return null
}

export default InitUser
