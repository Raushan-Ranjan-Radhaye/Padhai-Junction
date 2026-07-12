"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TbPlayerTrackNext, TbLogin } from "react-icons/tb";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { MdEmail, MdLock, MdErrorOutline } from "react-icons/md";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { signIn, useSession } from 'next-auth/react';

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const session = useSession();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error.includes("not found") || result.error.includes("CredentialsSignin")) {
          setError("User not found. Please go to the Register page.");
        } else {
          setError("Login failed: " + result.error);
        }
        setLoading(false);
        return;
      }

      setLoading(false);
      router.push("/");
    } catch (error) {
      console.log("Login Error", error);
      setError("An error occurred during login");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0e0b09] via-[#171310] to-[#0e0b09] text-[#EDE6D3] p-6 overflow-hidden font-sans">

      {/* --- STAGE BACKGROUND: spotlight cone + curtain folds --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Spotlight cone, gently flickering like a stage lamp */}
        <motion.div
          animate={{ opacity: [1, 0.85, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(232,163,61,0.22) 0%, rgba(232,163,61,0.05) 40%, transparent 68%)",
          }}
        />
        {/* Curtain folds at either edge */}
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
        {/* Faint amber ambient glow */}
        <motion.div
          animate={{ opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#E8A33D]/5 blur-[120px] rounded-full"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key="login-box"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
          className="relative z-10 w-full max-w-md bg-[#EDE6D3]/[0.04] backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-[#E8A33D]/15"
        >
          {/* Slate strip, like a scene marker on a clapperboard */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EDE6D3]/10 font-mono text-[10px] tracking-[0.15em] uppercase text-[#a89f8f]">
            <span>Sides — Login</span>
            <span>Take 01</span>
          </div>

          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-block p-3 rounded-full bg-[#E8A33D]/15 border border-[#E8A33D]/30 mb-4"
            >
              <TbLogin size={32} className="text-[#E8A33D]" />
            </motion.div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#E8A33D] to-[#c97b2e] bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-[#a89f8f] text-sm mt-2">Secure access to your Padhai Junction account</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 bg-[#7a2e2e]/15 border border-[#7a2e2e]/60 text-[#e2a3a3] p-3 rounded-xl mb-4 text-sm"
              >
                <MdErrorOutline size={18} className="shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSignIn} className="flex flex-col gap-5">
            <motion.div whileFocus={{ scale: 1.01 }} className="relative group">
              <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E8A33D]/50 group-focus-within:text-[#E8A33D] transition-colors" />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#EDE6D3]/[0.04] border border-[#EDE6D3]/10 rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#E8A33D] transition-all focus:bg-[#EDE6D3]/[0.08] text-[#EDE6D3] placeholder:text-[#7a7266]"
              />
            </motion.div>

            <motion.div whileFocus={{ scale: 1.01 }} className="relative group">
              <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E8A33D]/50 group-focus-within:text-[#E8A33D] transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#EDE6D3]/[0.04] border border-[#EDE6D3]/10 rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#E8A33D] transition-all focus:bg-[#EDE6D3]/[0.08] text-[#EDE6D3] placeholder:text-[#7a7266]"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7a7266] hover:text-[#E8A33D] transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </motion.div>

            <motion.button
              disabled={loading}
              whileHover={{ scale: 1.02, boxShadow: "0px 0px 20px rgba(232, 163, 61, 0.45)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="mt-2 py-4 flex items-center justify-center gap-2 bg-[#E8A33D] hover:bg-[#d4922f] text-[#171310] rounded-xl font-bold w-full transition-all shadow-lg relative overflow-hidden group"
            >
              {/* Shine sweep on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {loading ? <ClipLoader color="#171310" size={20} /> : (
                <span className="relative flex items-center gap-2">
                  Sign In <TbPlayerTrackNext size={20} />
                </span>
              )}
            </motion.button>

            <div className="flex items-center gap-4 my-2">
              <div className="h-[1px] flex-1 bg-[#EDE6D3]/10"></div>
              <span className="text-xs font-bold text-[#7a7266] uppercase tracking-widest">or</span>
              <div className="h-[1px] flex-1 bg-[#EDE6D3]/10"></div>
            </div>

            <motion.button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(237,230,211,0.06)" }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className="flex items-center justify-center gap-3 py-4 bg-[#EDE6D3]/[0.04] border border-[#EDE6D3]/10 rounded-xl transition-all hover:border-[#E8A33D]/30"
            >
              <FcGoogle size={22} />
              <span className="font-semibold text-sm">Continue with Google</span>
            </motion.button>

            <p className="text-center text-sm mt-4 text-[#a89f8f]">
              New to Padhai Junction?{" "}
              <span
                onClick={() => router.push("/register")}
                className="cursor-pointer text-[#E8A33D] font-bold hover:text-[#f0b869] transition-colors"
              >
                Create Account
              </span>
            </p>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default SignIn;