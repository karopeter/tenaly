"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Button from "../Button";
import Img from "../Image";

const MessageSellerButton = ({ sellerId, productId, openAuthModal, productImage, productTitle }) => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const handleClick = () => { 
    const previewMessage = encodeURIComponent(`Hi I'm interested in your product: "${productTitle}". Is it still available?`);
    const productImageUrl = productImage ? encodeURIComponent(productImage) : "";

    const redirectPath = `/Message?sellerId=${sellerId}&productId=${productId}&previewMessage=${previewMessage}&productImageUrl=${productImageUrl}&productTitle=${encodeURIComponent(productTitle)}`;

    if (isLoggedIn) {
      router.push(redirectPath);
    } else {
      localStorage.setItem("redirectAfterLogin", redirectPath);
      openAuthModal();
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="flex items-center justify-center gap-2 border-[1px] border-[#EDEDED] w-full h-[40px] whitespace-nowrap rounded-[8px] text-[#525252] text-[12px] font-inter font-[500]"
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
  );
};

export default MessageSellerButton;
