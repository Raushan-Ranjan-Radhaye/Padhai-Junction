"use client";

import UseGetAllOrdersData from "@/hooks/UseGetAllOrdersData";
import UseGetCurrentUser from "@/hooks/UseGetCurrentUser";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTruck,
  FiPackage,
  FiCalendar,
  FiUser,
  FiCreditCard,
  FiActivity,
  FiHash,
  FiEye,
  FiMapPin,
  FiPhone,
  FiX,
  FiInfo,
  FiShoppingBag,
} from "react-icons/fi";
import axios from "axios";
import { setAllOrdersData } from "@/redux/userSlice";

function Orders() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [trackOrderModal, setTrackOrderModel] = useState<any | null>(null);

  UseGetAllOrdersData();
  UseGetCurrentUser();

  const { userData } = useSelector((state: RootState) => state.user);
  const { allOrdersData } = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (userData !== null && allOrdersData.length > 0) {
      setIsLoading(false);
    }
  }, [userData, allOrdersData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const getBuyerId = (buyer: string | { _id: string } | undefined): string => {
    if (!buyer) return "";
    if (typeof buyer === "string") return buyer;
    if (typeof buyer === "object" && buyer._id) return String(buyer._id);
    return "";
  };

  const orders = Array.isArray(allOrdersData)
    ? allOrdersData.filter((o) => getBuyerId(o.buyer) === String(userData?._id))
    : [];

  const formatDate = (date: string) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isCancelDisable = (order: any) => {
    return order.isPaid === true && order.paymentMethod === "strip";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-4xl text-white p-6">
        Loading...
      </div>
    );
  }

  const isEligibleReturn = (deliveryDate:string, replacementDays:number) => {
    if(!deliveryDate || !replacementDays) return false;
    const deliveredAt = new Date(deliveryDate).getTime();
    const expiry = deliveredAt + replacementDays * 24 * 60 * 60 * 1000;
    return Date.now() <= expiry
  }

  const remainingDays = (deliveryDate:string, replacementDays:number) => {
    if(!deliveryDate || !replacementDays) return 0;
    const deliveredAt = new Date(deliveryDate).getTime();
    const expiry = deliveredAt + replacementDays * 24 * 60 * 60 * 1000;
    const diff = expiry - Date.now();
    if(diff <= 0) return 0;
    return Math.ceil(diff / (24 * 60 * 60 * 1000))
  }

  const ReturnEndDate = (deliveryDate:string, replacementDays:number) => {
    if(!deliveryDate || !replacementDays) return "";
    const deliveredAt = new Date(deliveryDate).getTime();
    const expiry = deliveredAt + replacementDays * 24 * 60 * 60 * 1000;
    return new Date(expiry).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }



  // return order
  const returnOrder = async (orderId:string) => {
    try{
       const result = await axios.post("/api/order/return",{orderId})
      const updatedOrder = allOrdersData.map((o:any)=>{
        return o._id === orderId ? {...o,orderStatus:"returned", returnedAmount:result.data.returnedAmount} : o
      })
      dispatch(setAllOrdersData(updatedOrder))
      alert("Order Returned Successfully")
      setSelectedOrder(null)
    }catch(error:any){
       console.log(error)
       alert(error?.response?.data?.message || "Failed to return order")
    }
  }
  

  const status = ["pending", "confirmed", "shipped", "delivered"];

  // canceeled order

  const handleCancel = async (orderId:string) => {
    try{
      await axios.post("/api/order/cancelOrder",{orderId})
      const updatedOrder = allOrdersData.map((o:any)=>{
        return o._id === orderId ? {...o,orderStatus:"cancelled"} : o
      })
      dispatch(setAllOrdersData(updatedOrder))
      alert("Order Cancelled Successfully")
      setSelectedOrder(null)
    }catch(error:any){
       console.log(error)
       alert(error?.response?.data?.message || "Failed to cancel order")
    }
  }


  const renderTrackStep = (currentStatus: string) => {
    return (
      <div className="relative pl-6">
        <div className="absolute top-0 left-8 w-[1px] h-full bg-gray-600"></div>
        {status.map((s, i) => {
          const active = currentStatus === s;
          return (
            <div key={i} className="relative mb-6 items-start flex">
              <div
                className={`w-4 h-4 rounded-full ${active ? "bg-blue-500 shadow-[0_0_10px_#3b82f6]" : "bg-gray-500"}`}
              ></div>
              <div
                className={`ml-4 text-sm ${active ? "text-blue-400 font-bold" : "text-gray-400"}`}
              >
                {s.toUpperCase()}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4 md:p-8">
      {/* Header section - Max-width expanded for breathable feel */}
      <div className="max-w-full xl:max-w-[1800px] mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold flex items-center gap-4">
              <FiShoppingBag className="text-purple-500" /> My Orders
            </h2>
            <p className="text-base md:text-xl text-gray-400 mt-2">
              All orders placed by you
            </p>
          </div>
          <div className="text-xl md:text-2xl font-mono text-purple-400 bg-purple-500/10 px-8 py-4 rounded-2xl border border-purple-500/20 w-fit">
            {orders.length}{" "}
            <span className="text-gray-500 text-sm uppercase font-sans ml-2 tracking-widest">
              Orders
            </span>
          </div>
        </div>
      </div>

      {/* --- DESKTOP VIEW --- */}
      <div className="hidden xl:block max-w-[1800px] mx-auto bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="text-[16px] bg-white/10 border-b border-white/10 text-gray-200 uppercase tracking-widest font-bold">
              <tr>
                <th className="px-10 py-9">
                  <div className="flex items-center gap-3">
                    <FiHash className="text-purple-500 text-xl" /> Orders
                  </div>
                </th>
                <th className="px-10 py-9">
                  <div className="flex items-center gap-3">
                    <FiCalendar className="text-purple-500 text-xl" /> Date
                  </div>
                </th>
                <th className="px-10 py-9">
                  <div className="flex items-center gap-3">
                    <FiPackage className="text-purple-500 text-xl" /> Products
                  </div>
                </th>
                <th className="px-10 py-9">
                  <div className="flex items-center gap-3">
                    <FiUser className="text-purple-500 text-xl" /> Vendor
                  </div>
                </th>
                <th className="px-10 py-9">
                  <div className="flex items-center gap-3">
                    <FiCreditCard className="text-purple-500 text-xl" /> Payment
                  </div>
                </th>
                <th className="px-10 py-9">
                  <div className="flex items-center gap-3">
                    <FiActivity className="text-purple-500 text-xl" /> Status
                  </div>
                </th>
                <th className="px-10 py-9 text-right">Total</th>
                <th className="px-10 py-9 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[18px] text-gray-300 divide-y divide-white/5">
              {orders.length === 0 ? (
                <tr>
                  <td
                    className="px-10 py-20 text-center text-gray-500 text-2xl"
                    colSpan={8}
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <motion.tr
                    key={index}
                    className="hover:bg-white/[0.04] transition-all duration-300 group border-b border-transparent"
                    whileHover={{
                      y: -5,
                      boxShadow: "0px 10px 40px rgba(168, 85, 247, 0.2)",
                      borderColor: "rgba(168, 85, 247, 0.3)",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <td className="px-10 py-9 font-mono text-purple-400">
                      #{String(order._id).slice(-8)}
                    </td>
                    <td className="px-10 py-9">
                      {formatDate(String(order.createdAt))}
                    </td>
                    <td className="px-10 py-9">
                      {order.products.map((p: any, i: number) => (
                        <div
                          className="text-gray-200 mb-2 flex items-center gap-2"
                          key={i}
                        >
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          {p.product?.title || "Product"}{" "}
                          <span className="text-purple-400 font-bold ml-1 text-lg">
                            × {p.quantity}
                          </span>
                        </div>
                      ))}
                    </td>
                    <td className="px-10 py-9 font-medium">
                      {order.productVendor?.shopName}
                    </td>
                    <td className="px-10 py-9">
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <span
                            className={`px-3 py-1 rounded text-[12px] font-bold uppercase ${order.paymentMethod === "cod" ? "bg-yellow-600/20 text-yellow-500 border border-yellow-500/20" : "bg-green-600/20 text-green-500 border border-green-500/20"}`}
                          >
                            {order.paymentMethod === "cod" ? "COD" : "Stripe"}
                          </span>
                          <span
                            className={`px-3 py-1 rounded text-[12px] font-bold uppercase ${order.isPaid ? "bg-green-600/20 text-green-500 border border-green-500/20" : "bg-red-600/20 text-red-500 border border-red-500/20"}`}
                          >
                            {order.isPaid ? "Paid" : "Pending"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-9">
                      <span
                        className={`px-5 py-2 rounded-full text-[13px] font-black tracking-widest border ${
                          order.orderStatus === "delivered"
                            ? "border-green-500 text-green-400 bg-green-500/10"
                            : "border-purple-500 text-purple-400 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                        }`}
                      >
                        {order.orderStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-10 py-9 text-right font-black text-white text-3xl">
                      ₹{order.totalAmount}
                    </td>
                    <td className="px-10 py-9">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all hover:scale-110 border border-white/10"
                        >
                          <FiEye className="text-xl" />
                        </button>
                        <button
                          onClick={() => setTrackOrderModel(order)}
                  disabled={order.orderStatus === "delivered"}

                          className="p-4 bg-purple-600 rounded-2xl hover:bg-purple-700 shadow-xl shadow-purple-600/20 transition-all hover:scale-110"
                        >
                          <FiTruck className="text-xl text-white" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- TABLET & MOBILE VIEW --- */}
      <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.length !== 0 ? (
          orders.map((order, index) => (
            <motion.div
              key={index}
              className="bg-[#05070a] rounded-3xl border border-gray-800 p-6 flex flex-col justify-between"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                y: -10,
                boxShadow: "0px 0px 40px rgba(168, 85, 247, 0.6)",
                borderColor: "rgba(168, 85, 247, 0.5)",
              }}
              viewport={{ once: true }}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-purple-400 font-mono text-sm tracking-widest">
                    #{String(order._id).slice(-8)}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    {formatDate(String(order.createdAt))}
                  </div>
                </div>
                <span
                  className={`px-4 py-1 rounded-full text-[10px] font-black border ${order.orderStatus === "delivered" ? "border-green-500 text-green-400" : "border-purple-500 text-purple-400"}`}
                >
                  {order.orderStatus.toUpperCase()}
                </span>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-base font-medium">
                  <FiUser className="text-purple-500" />{" "}
                  {order.productVendor?.shopName}
                </div>
                <div className="text-3xl font-black text-white">
                  ₹{order.totalAmount}
                </div>
              </div>
              <div className="flex gap-3 mt-auto">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="flex-1 py-3 bg-white/5 rounded-xl text-sm font-bold border border-white/10"
                >
                  Details
                </button>
                <button
                  disabled={order.orderStatus === "delivered"}
                  onClick={() => setTrackOrderModel(order)}
                  className="flex-1 py-3 bg-purple-600 rounded-xl text-sm font-bold shadow-lg shadow-purple-600/20"
                >
                  {order.orderStatus === "delivered" ? "Delivered" : "Track Order"}
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-gray-500 text-2xl font-bold">
            No Orders Found
          </div>
        )}
      </div>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            key="selectedOrderModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0b0f1a] border border-white/10 rounded-[2.5rem] p-8 md:p-12 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                  {selectedOrder.orderStatus === "delivered" && selectedOrder.deliveryDate &&(
                  <div className='mt-3 text-sm text-green-400 '>Delivered on: {""}
                  {new Date(selectedOrder.deliveryDate).toLocaleDateString("en-IN")}
                  </div>
                )}
                <h2 className="text-2xl md:text-3xl font-black flex items-center gap-4">
                  <FiInfo className="text-purple-500" /> Order Summary
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-3 hover:bg-white/10 rounded-full transition-all"
                >
                  <FiX className="text-2xl" />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                <h3 className="text-lg text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                  <FiPackage /> Products
                </h3>
                {selectedOrder.products?.map((p: any, i: number) => {
                  const replacementDays = p.product?.replacementDays;
                  const eligible = isEligibleReturn(selectedOrder.deliveryDate, replacementDays);
                  const remaining = remainingDays(selectedOrder.deliveryDate, replacementDays);
                  const returnDate = ReturnEndDate(selectedOrder.deliveryDate, replacementDays);
                  
                  return (
                    <div
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white/5 rounded-3xl p-6 border border-white/5"
                      key={i}
                    >
                      <div className="flex-1">
                        <div className="font-bold text-white text-xl">
                          {p.product?.title}
                        </div>
                        <div className="text-base text-gray-500">
                          Qty: {p.quantity} × ₹{p.price}
                        </div>
                        {selectedOrder.orderStatus === "delivered" && replacementDays > 0 && (
                          <div className="mt-2">
                            {eligible ? (
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-yellow-400">
                                  Return available in {remaining} {remaining > 1 ? "days" : "day"}
                                </p>
                                <button
                                  onClick={() => returnOrder(selectedOrder._id)}
                                  className="mx-3 px-4 py-2 bg-yellow-500 rounded text-white text-sm"
                                >
                                  Return
                                </button>
                              </div>
                            ) : (
                              <p className="text-xs text-red-500">Return window Closed</p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="font-black text-purple-400 text-2xl mt-4 sm:mt-0">
                        ₹{p.quantity * p.price}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white/5 rounded-3xl p-6 border border-white/5 space-y-3 mb-8">
                <h3 className="text-lg text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
                  <FiCreditCard /> Invoice
                </h3>
                <div className="flex justify-between text-gray-400">
                  <span>Products Total</span>
                  <span>₹{selectedOrder.productsTotal}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Delivery Charges</span>
                  <span>₹{selectedOrder.deliveryCharge}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Service Charges</span>
                  <span>₹{selectedOrder.serviceCharge}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/10 text-2xl md:text-3xl font-black text-green-400">
                  <span>Grand Total</span>
                  <span>₹{selectedOrder.totalAmount}</span>
                </div>
              </div>

              {
                selectedOrder.paymentMethod === "stripe" && (
                  <div className="bg-yellow-500/10 rounded-3xl border border-yellow-500/20 text-yellow-300 p-6 mb-8">
                    <p className="font-bold mb-3 flex items-center gap-2 text-lg">
                      <FiInfo /> Important Note:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-sm text-yellow-100/80">
                      <li>
                        Online Payment (Razorpay) orders cannot be cancelled.
                      </li>
                      <li>You can return the product after delivery.</li>
                      <li>
                        Product amount is refundable; delivery/service charges
                        are not.
                      </li>
                    </ul>
                  </div>
                )}

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full py-5 bg-white/5 rounded-2xl font-black uppercase tracking-widest border border-white/10"
                >
                  Close
                </button>
               
                {selectedOrder.orderStatus !== "cancelled" && (
                <button
                  onClick={() => handleCancel(selectedOrder._id)}
                  disabled={selectedOrder.orderStatus === "delivered" || selectedOrder.orderStatus === "returned" || selectedOrder.paymentMethod === "stripe"}
                  className={`w-full py-5 rounded-xl text-sm font-bold shadow-lg
                  rounded-2xl font-black uppercase tracking-widest border
                    border-white/10 ${selectedOrder.orderStatus === "delivered" || selectedOrder.orderStatus === "returned" || selectedOrder.paymentMethod === "stripe" ? "bg-gray-600 cursor-not-allowed opacity-50" 
                    : "bg-purple-600 shadow-purple-600/20 hover:bg-purple-700"}`}
                    >
                  {selectedOrder.orderStatus === "delivered" || selectedOrder.orderStatus === "returned" || selectedOrder.paymentMethod === "stripe" ? "Cannot Cancel" : "Cancel Order"}
                </button>
                )}

                  
                  

              </div>
            </motion.div>
          </motion.div>
        )}

        {trackOrderModal && (
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
            <motion.div
              className="relative w-full max-w-lg bg-[#05070a] border border-purple-500/30 p-8 md:p-10 rounded-[3rem]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
                <FiTruck className="text-purple-500" /> Logistics
              </h2>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-base space-y-5 mb-8">
                <div className="flex gap-4">
                  <FiUser className="text-purple-500 mt-1" />{" "}
                  <div>
                    <span className="text-xs text-gray-500 uppercase block font-bold">
                      Buyer
                    </span>
                    {trackOrderModal?.address?.name}
                  </div>
                </div>
                <div className="flex gap-4">
                  <FiMapPin className="text-purple-500 mt-1" />{" "}
                  <div>
                    <span className="text-xs text-gray-500 uppercase block font-bold">
                      Address
                    </span>
                    {trackOrderModal?.address?.address},{" "}
                    {trackOrderModal?.address?.city} (
                    {trackOrderModal?.address?.pincode})
                  </div>
                </div>
                <div className="flex gap-4">
                  <FiPhone className="text-purple-500 mt-1" />{" "}
                  <div>
                    <span className="text-xs text-gray-500 uppercase block font-bold">
                      Mobile
                    </span>
                    {trackOrderModal?.address?.phone}
                  </div>
                </div>
              </div>
              {renderTrackStep(trackOrderModal.orderStatus)}
              <button
                onClick={() => setTrackOrderModel(null)}
                className="w-full mt-10 py-5 bg-purple-600 hover:bg-purple-500 rounded-2xl font-black uppercase tracking-widest transition-all shadow-2xl shadow-purple-600/40"
              >
                Close Tracker
              </button>
              
            </motion.div>
          </div>
        )}
        
      </AnimatePresence>
    </div>
  );
}

export default Orders;
