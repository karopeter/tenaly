"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Button from "../Button";
import Img from "../Image";


const MessageSellerButton = ({sellerId, productId,  openAuthModal, productImage, productTitle }) => {
  const router = useRouter();
  const { isLoggedIn, profile} = useAuth();

   const handleClick = () => {
     if (isLoggedIn) {
      // Construct the messages and image URL for the preview 
      const previewMessage = encodeURIComponent(`Hi I'm interested in your product: "${productTitle}". Is it still available?`);
      const productImageUrl = productImage ? encodeURIComponent(productImage) : ''; // Ensure the image is in URL encoded
       router.push(`/Message?sellerId=${sellerId}&productId=${productId}&previewMessage=${previewMessage}&productImageUrl=${productImageUrl}`);
     } else {
      // Highlighted changes start here 
      // Encode product details for redirecting after login
      const encodedProductImage = productImage ? encodeURIComponent(productImage) : '';
      const encodedProductTitle = productTitle ? encodeURIComponent(productTitle) : '';
       localStorage.setItem("redirectAfterLogin", `/message/${sellerId}?productId=${productId}&productImage=${encodedProductImage}&productTitle=${encodedProductTitle}`);
        // localStorage.setItem("redirectAfterLogin", `/message/${sellerId}`);

        // Open the auth model 
        openAuthModal();
     }
   };
  return (
    <Button
        onClick={handleClick}
        className="border border-[#CDCDD7] text-[#525252] 
          h-[45px] flex-1 flex items-center whitespace-nowrap justify-center px-4 py-2 rounded-[4px] 
          font-inter font-[400] text-sm transition"
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