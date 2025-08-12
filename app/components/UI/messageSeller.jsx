"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Button from "../Button";
import Img from "../Image";


const MessageSellerButton = ({sellerId, productId, openAuthModal, productImage, productTitle }) => {
  const router = useRouter();
  const { isLoggedIn, profile} = useAuth();

  const handleClick = () => {
    // Construct the messages and image URL for the preview.
    // The message is encoded to be safely included in the URL.
    const previewMessage = encodeURIComponent(`Hi I'm interested in your product: "${productTitle}". Is it still available?`);
    const productImageUrl = productImage ? encodeURIComponent(productImage) : '';

    if (isLoggedIn) {
      // If the user is logged in, navigate directly to the message page
      // with all the necessary details as query parameters.
      router.push(`/Message?sellerId=${sellerId}&productId=${productId}&previewMessage=${previewMessage}&productImageUrl=${productImageUrl}`);
    } else {
      // If the user is not logged in, we need to save the redirect URL.
      // This URL will be used to navigate back to the message page after the user logs in.
      // It's important that this URL uses the same query parameters as the logged-in state.
      const redirectPath = `/Message?sellerId=${sellerId}&productId=${productId}&previewMessage=${previewMessage}&productImageUrl=${productImageUrl}`;
      
      // Save the constructed path to local storage.
      localStorage.setItem("redirectAfterLogin", redirectPath);
      
      // Open the authentication modal to prompt the user to sign in or sign up.
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
}

export default MessageSellerButton;