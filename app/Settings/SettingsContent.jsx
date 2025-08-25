"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Img from "../components/Image";
import { useAuth } from "../context/AuthContext";

export default function SettingsContent() {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <div className="bg-white shadow-phenom md:rounded-[12px] p-4 md:p-8 w-full max-w-[600px] mx-auto mt-20 md:mt-0">
      {/* Heading */}
      <h2 className="text-[#525252] font-[500] font-inter text-[18px] md:text-[24px] mb-6">
        Settings
      </h2>

      {/* Settings card */}
      <div className="flex flex-col justify-start p-4 items-start bg-[#FFFFFF] w-full rounded-[8px] border border-[#EBEBEC]">
        {/* Become verified */}
        <Link
          href="/become-verified"
          className="flex items-center gap-3 w-full transition mb-2 pb-2 border-b border-[#EBEBEC]"
        >
          <Img src="/verified.svg" alt="Verify Icon" width={24} height={24} />
          <span className="text-[#525252] font-[400] text-[14px] font-inter">
            Become a verified user
          </span>
        </Link>

        {/* Notification settings */}
        {/* <Link
          href="/notification-settings"
          className="flex items-center gap-3 w-full transition mb-2 pb-2 border-b border-[#EBEBEC]"
        >
          <Img
            src="/settingNotification.svg"
            alt="Notification Icon"
            width={24}
            height={24}
          />
          <span className="text-[#525252] font-[400] text-[14px] font-inter">
            Notification Setting
          </span>
        </Link> */}

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="flex items-center gap-3 w-full transition text-left"
        >
          <Img src="/login.svg" alt="Logout button" width={24} height={24} />
          <span className="text-[#525252] font-[400] text-[14px] font-inter">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
}
