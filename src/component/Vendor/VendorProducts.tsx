"use client";
import UseGetAllVendors from "@/hooks/UseGetAllVendors";
import UseGetAllProductsData from "@/hooks/UseGetAllProductsData";
import { AppDispatch, RootState } from "@/redux/store";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Image from "next/image";
import UseGetCurrentUser from "@/hooks/UseGetCurrentUser";
import { IProduct } from "@/model/product.model";
import { IUser } from "@/model/user.model";
import axios from "axios";
import { setAllProductsData } from "@/redux/vendorSlice";

function VendorProducts() {
  UseGetCurrentUser();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [selectedVendor, setSelectedVendor] = useState(null);

  const currentUser = useSelector((state: RootState) => state.user.userData);
  const { allProductsData } = useSelector((state: RootState) => state.vendor);

  // Initialize the hooks to fetch data
  UseGetAllVendors();
  UseGetAllProductsData();

  // Debug logging

  useEffect(() => {
    // Component initialization - removed console logs for security
  }, [currentUser, allProductsData]);

  const myProducts =
    currentUser?._id && allProductsData.length
      ? allProductsData.filter((p: IProduct) => {
          const vendorId = (p.vendor as IUser)?._id?.toString();
          const currentUserId = currentUser?._id?.toString();
          return vendorId === currentUserId;
        })
      : [];

  // Handle edit product
  const handleEdit = (product: IProduct) => {
    router.push(`/updateProduct/${product._id}`);
  };

  // Handle toggle product status
  const handleToggleStatus = (product: IProduct) => {
    // TODO: Implement status toggle logic
  };

  const toggleIsActive = async (
    productId: string,
    currentisActive: boolean,
    productTitle: string,
  ) => {
    try {
      // Show normal browser alert with current status
      const newStatus = !currentisActive;
      const statusText = newStatus ? "Enable" : "Disable";
      const confirmation = window.confirm(
        `Are you sure you want to ${statusText.toLowerCase()} the product "${productTitle}"?\n\nCurrent Status: ${currentisActive ? "Active" : "Inactive"}\nNew Status: ${newStatus ? "Active" : "Inactive"}`,
      );

      if (!confirmation) {
        return; // User cancelled
      }

      const result = await axios.post("/api/vendor/isActiveProduct", {
        productId,
        isActive: newStatus,
      });

      // Update the Redux store with the updated product
      // Ensure we maintain all products and only update the specific product
      // Preserve the complete product structure to prevent data loss
      const updatedProducts = allProductsData.map((p: IProduct) => {
        const isMatch = String(p._id) === productId;
        if (isMatch) {
          // Preserve the complete product structure and only update the isActive field
          // This prevents data loss if result.data.product is incomplete
          const updatedProduct = {
            ...p, // Keep all existing product data
            isActive: result.data.product.isActive, // Only update the isActive field
            updatedAt:
              result.data.product.updatedAt || new Date().toISOString(), // Update timestamp if available
          };

          return updatedProduct;
        }
        return p;
      });

      // Dispatch the updated products to Redux store
      dispatch(setAllProductsData(updatedProducts));

      // Show success alert with updated status
      alert(
        `✅ Product "${productTitle}" has been successfully ${newStatus ? "enabled" : "disabled"}!\n\nProduct ID: ${productId}\nNew Status: ${newStatus ? "Active" : "Inactive"}`,
      );
    } catch (error) {
      alert("❌ Failed to update product status. Please try again.");
    }
  };

  const deleteProduct = async (productId: string, productTitle: string) => {
    try {
      const confirmation = window.confirm(
        `Are you sure you want to delete the product "${productTitle}"? This action cannot be undone.`,
      );

      if (!confirmation) {
        return; // User cancelled
      }

      const response = await axios.post(`/api/vendor/deleteProduct`, {
        productId,
      });

      if (response.status === 200) {
        // Remove the deleted product from the Redux store
        const updatedProducts = allProductsData.filter(
          (p: IProduct) => String(p._id) !== productId,
        );
        dispatch(setAllProductsData(updatedProducts));

        alert(`✅ Product "${productTitle}" has been successfully deleted!`);
      } else {
        throw new Error(response.data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("❌ Failed to delete product. Please try again.");
    }
  };

  return (
    <div className="w-full p-4 sm:p-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">My Card</h1>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/addVendorProduct")}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-200"
        >
          Add Product
        </motion.button>
      </div>

      {/* desktop table */}
      <div className="hidden md:block overflow-x-auto bg-gradient-to-br from-white/5 to-white/3 rounded-xl border border-white/20 shadow-lg">
        <table className="w-full text-left">
          <thead className="bg-gradient-to-r from-white/10 to-white/5 sticky top-0 z-10">
            <tr className="border-b border-white/20">
              <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Image
              </th>
              <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Title
              </th>
              <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Price
              </th>
              <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Active
              </th>
              <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {myProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-gray-400 bg-gradient-to-b from-transparent to-white/5"
                >
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-medium">
                      No Vendors Products Found
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              myProducts.map((p, index) => (
                <tr
                  key={index}
                  className="border-t border-white/20 hover:bg-white/10 transition-all duration-200 group"
                >
                  <td className="p-4">
                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                      <Image
                        className="w-full h-full object-cover"
                        width={48}
                        src={p?.image1 || "/placeholder-image.jpg"}
                        alt={p?.title || "Product image"}
                        height={48}
                      />
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="max-w-xs">
                      <p
                        className="font-medium text-white truncate"
                        title={p?.title}
                      >
                        {p?.title}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-green-400">
                      ₹{p?.price}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs bg-yellow-500/30 text-yellow-300">
                        {p?.veificationStatus === "approved"
                          ? "Approved"
                          : p?.veificationStatus || "Pending"}
                      </span>
                      {p.veificationStatus === "rejected" && (
                        <div className="mt-1 bg-red-500/10 border border-red-500/30 text-red-300 text-xs p-2 rounded max-w-xs">
                          <p className="font-medium text-red-400">Rejected:</p>
                          <p className="text-red-300 break-words">
                            {p.rejectedReason || "No Reason Provided"}
                          </p>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                        p?.isActive
                          ? "bg-green-500/20 text-green-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {p?.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 text-center space-x-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)" }}
                      onClick={() => router.push(`/updateProduct/${p._id}`)}
                      className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.02, boxShadow: p?.isActive ? "0 4px 12px rgba(245, 158, 11, 0.4)" : "0 4px 12px rgba(147, 51, 234, 0.4)" }}
                      onClick={() => toggleIsActive(String(p._id), Boolean(p.isActive), p?.title || "")}
                      disabled={p.veificationStatus !== "approved"}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                        p?.isActive 
                          ? "bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white animate-pulse" 
                          : "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white animate-pulse"
                      } ${
                        p.veificationStatus !== "approved" 
                          ? "opacity-50 cursor-not-allowed grayscale" 
                          : ""
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {p?.isActive ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {p?.isActive ? "Disable" : "Enable"}
                      </span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(239, 68, 68, 0.4)" }}
                      onClick={() => deleteProduct(String(p._id), p?.title || "")}
                      className="flex-1 bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </span>
                    </motion.button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* mobile view table data */}
      <div
        className="md:hidden flex flex-col gap-4"
        key={`mobile-products-${allProductsData.length}`}
      >
        {myProducts.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-lg font-medium">No Vendor Products Found</p>
            </div>
          </div>
        ) : (
          myProducts.map((p, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-4 space-y-3 shadow-lg hover:shadow-xl hover:border-white/30 transition-all duration-300"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{p?.title}</h3>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-white/20 text-yellow-300 font-medium">
                  {p?.veificationStatus === "approved"
                    ? "Approved"
                    : p?.veificationStatus || "Pending"}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <Image
                  className="rounded object-cover flex-shrink-0"
                  width={60}
                  src={p?.image1 || "/placeholder-image.jpg"}
                  alt={p?.title || "Product image"}
                  height={60}
                />
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-white">{p?.title}</h2>
                  <p className="text-sm text-gray-300">₹{p?.price}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/20">
                <div className="text-sm">
                  <span className="text-gray-400">Status:</span>
                  <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300">
                    {p?.veificationStatus === "approved"
                      ? "Approved"
                      : p?.veificationStatus || "Pending"}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-400">Active:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      p?.isActive
                        ? "bg-green-500/20 text-green-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {p?.isActive ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-white/20">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)" }}
                  onClick={() => router.push(`/updateProduct/${p._id}`)}
                  className="flex-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02, boxShadow: p?.isActive ? "0 4px 12px rgba(245, 158, 11, 0.4)" : "0 4px 12px rgba(147, 51, 234, 0.4)" }}
                  onClick={async () => {
                    // Ensure mobile view properly handles the toggle with async/await
                    try {
                      await toggleIsActive(
                        String(p._id),
                        Boolean(p.isActive),
                        p?.title || "",
                      );
                    } catch (error) {
                      console.error("Toggle failed:", error);
                    }
                  }}
                  disabled={p.veificationStatus !== "approved"}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                    p?.isActive
                      ? "bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white animate-pulse"
                      : "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white animate-pulse"
                  } ${
                    p.veificationStatus !== "approved"
                      ? "opacity-50 cursor-not-allowed grayscale"
                      : ""
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {p?.isActive ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {p?.isActive ? "Disable" : "Enable"}
                  </span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(239, 68, 68, 0.4)" }}
                  onClick={() => deleteProduct(String(p._id), p?.title || "")}
                  className="flex-1 bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </span>
                </motion.button>
              </div>
              {p.veificationStatus === "rejected" && (
                <div className="mt-2 bg-red-500/10 border border-red-500/30 text-red-300 text-xs p-2 rounded">
                  <p>
                    <b>Rejected:</b> {p.rejectedReason || "No Reason Provided"}
                  </p>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export default VendorProducts;
