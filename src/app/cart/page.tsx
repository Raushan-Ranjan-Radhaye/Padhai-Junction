"use client";
import { useRouter } from 'next/navigation'
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaTrashAlt, 
  FaPlus, 
  FaMinus, 
  FaShoppingCart, 
  FaCreditCard, 
  FaRupeeSign, 
  FaBoxOpen 
} from "react-icons/fa"; // Imported React Icons
import { MdOutlineLocalOffer } from "react-icons/md";

function page() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const getCart = async () => {
      try {
        const result = await axios.get("/api/user/cart/get");
        setCart(result.data.cart || []);
      } catch (error) {
        console.log(error);
        alert("Failed to get cart");
      }
    };
    getCart();
  }, []);

  const handleUpdateCart = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      await axios.post("/api/user/cart/update", { productId, quantity });
      const result = await axios.get("/api/user/cart/get");
      setCart(result.data.cart || []);
    } catch (error) {
      console.log(error);
      alert("Failed to update cart");
    }
  }

  const handleRemoveFromCart = async (productId: string) => {
    try {
      await axios.post("/api/user/cart/remove", { productId });
      const result = await axios.get("/api/user/cart/get");
      setCart(result.data.cart || []);
    } catch (error) {
      console.log(error);
      alert("Failed to remove from cart");
    }
  }

  if (cart === null || cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#05070a] text-white p-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-4 text-purple-500 opacity-20">
          <FaShoppingCart size={100} />
        </motion.div>
        <h1 className="text-4xl font-bold mb-4">Cart Empty</h1>
        <button 
          onClick={() => router.push('/')} 
          className="bg-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-purple-500 transition-all"
        >
          Explore Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-white py-12 px-4 md:px-8 lg:px-20">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-10 border-b border-gray-800 pb-6">
          <FaShoppingCart className="text-purple-500 text-3xl" />
          <h1 className="text-3xl font-bold tracking-tight">Your Shopping Cart</h1>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence>
            {cart.map((item, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0px 0px 30px rgba(168, 85, 247, 0.3)",
                  borderColor: "rgba(168, 85, 247, 0.4)"
                }}
                className="bg-gray-900/50 backdrop-blur-md border border-gray-800 p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-center transition-all duration-300"
              >
                {/* Product Image */}
                <div className="relative w-32 h-32 bg-black rounded-xl overflow-hidden border border-white/10 shrink-0">
                  <Image src={item.product.image1} alt={item.product.title} fill className="object-contain p-2" />
                </div>

                {/* Content Section */}
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <FaBoxOpen className="text-purple-400" />
                      <h3 className="text-xl font-bold truncate max-w-[200px] md:max-w-md">{item.product.title}</h3>
                    </div>
                    <div className="flex items-center text-2xl font-black text-purple-400">
                      <FaRupeeSign size={20} />
                      {item.product.price * item.quantity}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-green-500 text-sm mb-4">
                    <MdOutlineLocalOffer />
                    <span>Unit Price:</span>
                    <FaRupeeSign size={12} className="ml-1" />
                    <span>{item.product.price}</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4">
                    {/* Quantity Selector Logic */}
                    <div className="flex items-center gap-4 bg-black/40 px-4 py-2 rounded-full border border-gray-700">
                      <button 
                        onClick={() => handleUpdateCart(item.product._id, item.quantity - 1)} 
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <FaMinus size={14} />
                      </button>
                      <span className="font-bold min-w-[20px] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateCart(item.product._id, item.quantity + 1)} 
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <FaPlus size={14} />
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push(`/checkout/${item.product._id}`)} 
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 transition-all"
                      >
                        <FaCreditCard />
                        Checkout
                      </motion.button>
                      
                      <button 
                        onClick={() => handleRemoveFromCart(item.product._id)} 
                        className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors p-2"
                      >
                        <FaTrashAlt size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default page;