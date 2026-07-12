"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import {
  MdStore,
  MdPerson,
  MdLocationOn,
  MdAssignment,
  MdErrorOutline,
} from "react-icons/md";
import { TbPlayerTrackNext } from "react-icons/tb";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { useRouter } from "next/navigation";
import { PiGraduationCapFill } from "react-icons/pi";

function EditVendorDetails() {
  const [shopName, setShopName] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // LOGIC: preserved check
    if (!shopName || !shopAddress || !gstNumber) {
      alert("Please fill all the details");
      setLoading(false);
      return;
    }

    try {
      const result = await axios.post("/api/vendor/editDetails", {
        shopName,
        shopAddress,
        gstNumber,
      });
      setLoading(false);
      console.log(result.data);
      alert("Vendor Shop Details Added Successfully");
      router.push("/");
    } catch (error) {
      setLoading(false);
      console.log("Error", error);
      alert("Failed to update details. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0e0b09] via-[#171310] to-[#0e0b09] text-[#EDE6D3] p-6 overflow-hidden font-sans">

      {/* --- STAGE BACKGROUND: spotlight cone + curtain folds --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ opacity: [1, 0.85, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(232,163,61,0.22) 0%, rgba(232,163,61,0.05) 40%, transparent 68%)",
          }}
        />
        <div
          className="absolute -left-10 top-0 bottom-0 w-32 opacity-40 blur-[1px]"
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(122,46,46,0.35) 0px, rgba(122,46,46,0.12) 14px, rgba(122,46,46,0.35) 28px)",
          }}
        />
        <div
          className="absolute -right-10 top-0 bottom-0 w-32 opacity-40 blur-[1px]"
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(122,46,46,0.35) 0px, rgba(122,46,46,0.12) 14px, rgba(122,46,46,0.35) 28px)",
          }}
        />
        <motion.div
          animate={{ opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#E8A33D]/5 blur-[120px] rounded-full"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key="vendor-box"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          className="relative z-10 w-full max-w-md bg-[#EDE6D3]/[0.04] backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-[#E8A33D]/15"
        >
          {/* Slate strip */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EDE6D3]/10 font-mono text-[10px] tracking-[0.15em] uppercase text-[#a89f8f]">
            <span>Backstage — Teacher</span>
            <span>Take 01</span>
          </div>

          <div className="mb-8 text-center">
            <div className="inline-block p-3 rounded-full bg-[#E8A33D]/15 border border-[#E8A33D]/30 mb-4">
              <MdPerson size={32} className="text-[#E8A33D]" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#E8A33D] to-[#c97b2e] bg-clip-text text-transparent">
              Teacher Details
            </h2>
            <p className="text-[#a89f8f] text-sm mt-2">Activate your Teacher account below</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="relative group">
              <PiGraduationCapFill className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E8A33D]/50 group-focus-within:text-[#E8A33D] transition-colors" size={22} />
              <input
                type="text"
                required
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Qualification"
                value={shopName}
                className="w-full bg-[#EDE6D3]/[0.04] border border-[#EDE6D3]/10 rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#E8A33D] transition-all focus:bg-[#EDE6D3]/[0.08] text-[#EDE6D3] placeholder:text-[#7a7266]"
              />
            </div>

            <div className="relative group">
              <MdLocationOn className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E8A33D]/50 group-focus-within:text-[#E8A33D] transition-colors" size={22} />
              <input
                type="text"
                required
                onChange={(e) => setShopAddress(e.target.value)}
                placeholder="Full Address"
                value={shopAddress}
                className="w-full bg-[#EDE6D3]/[0.04] border border-[#EDE6D3]/10 rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#E8A33D] transition-all focus:bg-[#EDE6D3]/[0.08] text-[#EDE6D3] placeholder:text-[#7a7266]"
              />
            </div>

            <div className="relative group">
              <MdAssignment className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E8A33D]/50 group-focus-within:text-[#E8A33D] transition-colors" size={22} />
              <input
                type="text"
                required
                onChange={(e) => setGstNumber(e.target.value)}
                placeholder="Experience (Years)"
                value={gstNumber}
                className="w-full bg-[#EDE6D3]/[0.04] border border-[#EDE6D3]/10 rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#E8A33D] transition-all focus:bg-[#EDE6D3]/[0.08] text-[#EDE6D3] placeholder:text-[#7a7266]"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02, boxShadow: "0px 0px 15px rgba(232, 163, 61, 0.4)" } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className={`mt-2 py-4 flex items-center justify-center gap-2 rounded-xl font-bold w-full transition-all shadow-lg ${
                loading ? "bg-[#EDE6D3]/10 text-[#7a7266]" : "bg-[#E8A33D] hover:bg-[#d4922f] text-[#171310]"
              }`}
            >
              {loading ? <ClipLoader size={20} color="#7a7266" /> : (
                <>
                  Submit Now <TbPlayerTrackNext size={20} />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default EditVendorDetails;