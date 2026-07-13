"use client";

import { useSelector } from "react-redux";
import ProductCard from "../ProductCard";
import { IProduct } from "@/model/product.model";
import { motion } from "motion/react";

interface IVendorState {
  allProductsData: IProduct[];
}

function ProductCardPage() {
  const { allProductsData } = useSelector(
    (state: { vendor: IVendorState }) => state.vendor
  );

  const products = Array.isArray(allProductsData)
    ? allProductsData.filter(
        (p: IProduct) =>
          p.isActive === true && p.veificationStatus === "approved"
      )
    : [];
    if(!products || products.length === 0) {
      return(
        <div className="min-h-[30vh] flex items-center justify-center text-white bg-black" >
          No Product Found
        </div>
      )
    }

  return (
    <div className="relative min-h-screen w-full bg-[#030303] overflow-hidden  ">
      {/* BACKGROUND PARTICLES (Hydration Safe) */}
      <motion.div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }, (_, i) => {
          const baseSeed = i * 0.618;

          // 🔒 Rounded to avoid SSR mismatch
          const width = (100 + (Math.sin(baseSeed) * 150 + 150)).toFixed(2);
          const height = (
            100 + (Math.cos(baseSeed * 1.618) * 150 + 150)
          ).toFixed(2);
          const top = (Math.sin(baseSeed * 2.618) * 50 + 50).toFixed(2);
          const left = (Math.cos(baseSeed * 3.618) * 50 + 50).toFixed(2);
          const duration = (
            5 + (Math.sin(baseSeed * 4.618) * 5 + 5)
          ).toFixed(2);

          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-purple-500/10 blur-xl"
              style={{
                width: `${width}px`,
                height: `${height}px`,
                top: `${top}%`,
                left: `${left}%`,
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: Number(duration),
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </motion.div>

      {/* HEADER */}
      <div className="relative z-10 max-w-7xl mx-auto  pt-12 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 100 }}
        >
          <motion.h1
            className="text-4xl sm:text-6xl font-black mb-6 leading-tight bg-clip-text 
            text-transparent mt-5 bg-gradient-to-r from-purple-400 via-pink-500 via-cyan-400 
            to-purple-400 bg-[length:200%_auto] px-4"
            animate={{
              backgroundPosition: ["0% center", "200% center"],
            }}
            transition={{
              backgroundPosition: {
                repeat: Infinity,
                duration: 5,
                ease: "linear",
              },
            }}
          >
            Explore Verified & Experience Teachers
          </motion.h1>
        </motion.div>

        <motion.p
          className="text-lg sm:text-xl text-gray-400 mb-10 font-medium tracking-[0.2em] uppercase px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          {/* Shop only from <span className="text-purple-500">approved sellers</span> */}
        </motion.p>

        {/* SCANNING LINE */}
        <div className="relative h-[1px] w-full max-w-3xl mx-auto bg-gray-800">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 via-purple-500 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* PRODUCTS */}
      <motion.div className="relative z-10 max-w-7xl mx-auto">
        {products.length === 0 ? (
          <div className="text-center mt-20">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-block p-[1px] rounded-2xl bg-gradient-to-r from-purple-500/50 to-cyan-500/50"
            >
              <div className="bg-black/90 backdrop-blur-xl rounded-2xl p-12">
                <h3 className="text-white text-2xl font-bold mb-2">
                  The Galaxy is Empty
                </h3>
                <p className="text-gray-500">
                  New products are arriving soon.
                </p>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-7 gap-8">
            {products.map((p, index) => (
              <motion.div
                key={p._id?.toString() || `product-${index}`}
                className="group relative bg-[#0a0a0a] rounded-2xl overflow-hidden border border-gray-800/50 transition-all duration-700 hover:border-purple-500/50"
                initial={{ opacity: 0, y: 100, rotateX: 20 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                whileHover={{
                  y: -20,
                  boxShadow:
                    "0px 30px 60px -12px rgba(168, 85, 247, 0.6)",
                }}
                transition={{
                  type: "spring",
                  damping: 20,
                  stiffness: 80,
                  delay: index * 0.08,
                }}
                viewport={{ once: true, amount: 0.1 }}
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default ProductCardPage;
