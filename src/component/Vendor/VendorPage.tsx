"use client";

import { IUser } from "@/model/user.model";
import { FaPaperPlane } from "react-icons/fa";
import { useState } from "react";
import VendorDashBoard from "./VendorDashBoard";
import { AnimatePresence, motion } from "motion/react";
import axios from 'axios';
import { useRouter } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";
import { 
  RiStore2Line, 
  RiMapPinLine, 
  RiShieldCheckLine, 
  RiRestartLine, 
  RiTimeLine,
  RiCloseLine,
  RiErrorWarningFill,
  RiCheckboxCircleFill
} from "react-icons/ri";

function VendorPage({ user }: { user: IUser }) {
  const [openVerifyfrom, setOpenVerifyfrom] = useState(false);
  const [shopName, setShopName] = useState(user?.shopName || "");
  const [shopAddress, setShopAddress] = useState(user?.shopAddress || "");
  const [gstNumber, setGstNumber] = useState(user?.gstNumber || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerifyAgain = async () => {
    if (!shopAddress || !shopName || !gstNumber) {
      alert("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/vendor/verifyagain", { shopName, shopAddress, gstNumber });
      setLoading(false);
      alert("Verification request sent successfully! Redirecting to home page...");
      router.push("/");
    } catch (error) {
      setLoading(false);
      alert("Failed to send verification request. Please try again.");
      console.log(error);
    }
  };

  if (!user) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <ClipLoader size={40} color='#3b82f6' />
          <h1 className="mt-4 animate-pulse tracking-widest text-sm">LOADING...</h1>
        </div>
      </div>
    );
  }

  if (user.verificationStatus === "approved") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full min-h-screen pt-16">
        <VendorDashBoard />
      </motion.div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-900 via-black to-slate-950 text-white px-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white/5 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] border border-white/10 max-w-2xl w-full text-center overflow-hidden"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 blur-[80px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-600/10 blur-[80px] rounded-full" />

        <AnimatePresence mode="wait">
          {/* --- PENDING STATE --- */}
          {user.verificationStatus === "pending" && (
            <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <RiTimeLine className="text-7xl text-blue-400 mx-auto mb-6 animate-spin-slow" />
              <h2 className="text-blue-400 text-4xl font-bold mb-6 tracking-tight">Verification Pending</h2>
              <p className="text-white text-xl mb-4 font-light italic">Please wait for the admin to verify your account</p>
              <span className="font-semibold text-slate-400 block mb-6">Admin Verification</span>
              <div className="py-3 px-6 bg-white/5 border border-white/10 rounded-2xl inline-block">
                <span className="text-gray-300">Verification: </span>
                <span className="text-blue-400 font-bold uppercase tracking-wider">{user.verificationStatus}</span>
              </div>
            </motion.div>
          )}

          {/* --- REJECTED STATE --- */}
          {user.verificationStatus === "rejected" && (
            <motion.div key="rejected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              
              {/* This section (Messages) hides when openVerifyfrom is true */}
              {!openVerifyfrom ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <RiErrorWarningFill className="text-7xl text-red-500 mx-auto mb-6" />
                  <h2 className="text-blue-400 text-4xl font-bold mb-6">Verification Rejected</h2>
                  <p className="text-white text-xl mb-2">Please wait for the admin to verify your account</p>
                  <span className="font-semibold block text-slate-400 mb-6">Admin Verification</span>
                  
                  <div className="text-base text-gray-300 mb-8">
                    Verification {" "}
                    <span className="text-blue-400 font-bold uppercase tracking-widest">{user.verificationStatus}</span>
                  </div>

                  <div className="mt-6 p-6 bg-red-600/10 border border-red-600/20 rounded-2xl text-1xl text-red-500 font-bold shadow-inner">
                    Rejected Reason: {user.rejectedReason}
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(37,99,235,0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-10 bg-blue-600 hover:bg-blue-500 py-4 px-12 rounded-2xl font-bold text-xl transition-all shadow-xl flex items-center gap-3 mx-auto"
                    onClick={() => setOpenVerifyfrom(true)}
                  >
                    <RiRestartLine /> Verify Again
                  </motion.button>
                </motion.div>
              ) : (
                /* --- THE FORM (Messages hidden here) --- */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-left"
                >
                  <h3 className="text-2xl font-bold text-blue-400 mb-8 flex items-center gap-2">
                    <RiCheckboxCircleFill /> Update Shop Details
                  </h3>
                  
                  <div className="space-y-5">
                    <div className="relative group">
                      <RiStore2Line className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                      <input
                        type="text"
                        placeholder="Shop Name"
                        onChange={(e) => setShopName(e.target.value)}
                        value={shopName}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/40 border border-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all shadow-inner"
                      />
                    </div>

                    <div className="relative group">
                      <RiMapPinLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                      <input
                        type="text"
                        placeholder="Shop Address"
                        onChange={(e) => setShopAddress(e.target.value)}
                        value={shopAddress}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/40 border border-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all shadow-inner"
                      />
                    </div>

                    <div className="relative group">
                      <RiShieldCheckLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                      <input
                        type="text"
                        placeholder="Shop GST Number"
                        onChange={(e) => setGstNumber(e.target.value)}
                        value={gstNumber}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/40 border border-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all shadow-inner uppercase font-mono"
                      />
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                      onClick={handleVerifyAgain}
                      className="mt-4 w-full text-center bg-blue-600 hover:bg-blue-500 py-4 px-12 rounded-2xl font-bold text-xl transition-all justify-center shadow-xl flex items-center gap-3 mx-auto"
                    >
                      <FaPaperPlane size={24} /> Submit
                    </button>

                    <button
                      onClick={() => setOpenVerifyfrom(false)}
                      className=" w-full text-center bg-red-600 hover:bg-red-500 py-4 px-12 rounded-2xl font-bold text-xl transition-all justify-center shadow-xl flex items-center gap-3 mx-auto">
                      <RiCloseLine size={24} /> Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default VendorPage;