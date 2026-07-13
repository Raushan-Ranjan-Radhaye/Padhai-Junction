"use client";
import { FaRegStar, FaRocket, FaUserCircle } from "react-icons/fa";
import { IProduct } from "../model/product.model";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { SiSubtitleedit } from "react-icons/si";

import {
  HiShoppingCart,
  HiBolt,
} from "react-icons/hi2";


import {
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaCreditCard,
  FaShoppingCart,
  FaTag,
  FaStore,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { useRouter } from "next/navigation";
import axios from "axios";


function ProductCard({ product }: { product: IProduct }) {
  const [current, setCurrent] = useState(0);

  const images = [
    product.image1,
    product.image2,
    product.image3,
    product.image4,
  ].filter((img): img is string => Boolean(img) && typeof img === "string");

  const next = () => {
    if (images.length === 0) return;
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    if (images.length === 0) return;
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const router = useRouter();

  const totalReviews = product?.reviews?.length ?? 0;
  const avgRating =
    product && totalReviews > 0
      ? (
          product.reviews!.reduce(
            (sum: number, r: { rating: number }) => sum + r.rating,
            0,
          ) / totalReviews
        ).toFixed(1)
      : 0;



      // added to cart ka hai
      
     const handleAddtoCart = async (e:React.MouseEvent) => {
        e.stopPropagation();
      try{
        const result = await axios.post("/api/user/cart/add",{
          productId: product._id,
          quantity: 1
        })
        console.log(result.data)
        alert("Added to cart")
        router.push("/cart")

      }catch(error){
        console.log(error)
        alert("Failed to add to Tutor")
      }

     }


  return (
    <div className="">
      <motion.div
        onClick={() => router.push(`/viewProduct/${product._id}`)}
        className="relative bg-[#05070a] rounded-lg overflow-hidden border border-gray-800 transition-all duration-500 cursor-pointer group"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{
          y: -10,
          boxShadow: "0px 0px 40px rgba(168, 85, 247, 0.6)",
          borderColor: "rgba(168, 85, 247, 0.5)",
        }}
        transition={{ type: "spring", damping: 18, stiffness: 70 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* 1. ANIMATED BORDER RING */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,#a855f7_360deg)] animate-[spin_4s_linear_infinite]" />
        </div>

        {/* 2. INNER MESH GLOW */}
        <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
          <motion.div
            animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-20 -left-20 w-64 h-64 bg-purple-900/40 blur-[80px]"
          />
        </div>

        {/* CONTENT WRAPPER */}
        <div className="relative mt-20z-10 m-[1px] bg-[#0a0c14] rounded-lg overflow-hidden h-full flex flex-col">
          {/* IMAGE SECTION */}
          <div className="relative w-full h-[200px] overflow-hidden bg-black/50 flex items-center justify-center">
            <div className="relative w-[90%] h-[90%]">
              <AnimatePresence mode="wait">
                {images.length > 0 && (
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full relative"
                  >
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-full h-full relative"
                    >
                      <Image
                        src={images[current]}
                        alt={product.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 300px"
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* NAV BUTTONS */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/80 text-white rounded-full p-2 z-20 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 hover:bg-purple-600 transition-all border border-white/10"
                >
                  <FaChevronLeft size={12} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/80 text-white rounded-full p-2 z-20 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 hover:bg-purple-600 transition-all border border-white/10"
                >
                  <FaChevronRight size={12} />
                </button>
              </>
            )}

            {/* DOTS */}
            <div className="absolute bottom-2 flex gap-1.5">
              {images.map((_, i) => (
                <motion.span
                  key={i}
                  animate={{ width: current === i ? 18 : 6 }}
                  className={`h-1 rounded-full transition-colors ${
                    current === i ? "bg-purple-500" : "bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* PRODUCT DATA */}
          <div className="p-4 space-y-2 flex-grow bg-gradient-to-b from-transparent to-purple-950/20">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[21px] text-gray-100 line-clamp-1 group-hover:text-purple-400 transition-colors">
                <SiSubtitleedit
                  className="inline mr-2 text-purple-400"
                  size={18}
                />
                {product.title || "Unknown title"}
              </h3>

              <div className="flex items-center gap-1">
                <MdVerified className="text-cyan-400" size={15} />
                <span className="text-[10px] text-gray-400 font-bold uppercase">
                  Verified
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FaTag className="text-purple-500" />
              <span className="font-medium">{product.category}</span>
            </div>

            <div className="flex items-center gap-2">
              <FaCreditCard className="text-green-500" />
              <p className="font-black text-xl text-green-400">
                ₹{product.price}
              </p>
            </div>

            <div className="flex items-center gap-2 text-yellow-500">
              {[1, 2, 3, 4, 5].map((i) =>
                i <= Math.round(Number(avgRating)) ? (
                  <FaStar key={i} />
                ) : (
                  <FaRegStar key={i} />
                ),
              )}
              <span className="text-yellow-600 text-bold text-[15px] uppercase">
                ({avgRating}/{totalReviews})
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400 border-t border-white/5 pt-2">
              <FaStore className="text-blue-500" />
              <span className="text-xs text-gray-300 truncate">
                {product.vendor?.shopName || "Unknown Vendor"}
              </span>
            </div>

            <motion.button
              className="w-full mt-3 flex items-center justify-center rounded-lg gap-2 bg-gradient-to-r from-purple-600 via-purple-700 to-blue-700 text-white font-bold py-3 overflow-hidden relative group/btn shadow-[0_0_15px_rgba(124,58,237,0.3)]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddtoCart}
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
              <HiBolt size={14} />
              <span className="text-xs uppercase tracking-widest">
                Add Tutor
              </span>
            </motion.button>
          </div>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </motion.div>
    </div>
  );
}

export default ProductCard;
