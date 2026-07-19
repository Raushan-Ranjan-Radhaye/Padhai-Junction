"use client";
import { IProduct } from "@/model/product.model";
import { AppDispatch, RootState } from "@/redux/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "motion/react";
import UseGetAllVendors from "@/hooks/UseGetAllVendors";
import UseGetAllProducts from "@/hooks/UseGetAllProductsData";
import { setAllProductsData } from "@/redux/vendorSlice";
import { ClipLoader } from "react-spinners";
import axios from "axios";

function ProductApprovel() {
  const dispatch = useDispatch<AppDispatch>();
  UseGetAllVendors();
  UseGetAllProducts();
  const allProductsData: IProduct[] = useSelector(
    (state: RootState) => state.vendor.allProductsData,
  );
  const pendingProducts = Array.isArray(allProductsData)
    ? allProductsData.filter((p) => p.veificationStatus === "pending")
    : [];

  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  const [loading, setLoading] = useState(false);
  const [rejectModel, setRejectModel] = useState(false);
  const [rejectedReason, setRejectedReason] = useState("");

  // rejected the product
  const openRejectReasonArea = () => {
    setRejectModel(true);
    setRejectedReason("");
  };

  // approved product
  const handleApproved = async () => {
    if (!selectedProduct) return;

    setLoading(true);
    try {
      await axios.post("/api/admin/update-product-status", {
        productId: (selectedProduct as any)._id,
        status: "approved",
      });
      const updated = allProductsData.filter(
        (p) => (p as any)._id !== (selectedProduct as any)._id,
      );
      dispatch(setAllProductsData(updated));
      setSelectedProduct(null);
      setLoading(false);
      alert("Product Approved Successfully");
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert("Product Approved Failed");
    }
  };

  // reject product
  const handleReject = async () => {
    if (!selectedProduct || !rejectedReason.trim()) return;

    setLoading(true);
    try {
      await axios.post("/api/admin/update-product-status", {
        productId: (selectedProduct as any)._id,
        status: "rejected",
        reason: rejectedReason.trim(),
      });
      const updated = allProductsData.filter(
        (p) => (p as any)._id !== (selectedProduct as any)._id,
      );
      dispatch(setAllProductsData(updated));
      setSelectedProduct(null);
      setRejectModel(false);
      setRejectedReason("");
      setLoading(false);
      alert("Product Rejected Successfully");
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert("Product Rejection Failed");
    }
  };

  return (
    <div className="w-full px-3 sm:px-6 lg:px-10 text-white">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6">
        Card Approval Requests
      </h1>
      {/* desktop table */}
      <div className="hidden md:block overflow-x-auto bg-gradient-to-br from-white/5 to-white/3 rounded-xl border border-white/20 shadow-lg">
        <table className="w-full text-left">
          <thead className="bg-gradient-to-r from-white/10 to-white/5 sticky top-0 z-10">
            <tr className="border-b border-white/20">
              <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Image
              </th>
              <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Card Name
              </th>
              <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Price
              </th>
              <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Teacher
              </th>
              <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {pendingProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
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
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-4h-2v4m0 0h-2m-2-4v4m-2-4v.01"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-medium">
                      No Card Requests Found
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Check back later for new card submissions
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              pendingProducts.map((product, index) => (
                <tr
                  key={index}
                  className="border-t border-white/20 hover:bg-white/10 transition-all duration-200 group"
                >
                  <td className="p-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center overflow-hidden border border-white/20">
                      <img
                        className="w-full h-full object-cover"
                        src={product?.image1 || "/placeholder-image.jpg"}
                        alt={product?.title || "Product image"}
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="max-w-xs">
                      <p
                        className="font-medium text-white truncate group-hover:text-blue-300 transition-colors"
                        title={product?.title}
                      >
                        {product?.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {product?.description?.slice(0, 50)}
                        {product?.description?.length > 50 ? "..." : ""}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-white/20 text-sm font-semibold text-green-300">
                      ₹{product?.price}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/20 text-sm">
                      {product?.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-white/20 text-sm">
                      {typeof product?.vendor === "object"
                        ? product.vendor.name
                        : "Unknown Vendor"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-white/20 text-yellow-300 font-medium">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                      {product?.veificationStatus}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="group/btn px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium text-sm shadow-lg hover:shadow-blue-500/25 transition-all duration-200 transform hover:scale-105 active:scale-95 border border-white/20"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        <span>View Details</span>
                      </span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* mobile view table data */}
      <div className="md:hidden flex flex-col gap-4">
        {pendingProducts.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
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
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-4h-2v4m0 0h-2m-2-4v4m-2-4v.01"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium">No Product Requests Found</p>
              <p className="text-sm text-gray-500 mt-1">
                Check back later for new card submissions
              </p>
            </div>
          </div>
        ) : (
          pendingProducts.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-4 space-y-3 shadow-lg hover:shadow-xl hover:border-white/30 transition-all duration-300"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg overflow-hidden border border-white/20">
                    <img
                      className="w-full h-full object-cover"
                      src={product?.image1 || "/placeholder-image.jpg"}
                      alt={product?.title || "Product image"}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white">
                      {product?.title}
                    </h3>
                    <p className="text-xs text-gray-400">{product?.category}</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-white/20 text-yellow-300 font-medium">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                  {product?.veificationStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between items-center bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-white/20 rounded-lg p-2">
                  <span className="text-gray-300 font-medium">Price:</span>
                  <span className="text-white font-semibold">
                    ₹{product.price}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/20 rounded-lg p-2">
                  <span className="text-gray-300 font-medium">Teacher Name:</span>
                  <span className="text-white">
                    {typeof product?.vendor === "object"
                      ? product.vendor.name
                      : "Unknown Vendor"}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-white/20 rounded-lg p-2">
                  <span className="text-gray-300 font-medium">No of children are teach:</span>
                  <span className="text-white">{product.stock}</span>
                </div>
              </div>

            
              <button
                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium text-sm py-2.5 rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-200 transform hover:scale-105 active:scale-95 border border-white/20"
                onClick={() => setSelectedProduct(product)}
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span>View Details</span>
                </span>
              </button>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-8"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, type: "spring", damping: 25 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl w-full max-w-lg border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Card Details
                </h3>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-gray-400 hover:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 text-sm mt-3">
                <div className="flex justify-center mb-4">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg overflow-hidden border border-white/20">
                    <img
                      className="w-full h-full object-cover"
                      src={selectedProduct?.image1 || "/placeholder-image.jpg"}
                      alt={selectedProduct?.title || "Product image"}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/20 rounded-lg p-3">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      Name
                    </span>
                    <p className="mt-1 font-semibold text-white">
                      {selectedProduct.title}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-white/20 rounded-lg p-3">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      Price
                    </span>
                    <p className="mt-1 font-semibold text-white">
                      ₹{selectedProduct.price}
                    </p>
                  </div>
                </div>

                {/* --- DESCRIPTION SLIDER START --- */}
                <div className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 border border-white/20 rounded-lg p-3">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">
                    Description
                  </span>
                  <div className="mt-1 max-h-24 overflow-y-auto pr-2 custom-scrollbar">
                    <p className="font-semibold text-white">
                      {selectedProduct.description}
                    </p>
                  </div>
                  {/* Inline CSS for the scrollbar to keep layout clean */}
                  <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar {
                      width: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                      background: rgba(255, 255, 255, 0.05);
                      border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                      background: rgba(255, 255, 255, 0.2);
                      border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                      background: rgba(255, 255, 255, 0.3);
                    }
                  `}</style>
                </div>
                {/* --- DESCRIPTION SLIDER END --- */}

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/20 rounded-lg p-3">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      Category
                    </span>
                    <p className="mt-1 font-semibold text-white">
                      {selectedProduct.category}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-white/20 rounded-lg p-3">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      No of children are teach
                    </span>
                    <p className="mt-1 font-semibold text-white">
                      {selectedProduct.stock}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/20 rounded-lg p-3">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      Teacher Name
                    </span>
                    <p className="mt-1 font-semibold text-white">
                      {typeof selectedProduct?.vendor === "object"
                        ? selectedProduct.vendor.name
                        : "Unknown Vendor"}
                    </p>
                  </div>
                  {/* <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-white/20 rounded-lg p-3">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      Is Wearable
                    </span>
                    <p className="mt-1 font-semibold text-white">
                      {selectedProduct.isWearable ? "Yes" : "No"}
                    </p>
                  </div> */}
                </div>

                {selectedProduct.isWearable && selectedProduct.sizes && (
                  <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-white/20 rounded-lg p-3">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      Sizes
                    </span>
                    <p className="mt-1 font-semibold text-white">
                      {Array.isArray(selectedProduct.sizes)
                        ? selectedProduct.sizes.join(", ")
                        : selectedProduct.sizes}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  disabled={loading}
                  onClick={handleApproved}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-2.5 rounded-lg shadow-lg hover:shadow-green-500/25 transition-all duration-200 transform hover:scale-105 active:scale-95 border border-white/20"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>
                      {loading ? (
                        <ClipLoader size={20} color="white" />
                      ) : (
                        "Approve"
                      )}
                    </span>
                  </span>
                </button>
                <button
                  onClick={openRejectReasonArea}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-2.5 rounded-lg shadow-lg hover:shadow-red-500/25 transition-all duration-200 transform hover:scale-105 active:scale-95 border border-white/20"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span>Reject</span>
                  </span>
                </button>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium py-2.5 rounded-lg shadow-lg hover:shadow-gray-500/25 transition-all duration-200 transform hover:scale-105 active:scale-95 border border-white/20"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    <span>Cancel</span>
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rejectModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-8"
            onClick={() => setRejectModel(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring", damping: 25 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl w-full max-w-lg border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Enter Rejection Reason
                </h3>
                <button
                  onClick={() => setRejectModel(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-gray-400 hover:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <textarea
                  rows={4}
                  placeholder="Please enter the reason for rejecting this product..."
                  onChange={(e) => setRejectedReason(e.target.value)}
                  value={rejectedReason}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={handleReject}
                    disabled={loading || !rejectedReason.trim()}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-2.5 rounded-lg shadow-lg hover:shadow-red-500/25 transition-all duration-200 transform hover:scale-105 active:scale-95 border border-white/20 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span>
                        {loading ? (
                          <ClipLoader size={20} color="white" />
                        ) : (
                          "Confirm Reject"
                        )}
                      </span>
                    </span>
                  </button>
                  <button
                    onClick={() => setRejectModel(false)}
                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium py-2.5 rounded-lg shadow-lg hover:shadow-gray-500/25 transition-all duration-200 transform hover:scale-105 active:scale-95 border border-white/20"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                      </svg>
                      <span>Cancel</span>
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProductApprovel;