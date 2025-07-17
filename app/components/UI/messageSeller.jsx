"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Button from "../Button";
import Img from "../Image";


const MessageSellerButton = ({sellerId, productId,  openAuthModal }) => {
  const router = useRouter();
  const { isLoggedIn, profile} = useAuth();

   const handleClick = () => {
     if (isLoggedIn) {
       router.push(`/Message`);
     } else {
        localStorage.setItem("redirectAfterLogin", `/message/${sellerId}`);

        // Open the auth model 
        openAuthModal();
     }
   };
  return (
    <Button
        onClick={handleClick}
        className="flex items-center justify-center gap-2 border-[1px] border-[#EDEDED] w-full h-[40px] rounded-[8px] text-[#525252] text-[12px] font-inter font-[500]"
      >
        <Img
          src="/message.svg"
          alt="Message Icon"
          width={20}
          height={20}
          className="w-[20px] h-[20px]"
        />
        Message Seller
      </Button>
  )
}

export default MessageSellerButton;