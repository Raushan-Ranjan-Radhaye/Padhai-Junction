"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUser, FaPhoneAlt, FaMapMarkerAlt, FaCity, FaMapPin, FaRupeeSign, FaShieldAlt, FaTruck, FaFileInvoiceDollar } from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import { SiRazorpay } from "react-icons/si";
import { FaMoneyBillWave } from "react-icons/fa";
import { FaUserGraduate } from "react-icons/fa6";
interface CartItem {
  product: {
    _id: string;
    title: string;
    price: number;
    image1: string;
    payOnDelivery: boolean;
  };
  quantity: number;
}

export default function Checkout() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [item, setItem] = useState<CartItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe">("cod");

  const [name, setName] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      if ((window as unknown as { Razorpay?: unknown }).Razorpay) {
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    };
    loadRazorpayScript();
  }, []);

  useEffect(() => {
    if (!productId) return;

    const loadItem = async () => {
      try {
        const result = await axios.get("/api/user/cart/get");
        const foundItem = result.data.cart
          .filter((i: CartItem) => i.product !== null)
          .find((i: CartItem) => i.product._id === productId);

        if (!foundItem) {
          router.replace("/cart");
          return;
        }

        setItem(foundItem);

        if (!foundItem.product.payOnDelivery) {
          setPaymentMethod("stripe");
        }
      } catch (error) {
        console.log(error);
        alert("Failed to get cart");
      }
    };

    loadItem();
  }, [productId, router]);

  if (!item) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const producTotal = item.product.price * item.quantity;
  const deliveryCharge = item.product.payOnDelivery ? 0 : 50;
  const serviceCharge = 30;
  const finalTotal = producTotal + deliveryCharge + serviceCharge;
  const codDisabled = !item.product.payOnDelivery;

  const handlePlaceOrder = async () => {
    // Validate all fields
    if(!name || !phone || !address || !city || !pincode){
      alert("Please fill in all address fields");
      return;
    }

    // Validate phone number
    if(phone.length < 10){
      alert("Please enter a valid phone number");
      return;
    }

    // Validate pincode
    if(pincode.length < 4){
      alert("Please enter a valid pincode");
      return;
    }

    const payload = {
      productId,
      quantity: item.quantity,
      address: {name, phone, address, city, pincode},
      amount: finalTotal,
      deliveryCharge,
      serviceCharge,
    }
    setLoading(true);

    try{
      if(paymentMethod === "cod"){
        const result = await axios.post("/api/order/cod", payload);
        
        if(result.status === 200){
          alert("Order placed successfully!");
          router.push("/orders");
        }
      } else if (paymentMethod === "stripe") {
        // Razorpay payment
        const result = await axios.post("/api/order/online-pay", payload);
        const { razorpayOrderId, razorpayKey, order } = result.data;

        // Get user email for prefill
        let userEmail = "";
        try {
          const userRes = await axios.get("/api/user/currentUser");
          userEmail = userRes.data.user?.email || "";
        } catch (e) {
          console.log("Could not get user email");
        }

        // Open Razorpay checkout
        const options = {
          key: razorpayKey,
          amount: finalTotal * 100, // Amount in paise
          currency: "INR",
          name: "Padahi Junction",
          description: "Order Payment",
          order_id: razorpayOrderId,
          handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
            // Payment successful - remove from cart and redirect to orders
            try {
              await axios.post("/api/user/cart/remove", { productId });
              alert("Payment successful! Order placed.");
              router.push("/orders");
            } catch (error) {
              console.error("Error removing from cart:", error);
              alert("Payment successful! Order placed. (Cart update failed)");
              router.push("/orders");
            }
          },
          prefill: {
            name: name,
            phone: phone,
            email: userEmail,
          },
          theme: {
            color: "#8B5CF6",
          },
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
        
        // Reset loading state after opening modal
        setLoading(false);
      }
    }catch(error: any){
      console.error("Order error:", error);
      const errorMessage = error.response?.data?.message || "Failed to place order. Please try again.";
      alert(errorMessage);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-black to-[#020617] flex items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-5xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl p-6 md:p-10 grid md:grid-cols-2 gap-10 overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ 
            boxShadow: "0px 0px 50px rgba(168, 85, 247, 0.2)",
            borderColor: "rgba(168, 85, 247, 0.3)"
        }}
        transition={{ type: "spring", damping: 20 }}
      >
        {/* Left Side: Address Form */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <FaUserGraduate className="text-purple-500 text-2xl" />
            <h2 className="text-2xl font-bold text-white tracking-tight">Student Details </h2>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Full Name"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>

            <div className="relative group">
              <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
              <input
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                type="text"
                placeholder="Phone Number"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>

            <div className="relative group">
              <FaMapMarkerAlt className="absolute left-4 top-4 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
              <textarea
                onChange={(e) => setAddress(e.target.value)}
                value={address}
                rows={3}
                placeholder="Complete Address"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <FaCity className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                <input
                  onChange={(e) => setCity(e.target.value)}
                  value={city}
                  type="text"
                  placeholder="City"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
              </div>
              <div className="relative group">
                <FaMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                <input
                  onChange={(e) => setPincode(e.target.value)}
                  value={pincode}
                  type="text"
                  placeholder="Pincode"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <FaFileInvoiceDollar className="text-purple-500 text-2xl" />
            <h2 className="text-2xl font-bold text-white tracking-tight">Purchase Summary</h2>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 bg-white rounded-lg p-1 overflow-hidden shrink-0">
                <Image src={item.product.image1} alt="product" fill className="object-contain" />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold leading-tight">{item.product.title}</p>
                <p className="text-gray-400 text-sm mt-1">Quantity: {item.quantity}</p>
                <div className="flex items-center text-purple-400 font-black text-lg">
                  <FaRupeeSign size={14} />
                  <span>{producTotal}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-3">
              <div className="flex justify-between text-gray-400 text-sm">
                <span>Platform Fee</span>
                <div className="flex items-center text-white">
                  <FaRupeeSign size={12} />
                  <span>{deliveryCharge}</span>
                </div>
              </div>
              <div className="flex justify-between text-gray-400 text-sm">
                <span>Service Fee</span>
                <div className="flex items-center text-white">
                  <FaRupeeSign size={12} />
                  <span>{serviceCharge}</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-white font-bold">Total Amount</span>
                <div className="flex items-center text-2xl font-black text-green-400">
                  <FaRupeeSign size={20} />
                  <span>{finalTotal}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Logic */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-bold">
              <MdOutlinePayments className="text-purple-500 text-xl" />
              <p>Payment Method</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {/* <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setPaymentMethod("cod")} 
                disabled={codDisabled} 
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  paymentMethod === "cod" ? "border-purple-500 bg-purple-500/20" : "border-white/5 bg-white/5"
                } ${codDisabled ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
              >
                <FaMoneyBillWave className="text-2xl text-green-600 hover:text-green-800 transition-colors duration-300" />
                <span className="text-lg text-white font-semibold tracking-wide">
                 Cash On Delivery
                </span>
              </motion.button> */}

              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setPaymentMethod("stripe")}
                className={`flex flex-col items-center justify-center p-3 w-full rounded-xl border-2 transition-all ${
                  paymentMethod === "stripe" ? "border-purple-500 bg-purple-500/20" : "border-white/5 bg-white/5"
                }`}
              >
                <SiRazorpay className="text-2xl text-yellow-600 hover:text-yellow-800 transition-colors duration-300" />
                <span className="text-lg text-white font-semibold tracking-wide">

                 Pay Online
                </span>
              </motion.button>
            </div>
          </div>

          {/* Final Action Button */}
          <motion.button
          onClick={handlePlaceOrder}
          disabled={loading}
            whileHover={{ scale: 1.02, boxShadow: "0px 10px 30px rgba(59, 130, 246, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-4 rounded-2xl font-black text-lg text-white shadow-xl flex items-center justify-center gap-3 transition-all"
          >
            <FaShieldAlt className="text-white/50" />
            {loading? <ClipLoader color="white" size={20} /> : paymentMethod === "cod" ? "Place Order" : "Secure Payment"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
