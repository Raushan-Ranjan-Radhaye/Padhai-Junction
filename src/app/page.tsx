import User from "../model/user.model";
import connectDb from "../lib/connectDB";
import { auth } from "../auth";
import { redirect } from "next/navigation";

import EditRoleandPhone from "../component/EditRoleandPhone";
import { Navbar } from "@/component/Navbar";
import UserDashBoard from "@/component/User/UserDashBoard";
import AdminDashBoard from "@/component/Admin/AdminDashBoard";
import Footer from "@/component/Footer";
import EditVendorDetails from "@/component/Vendor/EditVendorDetails";
import VendorPage from "@/component/Vendor/VendorPage";

export default async function Home() {
  await connectDb();

  const session = await auth();

  // ✅ If no session → redirect immediately
  if (!session?.user?.id) {
    redirect("/login");
  }

  // ✅ Safe DB query
  const user = await User.findById(session.user.id);

  if (!user) {
    redirect("/login");
  }

  const inComplete = !user.role || !user.phone || (!user.phone && user.role == "user")
  if(inComplete){
    return <EditRoleandPhone/>
  }


  if(user?.role == "vendor"){
    const isCompleteDetails = !user.shopName || !user.shopAddress || !user.gstNumber
    if(isCompleteDetails){
      return <EditVendorDetails/>
    } 
  }


  // ✅ Convert mongoose document to plain object
  const plainUser = JSON.parse(JSON.stringify(user));

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 font-sans">
      <Navbar user={plainUser} />

      {user.role === "user" ? (
        <UserDashBoard />
      ) : user.role === "vendor" ? (
        <VendorPage user={plainUser} />
        // vendor page se ham condation ko check kar kar hai ki vaefication daatus approved hai ya nahi
      ) : (
        <AdminDashBoard />
      )}
      <Footer user={plainUser} />
    </div>
  );
}
