"use client";
import slide1 from "@/assets/1.webp";
import slide2 from "@/assets/5.jpg";
import slide3 from "@/assets/3.webp";
import slide4 from "@/assets/connect2.jpg";
import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

function Slider() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const slides = [
    {
      images: slide1,
      title: "Run ON AIR",
      subtitle: "DO IT NOW",
      description: "Running Shoes",
      button: "Discover Now",
    },
    {
      images: slide2,
      title: "NEW ARRIVALS",
      subtitle: "CHECK IT OUT",
      description: "Sneakers and more",
      button: "Shop Now",
    },
    {
      images: slide3,
      title: "SUMMER VIBES",
      subtitle: "GET READY",
      description: "Summer Collection",
      button: "Explore Now",
    },
    {
      images: slide4,
      title: "AUTUMN WARDROBE",
      subtitle: "STAY WARM",
      description: "Winter Collection",
      button: "Shop Now",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className=""></div>
    // <div className="relative  w-full min-h-[90vh] mt-0 overflow-hidden bg-black text-white md:mt-[60px] pt-0 top-0 rounded-2xl">
    //   <AnimatePresence>
    //     <motion.div
    //       key={current}
    //       initial={{ opacity: 0, scale: 1.05 }}
    //       animate={{ opacity: 1, scale: 1 }}
    //       exit={{ opacity: 0, scale: 1.05 }}
    //       transition={{ duration: 0.8 }}
    //       className="absolute inset-0 flex justify-center"
    //     >
    //       {/* array me se image ko la rahi ahi */}

    //       <Image
    //         src={slides[current].images}
    //         alt={slides[current].title}
    //         className=" object-cover opacity-70 w-full h-full"
    //       />

    //       {/* mobile view */}

    //       <div className="absolute inset-0 flex flex-col items-start justify-center px-10 md:px-24 bg-gradient-to-r from-black/70 to-transparent">
    //         <motion.h3
    //           initial={{ opacity: 0, y: 20 }}
    //           animate={{ y: 0, opacity: 1 }}
    //           transition={{ delay: 0.2 }}
    //           className="text-sm md:text-base uppercase tracking-widest text-gray-300"
    //         >
    //           {slides[current].subtitle}
    //         </motion.h3>

    //         <motion.h1
    //           initial={{ opacity: 0, y: 40 }}
    //           animate={{ y: 0, opacity: 1 }}
    //           transition={{ delay: 0.4 }}
    //           className="text-4xl md:text-6xl font-bold mb-4"
    //         >
    //           {slides[current].title}
    //         </motion.h1>

    //         <motion.p
    //           initial={{ opacity: 0, y: 40 }}
    //           animate={{ y: 0, opacity: 1 }}
    //           transition={{ delay: 0.6 }}
    //           className="text-lg md:text-xl text-gray-300 mb-6"
    //         >
    //           {slides[current].description}
    //         </motion.p>

    //         <motion.button
    //           onClick={() => router.push("/category")}
    //           className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-lg transition"
    //           whileTap={{ scale: 0.95 }}
    //           whileHover={{ scale: 1.05 }}
    //         >
    //           {slides[current].button}
    //         </motion.button>
    //       </div>
    //     </motion.div>
    //   </AnimatePresence>

    //   <div
    //     className="absolute 
    // /* Positioning: Right side on desktop, Bottom/Center on mobile if needed */
    // bottom-6 right-6 
    // /* Layout: Vertical (col) on mobile/tablet, Horizontal (row) on desktop */
    // flex flex-col md:flex-row 
    // /* Gap & Alignment */
    // gap-3 md:gap-4 
    // items-end md:items-center"
    //   >
    //     {slides.map((slide, index) => (
    //       <motion.div
    //         key={index}
    //         whileHover={{ scale: 1.05 }}
    //         whileTap={{ scale: 0.95 }}
    //         onClick={() => setCurrent(index)}
    //         className={`relative 
    //       /* Responsive sizing: slightly smaller on mobile to save space */
    //       w-30 h-18 
    //       cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 
    //       ${
    //         index === current
    //           ? "border-gray-100 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
    //           : "border-gray-500 hover:border-blue-400"
    //       }`}
    //       >
    //         <Image
    //           src={slide.images}
    //           alt={slide.title}
    //           fill
    //           className="object-cover opacity-90"
    //         />
    //       </motion.div>
    //     ))}
    //   </div>
    // </div>
  );
}

export default Slider;
