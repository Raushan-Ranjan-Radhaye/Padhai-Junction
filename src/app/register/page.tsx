"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TbPlayerTrackNext, TbUserPlus } from "react-icons/tb";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { MdEmail, MdLock, MdPerson, MdErrorOutline } from "react-icons/md";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { signIn } from 'next-auth/react';

function Register() {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    setLoading(true);
    setError("");
    e.preventDefault();
    try {
      await axios.post("/api/auth/register", { name, email, password });
      setLoading(false);
      setEmail("");
      setName("");
      setPassword("");
      router.push("/login");
    } catch (err: any) {
      setLoading(false);
      if (err.response?.status === 400 || err.response?.data?.message?.includes("exists")) {
        setError("Email already found. Please go to Login.");
      } else {
        setError("Registration failed. Please try again.");
      }
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
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10 w-full max-w-lg bg-[#EDE6D3]/[0.04] backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-[#E8A33D]/15 text-center"
          >
            {/* Slate strip */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EDE6D3]/10 font-mono text-[10px] tracking-[0.15em] uppercase text-[#a89f8f]">
              <span>Casting Call</span>
              <span>Step 01 / 02</span>
            </div>

            <div className="inline-block p-3 rounded-full bg-[#E8A33D]/15 border border-[#E8A33D]/30 mb-4">
              <TbUserPlus size={32} className="text-[#E8A33D]" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#E8A33D] to-[#c97b2e] bg-clip-text text-transparent mb-4">
              Join Padhai Junction
            </h1>
            <p className="text-[#a89f8f] mb-8">Select your account type to get started</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Student", icon: "🎓", value: "user" },
                { label: "Teacher", icon: "👨‍🏫", value: "vendor" },
                { label: "Admin", icon: "🧑‍🔧", value: "admin" },
              ].map((item) => (
                <motion.div
                  key={item.value}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(237,230,211,0.08)",
                    boxShadow: "0px 0px 20px 2px rgba(232, 163, 61, 0.3)",
                    borderColor: "rgba(232, 163, 61, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 bg-[#EDE6D3]/[0.04] cursor-pointer rounded-2xl border border-[#EDE6D3]/10 flex flex-col items-center transition-all duration-300"
                >
                  <span className="text-4xl mb-2">{item.icon}</span>
                  <span className="text-sm font-medium text-[#c9c1b3]">{item.label}</span>
                </motion.div>
              ))}
            </div>

            <motion.button
              className="py-4 flex items-center justify-center gap-2 bg-[#E8A33D] hover:bg-[#d4922f] text-[#171310] rounded-xl font-bold w-full transition-all"
              whileHover={{
                scale: 1.02,
                boxShadow: "0px 10px 30px -5px rgba(232, 163, 61, 0.5)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep(2)}
            >
              Continue <TbPlayerTrackNext size={20} />
            </motion.button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 w-full max-w-md bg-[#EDE6D3]/[0.04] backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-[#E8A33D]/15"
          >
            {/* Slate strip */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EDE6D3]/10 font-mono text-[10px] tracking-[0.15em] uppercase text-[#a89f8f]">
              <span>Casting Call</span>
              <span>Step 02 / 02</span>
            </div>

            <div className="mb-6 text-center">
               <h2 className="text-2xl font-bold bg-gradient-to-r from-[#E8A33D] to-[#c97b2e] bg-clip-text text-transparent">
                Create Your Account
              </h2>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 bg-[#7a2e2e]/15 border border-[#7a2e2e]/60 text-[#e2a3a3] p-3 rounded-xl mb-4 text-sm"
                >
                  <MdErrorOutline size={18} />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              <div className="relative group">
                <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E8A33D]/50 group-focus-within:text-[#E8A33D] transition-colors" />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#EDE6D3]/[0.04] border border-[#EDE6D3]/10 rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#E8A33D] transition-all text-[#EDE6D3] placeholder:text-[#7a7266]"
                />
              </div>

              <div className="relative group">
                <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E8A33D]/50 group-focus-within:text-[#E8A33D] transition-colors" />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#EDE6D3]/[0.04] border border-[#EDE6D3]/10 rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#E8A33D] transition-all text-[#EDE6D3] placeholder:text-[#7a7266]"
                />
              </div>

              <div className="relative group">
                <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E8A33D]/50 group-focus-within:text-[#E8A33D] transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#EDE6D3]/[0.04] border border-[#EDE6D3]/10 rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#E8A33D] transition-all text-[#EDE6D3] placeholder:text-[#7a7266]"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7a7266] hover:text-[#E8A33D] transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>

              <motion.button
                disabled={loading}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0px 10px 25px -5px rgba(232, 163, 61, 0.6)"
                }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="mt-2 py-4 flex items-center justify-center gap-2 bg-[#E8A33D] hover:bg-[#d4922f] text-[#171310] rounded-xl font-bold w-full transition-all shadow-lg"
              >
                {loading ? <ClipLoader color="#171310" size={20} /> : (
                  <>Register Now <TbPlayerTrackNext size={20} /></>
                )}
              </motion.button>

              <div className="flex items-center gap-4 my-2">
                <div className="h-[1px] flex-1 bg-[#EDE6D3]/10"></div>
                <span className="text-xs font-bold text-[#7a7266] tracking-widest uppercase">or</span>
                <div className="h-[1px] flex-1 bg-[#EDE6D3]/10"></div>
              </div>

              <motion.button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/" })}
                whileHover={{
                  scale: 1.02,
                  backgroundColor: "rgba(237,230,211,0.08)",
                  boxShadow: "0px 5px 15px rgba(237,230,211,0.1)"
                }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-3 py-4 bg-[#EDE6D3]/[0.04] border border-[#EDE6D3]/10 rounded-xl transition-all"
              >
                <FcGoogle size={22} />
                <span className="font-semibold text-sm">Register with Google</span>
              </motion.button>

              <p className="text-center text-sm mt-4 text-[#a89f8f]">
                Already have an account?{" "}
                <span
                  onClick={() => router.push("/login")}
                  className="cursor-pointer text-[#E8A33D] font-bold hover:text-[#f0b869] transition-colors"
                >
                  Login
                </span>
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Register;