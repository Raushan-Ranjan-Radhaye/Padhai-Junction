"use client";

import { RootState } from "@/redux/store";
import UseGetAllOrdersData from "@/hooks/UseGetAllOrdersData";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

// Icons
import {
  FaHashtag,
  FaUser,
  FaRupeeSign,
  FaCreditCard,
  FaEye,
  FaEdit,
  FaShippingFast,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaTruck,
  FaHome,
  FaPhone,
  FaMoneyBillWave,
  FaTimes,
  FaCalendarAlt,
  FaInfoCircle,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaEnvelope,
  FaStore,
} from "react-icons/fa";
import {
  MdVerified,
  MdLocalShipping,
  MdPayment,
  MdInventory,
} from "react-icons/md";

function UserOrders() {
  UseGetAllOrdersData();
  
  const { allOrdersData } = useSelector((state: RootState) => state.user);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "confirmed":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "shipped":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "delivered":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "returned":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <FaClock className="w-3 h-3" />;
      case "confirmed":
        return <MdVerified className="w-3 h-3" />;
      case "shipped":
        return <MdLocalShipping className="w-3 h-3" />;
      case "delivered":
        return <FaCheckCircle className="w-3 h-3" />;
      case "cancelled":
        return <FaTimesCircle className="w-3 h-3" />;
      case "returned":
        return <FaBoxOpen className="w-3 h-3" />;
      default:
        return <FaInfoCircle className="w-3 h-3" />;
    }
  };

  // Check if status can be updated
  const canUpdateStatus = (status: string) => {
    return status !== "delivered" && status !== "cancelled" && status !== "returned";
  };

  // Handle status change
  const handleStatusChange = async (order: any, newStatus: string) => {
    try {
      // This would be implemented if status updates were needed
      console.log("Status change would be handled here");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };


  return (
    <div className="w-full px-3 sm:px-4 lg:px-6 xl:px-10 text-white min-h-screen">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          My Orders
        </h1>
        <p className="text-gray-400 mt-1 text-xs sm:text-sm md:text-base">
          Manage  your teacher orders
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
        <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl p-2 sm:p-3 lg:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg">
              <FaBoxOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold truncate">{allOrdersData.length}</p>
              <p className="text-[10px] sm:text-xs text-gray-400">Total Orders</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl p-2 sm:p-3 lg:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-yellow-500/20 rounded-lg">
              <FaClock className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-yellow-400" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
                {allOrdersData.filter((o: any) => o.orderStatus === "pending").length}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400">Pending</p>
            </div>
          </div>
        </div>
        {/* <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl p-2 sm:p-3 lg:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-purple-500/20 rounded-lg">
              <MdLocalShipping className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-purple-400" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
                {allOrdersData.filter((o: any) => o.orderStatus === "shipped").length}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400">Shipped</p>
            </div>
          </div>
        </div> */}
        {/* <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl p-2 sm:p-3 lg:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-green-500/20 rounded-lg">
              <FaCheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-green-400" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
                {allOrdersData.filter((o: any) => o.orderStatus === "delivered").length}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400">Delivered</p>
            </div>
          </div>
        </div> */}
      </div>

      {/* Desktop Table View - with horizontal scroll */}
      <div className="hidden lg:block overflow-hidden bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/20 shadow-2xl">
        <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-gradient-to-r from-white/10 to-white/5 border-b border-white/20">
                <th className="p-3 lg:p-4 text-left">
                  <span className="flex items-center gap-1.5 lg:gap-2 text-xs lg:text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    <FaHashtag className="text-xs text-blue-400" /> Order ID
                  </span>
                </th>
                <th className="p-3 lg:p-4 text-left">
                  <span className="flex items-center gap-1.5 lg:gap-2 text-xs lg:text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    <FaUser className="text-xs text-purple-400" /> Buyer & Products
                  </span>
                </th>
                <th className="p-3 lg:p-4 text-left">
                  <span className="flex items-center gap-1.5 lg:gap-2 text-xs lg:text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    <FaRupeeSign className="text-xs text-green-400" /> Amount
                  </span>
                </th>
                <th className="p-3 lg:p-4 text-left">
                  <span className="flex items-center gap-1.5 lg:gap-2 text-xs lg:text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    <MdPayment className="text-xs text-orange-400" /> Payment
                  </span>
                </th>
                <th className="p-3 lg:p-4 text-left">
                  <span className="flex items-center gap-1.5 lg:gap-2 text-xs lg:text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    <FaShippingFast className="text-xs text-cyan-400" /> Status
                  </span>
                </th>
                <th className="p-3 lg:p-4 text-center">
                  <span className="flex items-center justify-center gap-1.5 lg:gap-2 text-xs lg:text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    <FaEye className="text-xs text-indigo-400" /> Details
                  </span>
                </th>
                <th className="p-3 lg:p-4 text-center">
                  <span className="flex items-center justify-center gap-1.5 lg:gap-2 text-xs lg:text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    <FaEdit className="text-xs text-pink-400" /> Teacher
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {allOrdersData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <FaBoxOpen className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-xl font-semibold text-gray-300">
                        No Orders Found
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Check back later for new orders
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                allOrdersData.map((order: any, index: number) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-t border-white/10 hover:bg-white/10 transition-all duration-300 group"
                  >
                    <td className="p-2 lg:p-4">
                      <div className="flex items-center gap-2 lg:gap-3">
                        <div className="p-1.5 lg:p-2 bg-blue-500/20 rounded-lg">
                          <FaHashtag className="w-3 lg:w-4 h-3 lg:h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-white group-hover:text-blue-300 transition-colors text-xs lg:text-sm">
                            #{String(order?._id).slice(-6).toUpperCase()}
                          </p>
                          <p className="text-[10px] lg:text-xs text-gray-500 flex items-center gap-1">
                            <FaCalendarAlt className="w-2.5 lg:w-3 h-2.5 lg:h-3" />
                            {new Date(order?.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 lg:p-4">
                      <div className="flex items-center gap-2 lg:gap-3">
                        <div className="p-1.5 lg:p-2 bg-purple-500/20 rounded-lg hidden sm:block">
                          <FaUser className="w-3 lg:w-4 h-3 lg:h-4 text-purple-400" />
                        </div>
                        <div className="max-w-[100px] sm:max-w-[140px] lg:max-w-xs">
                          <p className="font-medium text-white text-xs lg:text-sm truncate">
                            {order.address?.name || "N/A"}
                          </p>
                          <div className="text-[10px] lg:text-xs text-gray-400 mt-0.5 lg:mt-1">
                            {order.products
                              ?.slice(0, 2)
                              .map((p: any, i: number) => (
                                <div key={i} className="truncate">
                                  {p.product?.title?.substring(0, 20)} ×{" "}
                                  {p.quantity}
                                </div>
                              ))}
                            {order.products?.length > 2 && (
                              <span className="text-blue-400">
                                +{order.products.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 lg:p-4">
                      <div className="flex items-center gap-2 lg:gap-3">
                        <div className="p-1.5 lg:p-2 bg-green-500/20 rounded-lg hidden sm:block">
                          <FaRupeeSign className="w-3 lg:w-4 h-3 lg:h-4 text-green-400" />
                        </div>
                        <span className="font-bold text-sm lg:text-lg text-green-400">
                          ₹{order?.totalAmount?.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="p-2 lg:p-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-1.5 lg:p-2 rounded-lg ${
                            order?.paymentMethod === "cod"
                              ? "bg-orange-500/20"
                              : "bg-purple-500/20"
                          }`}
                        >
                          {order?.paymentMethod === "cod" ? (
                            <FaMoneyBillWave className="w-3 lg:w-4 h-3 lg:h-4 text-orange-400" />
                          ) : (
                            <FaCreditCard className="w-3 lg:w-4 h-3 lg:h-4 text-purple-400" />
                          )}
                        </div>
                        <span
                          className={`px-2 lg:px-3 py-1 rounded-lg text-xs font-medium border ${
                            order?.paymentMethod === "cod"
                              ? "bg-orange-500/20 text-orange-300 border-orange-500/30"
                              : "bg-purple-500/20 text-purple-300 border-purple-500/30"
                          }`}
                        >
                          {order?.paymentMethod === "cod" ? "COD" : "Stripe"}
                        </span>
                      </div>
                    </td>
                    <td className="p-2 lg:p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg text-xs font-medium border ${getStatusColor(
                          order?.orderStatus,
                        )}`}
                      >
                        {getStatusIcon(order?.orderStatus)}
                        <span className="hidden sm:inline">
                          {order?.orderStatus?.charAt(0).toUpperCase() +
                            order?.orderStatus?.slice(1)}
                        </span>
                      </span>
                    </td>
                    <td className="p-2 lg:p-4 text-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="group/btn px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium text-xs lg:text-sm shadow-lg hover:shadow-blue-500/30 transition-all duration-200 transform hover:scale-105 active:scale-95 border border-white/10 hover:border-white/30"
                      >
                        <span className="flex items-center justify-center gap-1.5 lg:gap-2">
                          <FaEye className="w-3 lg:w-4 h-3 lg:h-4" />
                          <span className="hidden sm:inline">View</span>
                        </span>
                      </button>
                    </td>
                    <td className="p-2 lg:p-4">
                      <div className="flex items-center justify-center gap-1.5 lg:gap-2">
                        <div className="p-1.5 lg:p-2 bg-pink-500/20 rounded-lg">
                          <FaStore className="w-3 lg:w-4 h-3 lg:h-4 text-pink-400" />
                        </div>
                        <span className="hidden sm:inline text-xs lg:text-sm text-pink-300 truncate max-w-[100px] lg:max-w-[120px]">
                          {order.productVendor?.shopName || "N/A"}
                        </span>
                        
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tablet View - Compact Table (md to lg) */}
      <div className="hidden md:block lg:hidden overflow-hidden bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/20 shadow-2xl">
        <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-gradient-to-r from-white/10 to-white/5 border-b border-white/20">
                <th className="p-3 text-left">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    <FaHashtag className="text-xs text-blue-400" /> ID
                  </span>
                </th>
                <th className="p-3 text-left">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    <FaUser className="text-xs text-purple-400" /> Buyer
                  </span>
                </th>
                <th className="p-3 text-left">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    <FaRupeeSign className="text-xs text-green-400" /> Amount
                  </span>
                </th>
                <th className="p-3 text-left">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    <MdPayment className="text-xs text-orange-400" /> Pay
                  </span>
                </th>
                <th className="p-3 text-left">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    <FaShippingFast className="text-xs text-cyan-400" /> Status
                  </span>
                </th>
                <th className="p-3 text-center">
                  <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Action
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {allOrdersData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
                        <FaBoxOpen className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-lg font-semibold text-gray-300">
                        No Orders Found
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Check back later for new orders
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                allOrdersData.map((order: any, index: number) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-t border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white text-xs">
                          #{String(order?._id).slice(-6).toUpperCase()}
                        </p>
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="font-medium text-white text-xs truncate max-w-[100px]">
                        {order.address?.name || "N/A"}
                      </p>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-sm text-green-400">
                        ₹{order?.totalAmount?.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          order?.paymentMethod === "cod"
                            ? "bg-orange-500/20 text-orange-300"
                            : "bg-purple-500/20 text-purple-300"
                        }`}
                      >
                        {order?.paymentMethod === "cod" ? "COD" : "Stripe"}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(
                          order?.orderStatus,
                        )}`}
                      >
                        {getStatusIcon(order?.orderStatus)}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium"
                      >
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-3 sm:gap-4">
        {allOrdersData.length === 0 ? (
          <div className="text-center text-gray-400 py-8 sm:py-10">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                <FaBoxOpen className="w-8 sm:w-10 h-8 sm:h-10 text-gray-400" />
              </div>
              <p className="text-lg sm:text-xl font-semibold text-gray-300">
                No Orders Found
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Check back later for new orders
              </p>
            </div>
          </div>
        ) : (
          allOrdersData.map((order: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-lg hover:shadow-xl hover:border-white/30 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg">
                    <FaHashtag className="w-4 sm:w-5 h-4 sm:h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold">
                      #{String(order?._id).slice(-6).toUpperCase()}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1">
                      <FaCalendarAlt className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                      {new Date(order?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium border ${getStatusColor(
                    order?.orderStatus,
                  )}`}
                >
                  {getStatusIcon(order?.orderStatus)}
                  <span className="hidden xs:inline">
                    {order?.orderStatus?.charAt(0).toUpperCase() +
                      order?.orderStatus?.slice(1)}
                  </span>
                </span>
              </div>

              {/* Buyer Info */}
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-white/10">
                <div className="p-1.5 sm:p-2 bg-purple-500/20 rounded-lg">
                  <FaUser className="w-3 sm:w-4 h-3 sm:h-4 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm sm:text-base truncate">
                    {order.address?.name}
                  </p>
                  <div className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
                    {order.products?.slice(0, 2).map((p: any, i: number) => (
                      <div key={i} className="truncate">
                        {p.product?.title?.substring(0, 25)} × {p.quantity}
                      </div>
                    ))}
                    {order.products?.length > 2 && (
                      <span className="text-blue-400">
                        +{order.products.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Amount & Payment */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-green-500/20 rounded-lg">
                    <FaRupeeSign className="w-3 sm:w-4 h-3 sm:h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-400">Total Amount</p>
                    <p className="text-lg sm:text-xl font-bold text-green-400">
                      ₹{order?.totalAmount?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div
                    className={`p-1.5 sm:p-2 rounded-lg ${
                      order?.paymentMethod === "cod"
                        ? "bg-orange-500/20"
                        : "bg-purple-500/20"
                    }`}
                  >
                    {order?.paymentMethod === "cod" ? (
                      <FaMoneyBillWave className="w-3 sm:w-4 h-3 sm:h-4 text-orange-400" />
                    ) : (
                      <FaCreditCard className="w-3 sm:w-4 h-3 sm:h-4 text-purple-400" />
                    )}
                  </div>
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-medium ${
                      order?.paymentMethod === "cod"
                        ? "bg-orange-500/20 text-orange-300"
                        : "bg-purple-500/20 text-purple-300"
                    }`}
                  >
                    {order?.paymentMethod === "cod" ? "COD" : "Stripe"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-1.5 sm:gap-2 text-sm"
                >
                  <FaEye className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                  View Details
                </button>
                {canUpdateStatus(order.orderStatus) ? (
                  <div className="flex items-center justify-center px-3 sm:px-4 bg-white/5 rounded-xl border border-white/10">
                    <FaStore className="w-3 sm:w-4 h-3 sm:h-4 text-pink-400 mr-1.5 sm:mr-2" />
                    <span className="text-pink-300 text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[100px]">
                      {order.productVendor?.shopName || "N/A"}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center px-3 sm:px-4 bg-white/5 rounded-xl border border-white/10">
                    <FaStore className="w-3 sm:w-4 h-3 sm:h-4 text-pink-400 mr-1.5 sm:mr-2" />
                    <span className="text-pink-300 text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[100px]">
                      {order.productVendor?.shopName || "N/A"}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedOrder(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/20 rounded-2xl p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-white/10">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg">
                    <FaHashtag className="w-4 sm:w-5 h-4 sm:h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-xl font-bold">
                      Order #{String(selectedOrder._id).slice(-6).toUpperCase()}
                    </h2>
                    <p className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1">
                      <FaCalendarAlt className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                      {new Date(selectedOrder.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <FaTimes className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 hover:text-white" />
                </button>
              </div>

              {/* Order Status */}
              <div className="bg-white/5 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-400 mb-2 sm:mb-3 flex items-center gap-2">
                  <FaShippingFast className="w-3 sm:w-4 h-3 sm:h-4" /> Order Status
                </h3>
                <span
                  className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium border ${getStatusColor(
                    selectedOrder.orderStatus,
                  )}`}
                >
                  {getStatusIcon(selectedOrder.orderStatus)}
                  {selectedOrder.orderStatus?.charAt(0).toUpperCase() +
                    selectedOrder.orderStatus?.slice(1)}
                </span>
              </div>

              {/* User Information */}
              <div className="bg-white/5 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-400 mb-2 sm:mb-3 flex items-center gap-2">
                  <FaUser className="w-3 sm:w-4 h-3 sm:h-4" /> User Information
                </h3>
                <div className="space-y-1.5 sm:space-y-2">
                  <p className="font-medium flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <FaUser className="w-3 sm:w-4 h-3 sm:h-4 text-purple-400" />
                    {selectedOrder.buyer?.name || selectedOrder.address?.name || "N/A"}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-1.5 sm:gap-2">
                    <FaEnvelope className="w-3 sm:w-4 h-3 sm:h-4" />
                    {selectedOrder.buyer?.email || "N/A"}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-1.5 sm:gap-2">
                    <FaPhone className="w-3 sm:w-4 h-3 sm:h-4" />
                    {selectedOrder.address?.phone || "N/A"}
                  </p>
                </div>
              </div>

              {/* Products */}
              <div className="bg-white/5 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-400 mb-2 sm:mb-3 flex items-center gap-2">
                  <FaBoxOpen className="w-3 sm:w-4 h-3 sm:h-4" /> Products
                </h3>
                {selectedOrder.products?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex justify-between items-start py-2 sm:py-3 border-b border-white/10 last:border-0"
                  >
                    <div className="flex-1 min-w-0 mr-2">
                      <p className="text-xs sm:text-sm font-medium truncate">
                        {item.product?.title}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1 sm:gap-2">
                        <span className="bg-white/10 px-1.5 sm:px-2 py-0.5 rounded">
                          Qty: {item.quantity}
                        </span>
                        <span>×</span>
                        <span>₹{item.price}</span>
                      </p>
                    </div>
                    <p className="font-bold text-green-400 text-xs sm:text-sm whitespace-nowrap">
                      ₹{(item.quantity * item.price).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Payment Details */}
              <div className="bg-white/5 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-400 mb-2 sm:mb-3 flex items-center gap-2">
                  <MdPayment className="w-3 sm:w-4 h-3 sm:h-4" /> Payment Details
                </h3>
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center py-1.5 sm:py-2 border-b border-white/10">
                    <span className="text-gray-400 flex items-center gap-1.5 sm:gap-2">
                      <FaBoxOpen className="w-3 h-3" /> Products Total:
                    </span>
                    <span>₹{selectedOrder.productsTotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 sm:py-2 border-b border-white/10">
                    <span className="text-gray-400 flex items-center gap-1.5 sm:gap-2">
                      <FaTruck className="w-3 h-3" /> Delivery Charge:
                    </span>
                    <span>₹{selectedOrder.deliveryCharge?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 sm:py-2 border-b border-white/10">
                    <span className="text-gray-400 flex items-center gap-1.5 sm:gap-2">
                      <MdPayment className="w-3 h-3" /> Service Charge:
                    </span>
                    <span>₹{selectedOrder.serviceCharge?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 sm:pt-3 mt-1.5 sm:mt-2 border-t border-white/20">
                    <span className="font-semibold text-xs sm:text-sm">Total Amount:</span>
                    <span className="text-lg sm:text-xl font-bold text-green-400">
                      ₹{selectedOrder.totalAmount?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-400 flex items-center gap-1.5 sm:gap-2">
                      <MdPayment className="w-3 h-3" /> Payment Method:
                    </span>
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-medium ${
                        selectedOrder.paymentMethod === "cod"
                          ? "bg-orange-500/20 text-orange-300"
                          : "bg-purple-500/20 text-purple-300"
                      }`}
                    >
                      {selectedOrder.paymentMethod === "cod" ? "COD" : "Stripe"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white/5 rounded-xl p-3 sm:p-4">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-400 mb-2 sm:mb-3 flex items-center gap-2">
                  <FaHome className="w-3 sm:w-4 h-3 sm:h-4" /> Delivery Address
                </h3>
                <div className="space-y-1.5 sm:space-y-2">
                  <p className="font-medium flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <FaUser className="w-3 sm:w-4 h-3 sm:h-4 text-purple-400" />
                    {selectedOrder.address?.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-1.5 sm:gap-2">
                    <FaPhone className="w-3 sm:w-4 h-3 sm:h-4" />
                    {selectedOrder.address?.phone}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 flex items-start gap-1.5 sm:gap-2">
                    <FaMapMarkerAlt className="w-3 sm:w-4 h-3 sm:h-4 mt-0.5" />
                    {selectedOrder.address?.address},{" "}
                    {selectedOrder.address?.city} -{" "}
                    {selectedOrder.address?.pincode}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default UserOrders;
