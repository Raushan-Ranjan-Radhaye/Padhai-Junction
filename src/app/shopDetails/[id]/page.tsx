"use client";
import React from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { RootState } from '@/redux/store';
import { IUser } from '@/model/user.model';
import { IProduct } from '@/model/product.model';
import ProductCard from '@/component/ProductCard';
// Imported Icons
import { FaStore, FaMapMarkerAlt, FaFileContract, FaCheckCircle, FaBoxOpen } from "react-icons/fa";

function ShopDetails() {
  const params = useParams()
  const vendorId = params.id as string;
  const { allVendorsData, allProductsData } = useSelector((state: RootState) => state.vendor)
  const vendor = allVendorsData.find((v: IUser) => String(v._id) === vendorId)
  
  if (!vendor) {
    return (
      <div className="min-h-screen text-3xl flex items-center justify-center text-white bg-[#030303]">
        Vendor not found
      </div>
    );
  }

  // Get the actual product objects for this vendor
  const vendorProducts = Array.isArray(allProductsData) 
    ? allProductsData.filter((product: IProduct) => 
        vendor?.vendorProducts?.some(vendorProductId => 
          vendorProductId.toString() === product._id?.toString()
        )
      ) 
    : [];

  // Animation variants for staggered details
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Icon animation on hover
  const iconHoverAnimation = {
    scale: [1, 1.2, 1],
    transition: { duration: 0.5 }
  };

  return (
      <div className="relative min-h-screen w-full bg-[#030303] text-white px-4 py-6 overflow-hidden">
        
        {/* BACKGROUND PARTICLES */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 10 }, (_, i) => {
            const baseSeed = i * 0.5;
            const width = (80 + Math.sin(baseSeed) * 100 + 100).toFixed(2);
            const height = (80 + Math.cos(baseSeed * 1.5) * 100 + 100).toFixed(2);
            const top = (Math.sin(baseSeed * 2) * 40 + 50).toFixed(2);
            const left = (Math.cos(baseSeed * 3) * 40 + 50).toFixed(2);
            const duration = (6 + Math.sin(baseSeed * 4) * 4 + 4).toFixed(2);

            return (
              <motion.div
                key={i}
                className="absolute rounded-full bg-purple-500/5 blur-2xl"
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  top: `${top}%`,
                  left: `${left}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.05, 0.15, 0.05],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: Number(duration),
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>

        {/* VENDOR DETAILS CARD */}
        <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 70 }}
        // ✅ APPLIED: Shadow, y-offset, and border color on hover
        whileHover={{ 
            y: -10,
            scale: 1.01,
            boxShadow: "0px 0px 40px rgba(168, 85, 247, 0.4)",
            borderColor: "rgba(168, 85, 247, 0.5)"
        }}
        className='relative z-10 max-w-6xl mx-auto mb-12 bg-[#0a0a0a] backdrop-blur-xl 
        p-6 rounded-2xl border border-gray-800 grid md:grid-cols-2 gap-6 
        transition-colors duration-300'
        >
          {/* ✅ REMOVED: Ring motion div */}

          <div className="relative w-full h-72
            overflow-hidden rounded-xl bg-gray-900 border border-gray-800">
            {vendor.image ? (
              <Image src={vendor.image} alt={vendor.shopName || vendor.name} fill className="object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
                <FaStore size={40} />
                No Image Found
              </div>
            )}
          </div>

          {/* Animated Details */}
          <motion.div 
            className="flex flex-col justify-center gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
                variants={itemVariants} 
                className='text-4xl font-black mb-1 flex items-center gap-3 text-white'
                whileHover={{ x: 10 }}
            >
                <motion.div whileHover={iconHoverAnimation}>
                    <FaStore className="text-purple-400" />
                </motion.div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    {vendor.shopName}
                </span>
            </motion.div>

            <motion.div 
                variants={itemVariants} 
                className='text-gray-300 flex items-start gap-3 text-lg'
                whileHover={{ x: 10 }}
            >
                <motion.div whileHover={iconHoverAnimation}>
                    <FaMapMarkerAlt className="text-gray-500 mt-1 flex-shrink-0" />
                </motion.div>
                {vendor.shopAddress}
            </motion.div>
            
            <motion.div 
                variants={itemVariants} 
                className='text-sm text-gray-400 flex items-center gap-3'
                whileHover={{ x: 10 }}
            >
                <motion.div whileHover={iconHoverAnimation}>
                    <FaFileContract className="text-gray-500" />
                </motion.div>
                GSTIN: <span className="text-white font-mono">{vendor.gstNumber}</span>
            </motion.div>
            
            <motion.span 
                variants={itemVariants} 
                className='text-xs w-fit mt-3 px-4 py-1.5 rounded-full font-semibold bg-blue-950 text-blue-300 border border-blue-800 flex items-center gap-2'
                whileHover={{ scale: 1.05 }}
            >
                <motion.div whileHover={iconHoverAnimation}>
                    <FaCheckCircle className="text-blue-400" />
                </motion.div>
                {vendor.verificationStatus}
            </motion.span>
          </motion.div>
        </motion.div>

        {/* PRODUCTS SECTION */}
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-8"
          >
            <FaBoxOpen className="text-purple-400 text-3xl" />
            <h2 className='text-3xl font-bold'>Products By: <span className="text-purple-300">{vendor.shopName}</span></h2>
          </motion.div>

          {/* SCANNING LINE */}
          <div className="relative h-[1px] w-full bg-gray-800 mb-10 overflow-hidden">
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 via-purple-500 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            />
          </div>
          
          {vendorProducts.length === 0 ? (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='text-gray-500 text-center text-lg mt-10'
            >
              No products found for this vendor.
            </motion.p>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-5"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={containerVariants}
            >
              {vendorProducts.map((p: IProduct, i: number) => (
                <motion.div key={i} variants={itemVariants}>
                    <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>
          )}
          
        </div>
    </div>
  )
}

export default ShopDetails;