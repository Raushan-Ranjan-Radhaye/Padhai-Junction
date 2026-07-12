"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { IUser } from "../model/user.model";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

import logo from "./../assets/logo.jpg";
import {
  AiOutlineAppstore,
  AiOutlineClose,
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineLogout,
  AiOutlineMenu,
  AiOutlinePhone,
  AiOutlineSearch,
  AiOutlineShop,
  AiOutlineShoppingCart,
  AiOutlineUser,
} from "react-icons/ai";
import { GoListUnordered } from "react-icons/go";
import { signOut } from "next-auth/react";
export function Navbar({ user }: { user: IUser }) {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart count from API to ensure it's always up-to-date
  useEffect(() => {
    const fetchCartCount = async () => {
      if (user?.role === "user") {
        try {
          const result = await fetch("/api/user/cart/get");
          if (!result.ok) {
            // Don't update cart count on error
            return;
          }
          const data = await result.json();
          if (data.cart && Array.isArray(data.cart)) {
            setCartCount(data.cart.length);
          }
        } catch (error) {
          // Silently fail - don't break the UI for cart count errors
          console.log("Cart count fetch skipped");
        }
      }
    };

    fetchCartCount();

    // Refresh cart count every 10 seconds to keep it in sync
    const interval = setInterval(fetchCartCount, 10000);
    return () => clearInterval(interval);
  }, [user?.role]);

  return (
    <div className="fixed top-0  left-0 w-full bg-black text-white z-50 shadow-1 ">
      {/* logo */}
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image
            src={logo}
            width={40}
            height={40}
            alt="logo"
            className="rounded-full"
          />
          <span className="text-xl font-semibold hidden sm:inline">
            MultiCart
          </span>
        </div>

        {user.role === "user" && (
          <div className="hidden md:flex gap-8">
            <NavItem label="Home" path="/" router={router} />
            <NavItem label="Categories" path="/category" router={router} />
            <NavItem label="Shop" path="/shop" router={router} />
            <NavItem label="Orders" path="/orders" router={router} />
          </div>
        )}

        {/* Desktop */}
        {/* agar user ka role user hoga to ye sab icon show hoga */}
        <div className="hidden md:flex items-center gap-6">
          {user?.role === "user" && (
            <IconBtn
              Icon={AiOutlineSearch}
              onClick={() => router.push("/category")}
            />
          )}

          <IconBtn
            Icon={AiOutlinePhone}
            onClick={() => router.push("/support")}
          />

          <div className="relative">
            {user?.image ? (
              <Image
                src={user?.image}
                width={40}
                height={40}
                alt="user"
                onClick={() => setOpenMenu(!openMenu)}
                className="w-10 h-10 rounded-full object-cover border border-gray-700 cursor-pointer"
              />
            ) : (
              <IconBtn
                Icon={AiOutlineUser}
                onClick={() => setOpenMenu(!openMenu)}
              />
            )}

            <AnimatePresence>
              {openMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="absolute right-0 mt-3 w-48 backdrop-blur-lg rounded-xl shadow-lg border bg-[#6a69693c]"
                >
                  <DropDownBtn
                    Icon={AiOutlineUser}
                    label="Profile"
                    onClick={() => {
                      router.push("/profile");
                      setOpenMenu(false);
                    }}
                  />

                  <DropDownBtn
                    Icon={AiOutlineLogin}
                    label="SignIn"
                    onClick={() => {
                      router.push("/login");
                      setOpenMenu(false);
                    }}
                  />

                  <DropDownBtn
                    Icon={AiOutlineLogout}
                    label="SignOut"
                    onClick={() => {
                      signOut();
                      setOpenMenu(false);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {user?.role === "user" && (
            <CartBtn router={router} count={cartCount} />
          )}
        </div>

        {/* mobile */}
        <div className="md:hidden flex items-center gap-4">
          {/* Mobile navigation menu */}

          {/* Mobile user actions for vendor/admin */}
          {(user?.role === "vendor" || user?.role === "admin") && (
            <>
              <IconBtn
                Icon={AiOutlinePhone}
                onClick={() => router.push("/support")}
              />
              
              <div className="relative">
                {user?.image ? (
                  <Image
                    src={user?.image}
                    width={32}
                    height={32}
                    alt="user"
                    onClick={() => setOpenMenu(!openMenu)}
                    className="w-8 h-8 rounded-full object-cover border border-gray-700 cursor-pointer"
                  />
                ) : (
                  <IconBtn
                    Icon={AiOutlineUser}
                    onClick={() => setOpenMenu(!openMenu)}
                  />
                )}

                

                <AnimatePresence>
                  {openMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                      className="absolute right-0 mt-3 w-48 backdrop-blur-lg rounded-xl shadow-lg border bg-[#6a69693c]"
                    >
                      <DropDownBtn
                        Icon={AiOutlineUser}
                        label="Profile"
                        onClick={() => {
                          router.push("/profile");
                          setOpenMenu(false);
                        }}
                      />
                      <DropDownBtn
                        Icon={AiOutlineLogin}
                        label="SignIn"
                        onClick={() => {
                          router.push("/login");
                          setOpenMenu(false);
                        }}
                      />
                      <DropDownBtn
                        Icon={AiOutlineLogout}
                        label="SignOut"
                        onClick={() => {
                          signOut();
                          setOpenMenu(false);
                        }}
                      />

                        


                    </motion.div>
                    


                  )}
                </AnimatePresence>
              </div>
            </>
          )}

          {/* Mobile search, phone, cart, and menu for users */}
          {user?.role === "user" && (
            <div className="flex items-center gap-2">
              <IconBtn
                Icon={AiOutlineSearch}
                onClick={() => router.push("/category")}
              />
              <IconBtn
                Icon={AiOutlinePhone}
                onClick={() => router.push("/support")}
              />
              <CartBtn router={router} count={cartCount} />

              {user?.role === "user" && (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setOpenMenu(!openMenu)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <AiOutlineUser size={24} />
                  </motion.button>

                  <AnimatePresence>
                    {openMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className="absolute right-0 mt-3 w-48 backdrop-blur-lg rounded-xl shadow-lg border bg-[#6a69693c]"
                      >
                        {/* <NavItem label="Home" path="/" router={router} />
                    <NavItem
                      label="Categories"
                      path="/category"
                      router={router}
                    />
                    <NavItem label="Shop" path="/shop" router={router} />
                    <NavItem label="Orders" path="/order" router={router} /> */}

                        <hr className="my-2 border-gray-600" />
                        <DropDownBtn
                          Icon={AiOutlineUser}
                          label="Profile"
                          onClick={() => {
                            router.push("/profile");
                            setOpenMenu(false);
                          }}
                        />
                        <DropDownBtn
                          Icon={AiOutlineLogout}
                          label="SignOut"
                          onClick={() => {
                            signOut();
                            setOpenMenu(false);
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <AiOutlineMenu
                size={28}
                className="cursor-pointer"
                onClick={() => setSidebarOpen(true)}
              />

              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 200, damping: 24 }}
                    className="fixed top-0 right-0 h-screen w-[65%] bg-black/90 backdrop-blur-lg p-6 text-white"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h1 className="text-xl font-semibold">Menu</h1>
                      <AiOutlineClose
                        size={28}
                        className="cursor-pointer"
                        onClick={() => setSidebarOpen(false)}
                      />
                    </div>
                    <div className="flex flex-col gap-4 text-lg">
                      <SidebarBtn
                        label="Home"
                        path="/"
                        router={router}
                        Icon={AiOutlineHome}
                        setSidebarOpen={setSidebarOpen}
                      />
                      <SidebarBtn
                        label="Categories"
                        path="/category"
                        router={router}
                        Icon={AiOutlineAppstore}
                        setSidebarOpen={setSidebarOpen}
                      />
                      <SidebarBtn
                        label="Shop"
                        path="/shop"
                        router={router}
                        Icon={AiOutlineShop}
                        setSidebarOpen={setSidebarOpen}
                      />
                      <SidebarBtn
                        label="Orders"
                        path="/orders"
                        router={router}
                        Icon={GoListUnordered}
                        setSidebarOpen={setSidebarOpen}
                      />
                      <hr className="my-2 border-gray-600" />
                      <SidebarBtn
                        label="Profile"
                        path="/profile"
                        router={router}
                        Icon={AiOutlineUser}
                        setSidebarOpen={setSidebarOpen}
                      />
                      <SidebarBtn
                        label="SignIn"
                        path="/login"
                        router={router}
                        Icon={AiOutlineLogin}
                        setSidebarOpen={() => {
                          signOut();
                          setSidebarOpen(false);
                        }}
                      />
                      <SidebarBtnforSignOut
                        label="SignOut"
                        Icon={AiOutlineLogout}
                        setSidebarOpen={() => {
                          signOut();
                          setSidebarOpen(false);
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const NavItem = ({
  label,
  path,
  router,
}: {
  label: string;
  path: string;
  router: ReturnType<typeof useRouter>;
}) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={() => router.push(path)}
    className="hover:text-gray-300"
  >
    {label}
  </motion.button>
);

const IconBtn = ({
  Icon,
  onClick,
}: {
  Icon: React.ComponentType<{ size: number }>;
  onClick: () => void;
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="p-2 rounded-full hover:bg-white/10 transition-colors"
    >
      <Icon size={24} />
    </motion.button>
  );
};

const DropDownBtn = ({
  Icon,
  label,
  onClick,
}: {
  Icon: React.ComponentType<{ size: number }>;
  label: string;
  onClick: () => void;
}) => (
  <button
    className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/10 text-left"
    onClick={() => {
      onClick();
    }}
  >
    <Icon size={18} /> {label}
  </button>
);

const CartBtn = ({
  router,
  count,
}: {
  router: ReturnType<typeof useRouter>;
  count: string | number;
}) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={() => router.push("/cart")}
    className="relative"
  >
    <AiOutlineShoppingCart size={24} />
    {Number(count) > 0 && (
      <span className="absolute top-2 right-2 bg-blue-500 text-white-400 text-xs rounded-full px-1">
        {count}
      </span>
    )}
  </motion.button>
);

const SidebarBtn = ({
  label,
  path,
  router,
  Icon,
  setSidebarOpen,
}: {
  label: string;
  path: string;
  router: ReturnType<typeof useRouter>;
  Icon: React.ComponentType<{ size: number }>;
  setSidebarOpen: (() => void) | ((open: boolean) => void);
}) => (
  <button
    onClick={() => {
      if (typeof setSidebarOpen === "function") {
        if (setSidebarOpen.length === 0) {
          (setSidebarOpen as () => void)();
        } else {
          router.push(path);
          (setSidebarOpen as (open: boolean) => void)(false);
        }
      }
    }}
    className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#6a69693c] hover:bg-white/10 text-left"
  >
    <Icon size={20} /> {label}
  </button>
);

const SidebarBtnforSignOut = ({
  label,
  Icon,
  setSidebarOpen,
}: {
  label: string;
  Icon: React.ComponentType<{ size: number }>;
  setSidebarOpen: (open: boolean) => void;
}) => (
  <button
    className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#6a69693c] hover:bg-white/10 text-left"
    onClick={() => {
      signOut();
      setSidebarOpen(false);
    }}
  >
    <Icon size={20} /> {label}
  </button>
);
