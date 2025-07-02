"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Img from "../components/Image";
import Sidebar from "../components/navbar/sidebar";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
    const router = useRouter();
      const { logout } = useAuth();

    return (
      <div className="md:px-[104px] px-4 md:ml-10 mt-20 md:mt-40">
       <div className="flex flex-col md:flex-row gap-10">
          <Sidebar />
          <main className="flex-1">
           <div className="bg-white shadow-phenom md:rounded-[12px] p-8">
            <div className="md:px-[104px] px-2 md:ml-10 ">
             <h2 className="text-[#525252] font-[500] font-inter md:text-[24px] mb-6">
               Settings
             </h2>
            <div 
              className="flex flex-col justify-start p-4 items-start
              bg-[#FFFFFF] md:w-[441px] md:h-[192px] 
              rounded-[8px] border-[1px]  border-[#EBEBEC]">
                <Link href="/become-verified" 
                 className="flex items-center gap-3  w-full 
                  transition mb-4 border-b border-[#EBEBEC]">
                  <Img 
                    src="/verified.svg"
                    alt="Verify Icon"
                    width={24}
                    height={24}
                  />
                  <span className="text-[#525252] font-[400] text-[14px] font-inter">Become a verified user</span>
                </Link>
                
                <Link href="/notification-settings" className="flex items-center gap-3  w-full 
                 transition mb-4 border-b border-[#EBEBEC]">
                  <Img 
                    src="/notification.svg"
                    alt="Notification Icon"
                    width={24}
                    height={24}
                  />
                  <span className="text-[#525252] font-[400] text-[14px] font-inter">Notification Setting</span>
                </Link>
                <Link href="/account-action" className="flex items-center gap-3  w-full 
                  transition mb-4 border-b border-[#EBEBEC]">
                  <Img 
                    src="/cpu-setting.svg"
                    alt="Notification Icon"
                    width={24}
                    height={24}
                  />
                  <span className="text-[#525252] font-[400] text-[14px] font-inter">Account Action</span>
                </Link>
                <button 
                  onClick={() => {
                  logout();
                  router.push("/");
                }}
                 className="flex items-center gap-3 w-full transition text-left">
                  <Img 
                    src="/login.svg"
                    alt="Logout button"
                    width={24}
                    height={24}
                   />
                   <span className="text-[#525252] font-[400] text-[14px] font-inter">Logout</span>
                </button>
            </div>
            </div>
           </div>
         </main>
       </div>
       </div>
    );
   }