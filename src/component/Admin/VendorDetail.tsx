"use client";
import { IUser } from "@/model/user.model";
import { AppDispatch, RootState } from "@/redux/store";
import { useState } from "react";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "motion/react";
import UseGetAllVendors from "@/hooks/UseGetAllVendors";
import Image from "next/image";
import { FaTimes, FaChevronLeft, FaChevronRight, FaBox, FaTag, FaInfoCircle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// Interface for populated product
interface IPopulatedProduct {
  _id: string;
  title: string;
  description?: string;
  price: number;
  category?: string;
  stock?: number;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  verificationStatus?: string;
  detailsPoints?: string[];
  freeDelivery?: boolean;
  replacementDays?: number;
  warrenty?: number;
  payOnDelivery?: boolean;
}

function VendorDetail() {
  UseGetAllVendors();
  const allVendorsData: IUser[] = useSelector(
    (state: RootState) => state.vendor.allVendorsData,
  );

  const [selectedVendor, setSelectedVendor] = useState<IUser | null>(null);
  const [showProducts, setShowProducts] = useState(false);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  const ApprovedVendors = Array.isArray(allVendorsData)
    ? allVendorsData.filter((v) => v.verificationStatus === "approved")
    : [];

  // Type assertion for populated vendor products
  const vendorProducts = (selectedVendor?.vendorProducts as unknown as IPopulatedProduct[]) || [];
  
  const nextProduct = () => {
    if (vendorProducts.length > 0) {
      setCurrentProductIndex((prev) => (prev + 1) % vendorProducts.length);
    }
  };
  
  const prevProduct = () => {
    if (vendorProducts.length > 0) {
      setCurrentProductIndex((prev) => (prev - 1 + vendorProducts.length) % vendorProducts.length);
    }
  };

  const currentProduct = vendorProducts[currentProductIndex];

  return (
    <div className="w-full px-3 sm:px-6 lg:px-10 text-white">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6">
        Approved Vendors
      </h1>
      
      {/* desktop table */}
      <div className="hidden md:block overflow-x-auto bg-gradient-to-br from-white/5 to-white/3 rounded-xl border border-white/20 shadow-lg">
        <table className="w-full text-left">
          <thead className="bg-gradient-to-r from-white/10 to-white/5 sticky top-0 z-10">
            <tr className="border-b border-white/20">
              <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Vendor Name
              </th>
              <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Shop Name
              </th>
              <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Phone
              </th>
              <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider text-center">
                Details
              </th>
              <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider text-center">
                Products Details
              </th>
            </tr>
          </thead>

          <tbody>
            {ApprovedVendors.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
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
                      No Approved Vendors Found
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Check back later for approved vendors
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              ApprovedVendors.map((vendor, index) => (
                <tr
                  key={index}
                  className="border-t border-white/20 hover:bg-white/10 transition-all duration-200 group"
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-white/20">
                        <span className="text-sm font-semibold text-white">
                          {vendor?.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-white group-hover:text-blue-300 transition-colors">
                          {vendor?.name}
                        </p>
                        <p className="text-xs text-gray-400">{vendor?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/20 text-sm">
                      {vendor?.shopName || "-"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-white/20 text-sm">
                      {vendor?.phone || "-"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-white/20 text-green-300 font-medium">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      {vendor?.verificationStatus}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedVendor(vendor)}
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
                        <span>View</span>
                      </span>
                    </button>
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedVendor(vendor);
                        setShowProducts(true);
                        setCurrentProductIndex(0);
                      }}
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
                        <span>Vendor Products</span>
                      </span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* mobile view */}
      <div className="md:hidden flex flex-col gap-4">
        {ApprovedVendors.length === 0 ? (
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium">No Approved Vendors Found</p>
              <p className="text-sm text-gray-500 mt-1">
                Check back later for approved vendors
              </p>
            </div>
          </div>
        ) : (
          ApprovedVendors.map((vendor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-4 space-y-3 shadow-lg hover:shadow-xl hover:border-white/30 transition-all duration-300"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-white/20">
                    <span className="text-sm font-semibold text-white">
                      {vendor?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white">
                      {vendor?.name}
                    </h3>
                    <p className="text-xs text-gray-400">{vendor?.email}</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-white/20 text-green-300 font-medium">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  {vendor?.verificationStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between items-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/20 rounded-lg p-2">
                  <span className="text-gray-300 font-medium">Shop:</span>
                  <span className="text-white">{vendor.shopName || "-"}</span>
                </div>
                <div className="flex justify-between items-center bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-white/20 rounded-lg p-2">
                  <span className="text-gray-300 font-medium">Phone:</span>
                  <span className="text-white">{vendor.phone || "-"}</span>
                </div>
              </div>

              <button
                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium text-sm py-2.5 rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-200 transform hover:scale-105 active:scale-95 border border-white/20"
                onClick={() => setSelectedVendor(vendor)}
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

      {/* Modal */}
      <AnimatePresence>
        {selectedVendor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-8"
            onClick={() => setSelectedVendor(null)}
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
                  Vendor Details
                </h3>
                <button
                  onClick={() => setSelectedVendor(null)}
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/20 rounded-lg p-3">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      Name
                    </span>
                    <p className="mt-1 font-semibold text-white">
                      {selectedVendor.name}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-white/20 rounded-lg p-3">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      Phone
                    </span>
                    <p className="mt-1 font-semibold text-white">
                      {selectedVendor.phone || "-"}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 border border-white/20 rounded-lg p-3">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">
                    Email
                  </span>
                  <p className="mt-1 font-semibold text-white">
                    {selectedVendor.email}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/20 rounded-lg p-3">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      Shop Name
                    </span>
                    <p className="mt-1 font-semibold text-white">
                      {selectedVendor.shopName || "-"}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-white/20 rounded-lg p-3">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      GSTIN
                    </span>
                    <p className="mt-1 font-semibold text-white">
                      {selectedVendor.gstNumber || "-"}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 border border-white/20 rounded-lg p-3">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">
                    Shop Address
                  </span>
                  <p className="mt-1 font-semibold text-white">
                    {selectedVendor.shopAddress || "-"}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setSelectedVendor(null)}
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium py-2.5 rounded-lg shadow-lg hover:shadow-gray-500/25 transition-all duration-200 transform hover:scale-105 active:scale-95 border border-white/20"
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
                    <span>Close</span>
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vendor Products Slider Modal */}
      <AnimatePresence>
        {showProducts && selectedVendor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-2 sm:px-4 py-4 sm:py-8"
            onClick={() => setShowProducts(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-3 sm:p-6 rounded-2xl w-full max-w-3xl border border-white/20 shadow-2xl max-h-[95vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-2xl font-bold text-white truncate">
                    {selectedVendor.name}&apos;s Products
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {vendorProducts.length} product{vendorProducts.length !== 1 ? "s" : ""} available
                  </p>
                </div>
                <button
                  onClick={() => setShowProducts(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0 ml-2"
                >
                  <FaTimes className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-white" />
                </button>
              </div>

              {vendorProducts.length === 0 ? (
                <div className="text-center py-8 sm:py-10">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <FaBox className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
                  </div>
                  <p className="text-base sm:text-lg font-medium text-gray-300">No Products Found</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">This vendor hasn&apos;t added any products yet</p>
                </div>
              ) : (
                <>
                  {/* Product Slider */}
                  <div className="relative">
                    {/* Navigation Arrows */}
                    {vendorProducts.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            prevProduct();
                          }}
                          className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 sm:p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                        >
                          <FaChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            nextProduct();
                          }}
                          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 sm:p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                        >
                          <FaChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </button>
                      </>
                    )}

                    {/* Product Card */}
                    <div className="bg-white/5 rounded-xl sm:rounded-2xl border border-white/20 overflow-hidden">
                      {/* Multiple Product Images Slider */}
                      <div className="relative">
                        {/* Image Slider Container */}
                        <div className="relative h-40 sm:h-56 lg:h-64 bg-gray-800 overflow-hidden">
                          {/* All product images as slides */}
                          {[
                            currentProduct?.image1,
                            currentProduct?.image2,
                            currentProduct?.image3,
                            currentProduct?.image4,
                          ]
                            .filter(Boolean)
                            .map((img, imgIdx, filteredImages) => (
                              <div
                                key={imgIdx}
                                className={`absolute inset-0 transition-opacity duration-300 ${
                                  imgIdx === 0 ? "opacity-100" : "opacity-0"
                                }`}
                              >
                                {img ? (
                                  <Image
                                    src={img}
                                    alt={`${currentProduct?.title || "Product"} ${imgIdx + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full">
                                    <FaBox className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600" />
                                  </div>
                                )}
                              </div>
                            ))}
                          
                          {/* Show placeholder if no images */}
                          {![
                            currentProduct?.image1,
                            currentProduct?.image2,
                            currentProduct?.image3,
                            currentProduct?.image4,
                          ].filter(Boolean).length && (
                            <div className="flex items-center justify-center h-full">
                              <FaBox className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600" />
                            </div>
                          )}
                        </div>

                        {/* Image Slide Indicators */}
                        {[
                          currentProduct?.image1,
                          currentProduct?.image2,
                          currentProduct?.image3,
                          currentProduct?.image4,
                        ]
                          .filter(Boolean).length > 1 && (
                          <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {[
                              currentProduct?.image1,
                              currentProduct?.image2,
                              currentProduct?.image3,
                              currentProduct?.image4,
                            ]
                              .filter(Boolean)
                              .map((_, idx) => (
                                <button
                                  key={idx}
                                  className={`w-2 h-2 rounded-full transition-all ${
                                    idx === 0 ? "bg-white w-4" : "bg-white/40 hover:bg-white/60"
                                  }`}
                                />
                              ))}
                          </div>
                        )}

                        {/* Product Counter Badge */}
                        <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded-lg text-xs text-white">
                          {currentProductIndex + 1}/{vendorProducts.length}
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="p-3 sm:p-4 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <h4 className="text-base sm:text-lg font-semibold text-white flex-1 truncate">
                            {currentProduct?.title || "Untitled Product"}
                          </h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 self-start sm:self-center ${
                            currentProduct?.verificationStatus === "approved" 
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}>
                            {currentProduct?.verificationStatus === "approved" ? (
                              <><FaCheckCircle className="w-3 h-3" /> Approved</>
                            ) : (
                              <><FaTimesCircle className="w-3 h-3" /> {currentProduct?.verificationStatus || "Pending"}</>
                            )}
                          </span>
                        </div>

                        {/* Price and Category */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 text-sm">
                          <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-white/10 rounded-lg p-2 sm:p-3">
                            <span className="text-xs text-gray-400">Price</span>
                            <p className="font-bold text-green-400 text-base sm:text-lg">
                              ₹{currentProduct?.price?.toLocaleString() || "0"}
                            </p>
                          </div>
                          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-lg p-2 sm:p-3">
                            <span className="text-xs text-gray-400">Category</span>
                            <p className="text-white truncate text-sm sm:text-base">
                              {currentProduct?.category || "-"}
                            </p>
                          </div>
                        </div>

                        {/* Description Section with Slider */}
                        <div className="bg-gradient-to-r from-gray-700/30 to-gray-600/30 border border-white/10 rounded-lg p-3 sm:p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <FaInfoCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                            <span className="text-xs sm:text-sm text-gray-400">Description</span>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                            {currentProduct?.description || "No description available"}
                          </p>
                        </div>

                        {/* Additional Info Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {currentProduct?.freeDelivery && (
                            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-white/10 rounded-lg p-2 text-center">
                              <span className="text-[10px] sm:text-xs text-gray-400">Free Delivery</span>
                            </div>
                          )}
                          {currentProduct?.replacementDays && currentProduct.replacementDays > 0 && (
                            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-white/10 rounded-lg p-2 text-center">
                              <span className="text-[10px] sm:text-xs text-gray-400">{currentProduct.replacementDays} Days Replacement</span>
                            </div>
                          )}
                          {currentProduct?.warrenty && currentProduct.warrenty > 0 && (
                            <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-white/10 rounded-lg p-2 text-center">
                              <span className="text-[10px] sm:text-xs text-gray-400">{currentProduct.warrenty} Months Warranty</span>
                            </div>
                          )}
                          {currentProduct?.payOnDelivery && (
                            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-white/10 rounded-lg p-2 text-center">
                              <span className="text-[10px] sm:text-xs text-gray-400">COD Available</span>
                            </div>
                          )}
                        </div>

                        {/* Details Points */}
                        {currentProduct?.detailsPoints && currentProduct.detailsPoints.length > 0 && (
                          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-white/10 rounded-lg p-3 sm:p-4">
                            <span className="text-xs sm:text-sm text-gray-400 mb-2 block">Key Features:</span>
                            <ul className="space-y-1">
                              {currentProduct.detailsPoints.slice(0, 4).map((point, idx) => (
                                <li key={idx} className="text-xs sm:text-sm text-gray-300 flex items-start gap-2">
                                  <span className="text-green-400 mt-0.5">✓</span>
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Stock Info */}
                        <div className="flex justify-between items-center text-xs sm:text-sm text-gray-400 pt-2 border-t border-white/10">
                          <span>Stock: <span className={currentProduct?.stock && currentProduct.stock > 0 ? "text-green-400" : "text-red-400"}>{currentProduct?.stock || 0}</span></span>
                          <span>Product {currentProductIndex + 1} of {vendorProducts.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product Navigation Dots */}
                  {vendorProducts.length > 1 && (
                    <div className="flex justify-center gap-1.5 mt-3 flex-wrap">
                      {vendorProducts.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentProductIndex(idx)}
                          className={`h-2 rounded-full transition-all ${
                            idx === currentProductIndex
                              ? "bg-blue-500 w-6"
                              : "bg-white/20 w-2 hover:bg-white/40"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}

              <button
                onClick={() => setShowProducts(false)}
                className="w-full mt-3 sm:mt-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium py-2 sm:py-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 border border-white/20 text-sm sm:text-base"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default VendorDetail;
