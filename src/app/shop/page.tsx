"use client";

import { IUser } from "@/model/user.model"
import { useSelector } from "react-redux"
import Image from "next/image"
import { motion } from "motion/react" 
import { RootState } from "@/redux/store"
import { useRouter } from "next/navigation"
// Added icon library
import { FaShopify, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";

function ShopPage() {
  const router = useRouter()
  const { allVendorsData } = useSelector((state: RootState) => state.vendor)
  const allVerifiedVendor = Array.isArray(allVendorsData)
    ? allVendorsData.filter((v: IUser) => v.verificationStatus === "approved")
    : [];

  if (allVerifiedVendor.length === 0) {
    return (
      <div className="min-h-[30vh] flex items-center justify-center text-white bg-[#030303]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">No Shops Found</h2>
          <p className="text-gray-300">No verified shops are available at this time.</p>
        </div>
      </div>
    );
  }

  // Animation variants for text elements to enter smoothly
  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const textItemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="relative min-h-screen w-full bg-[#030303] overflow-hidden">
      {/* BACKGROUND PARTICLES */}
      <motion.div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }, (_, i) => {
          const baseSeed = i * 0.618;
          const width = (100 + (Math.sin(baseSeed) * 150 + 150)).toFixed(2);
          const height = (100 + (Math.cos(baseSeed * 1.618) * 150 + 150)).toFixed(2);
          const top = (Math.sin(baseSeed * 2.618) * 50 + 50).toFixed(2);
          const left = (Math.cos(baseSeed * 3.618) * 50 + 50).toFixed(2);
          const duration = (5 + (Math.sin(baseSeed * 4.618) * 5 + 5)).toFixed(2);

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

      {/* HEADER SECTION */}
      <div className="relative z-10 max-w-7xl mx-auto pt-12 pb-12 text-center px-4">


          <motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ type: "spring", stiffness: 100, damping: 20 }}
>
  <h1
    className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight text-white tracking-tighter"
  >
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
      Trusted
    </span> Shops & 
    {/* Removed 'block' class here to keep it on one line */}
    <span className="text-cyan-400 [text-shadow:0_0_15px_rgba(34,211,238,0.5)]">
      Verified Sellers
    </span>
  </h1>
</motion.div>



        {/* SCANNING LINE */}
        <div className="relative h-[1px] w-full max-w-3xl mx-auto bg-gray-800">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 via-purple-500 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* VENDOR GRID */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 mb-10">
          {allVerifiedVendor.map((v: IUser, i: number) => (
            <motion.div
              className="relative bg-[#0a0a0a] rounded-2xl overflow-hidden border border-gray-800/50 
              transition-all duration-700 cursor-pointer group hover:border-purple-500/50"
              key={v._id?.toString() || i}
              onClick={() => router.push(`/shopDetails/${v._id}`)}
              
              // ANIMATION LOGIC
              initial={{ opacity: 0, y: 100, rotateX: 20 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              whileHover={{
                y: -20,
                boxShadow: "0px 30px 60px -12px rgba(168, 85, 247, 0.4)",
              }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 80,
                delay: i * 0.08,
              }}
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-900">
                {v.image ? (
                  <Image
                    src={v.image}
                    alt={v.shopName || v.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <FaShopify size={40} />
                  </div>
                )}
              </div>

              {/* Text Content with Staggered Animation */}
              <motion.div 
                className="p-4 flex flex-col items-center bg-[#0a0a0a]"
                variants={textContainerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h2 
                    variants={textItemVariants}
                    className="font-semibold text-center text-lg text-white group-hover:text-purple-300 transition-colors flex items-center gap-2"
                >
                    <FaShopify className="text-purple-400" />
                    {v.shopName}
                </motion.h2>
                
                <motion.p 
                    variants={textItemVariants}
                    className="text-xs text-gray-400 text-center mt-1 line-clamp-2 flex items-center gap-1.5"
                >
                    <FaMapMarkerAlt className="text-gray-500" />
                    {v.shopAddress}
                </motion.p>
                
                <motion.div 
                    variants={textItemVariants}
                    className="flex justify-center mt-3"
                >
                  <span className="text-[10px] px-3 py-1 rounded-full font-medium bg-blue-950 text-blue-300 border border-blue-800 flex items-center gap-1.5">
                    <FaCheckCircle className="text-blue-400" />
                    {v.verificationStatus}
                  </span>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ShopPage;