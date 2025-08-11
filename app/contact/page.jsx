"use client";
import { useState } from "react";
import Img from "../components/Image";
import Button from "../components/Button";
import BuyAnything from "../components/features/buy-anything";
import api from "@/services/api";
import { toast } from "react-toastify";

export default function ContactUs() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
       const res = await api.post("/contact/send-message", { email, message });
       if (res.data.success) {
        setSuccessMessage(res.data.message);
        toast.success("Message submitted successfully");
        setEmail(""); 
        setMessage("");
       } else {
        setErrorMessage(res.data.message || "Failed to send message.");
      }
    } catch(error) {
      console.error('Error sending contact message:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else {
         setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <section>
      {/* Header Background Section */}
      <div
        className={`
          w-full 
          h-[305px] md:h-[275px]
          bg-no-repeat bg-center bg-cover
          bg-[url('/contact-us-mobile.svg')]
          md:bg-[url('/contact-us.svg')]
          flex items-center justify-center
        `}
      >
        <h1 className="text-white text-[28px] hidden md:block md:text-[40px] font-inter font-[500] text-center">
          Contact Us
        </h1>
      </div>

      {/* Main Content Section */}
      <div className="flex flex-col md:flex-row justify-center items-start gap-6 px-4 py-10 md:px-0 md:py-16 max-w-[1200px] mx-auto">
        {/* Left Box */}
        <div className="bg-[#8989E9] w-full md:w-[436px] h-auto md:h-[414px] rounded-[8px] p-4 md:p-6 flex flex-col gap-4">
          {/* Phone Box */}
          <div className="bg-[#DFDFF9] p-4 rounded-[8px]">
            <Img 
            src="/contact-call.svg"
             alt="Phone" 
             width={24}
             height={24}
             className="w-6 h-6 mb-2" />
            <p className="text-[#525252] font-[500] font-inter text-[14px] md:text-[16px]">+23490909090909</p>
            <p className="text-[#525252] font-[500] font-inter text-[14px] md:text-[16px]">+2348098765432</p>
          </div>

          {/* Email Box */}
          <div className="bg-[#DFDFF9] p-4 rounded-[8px]">
             <Img 
            src="/email.svg"
             alt="Phone" 
             width={24}
             height={24}
             className="w-[24px] h-[24px] mb-2" />
            <p className="text-[#525252] font-[500] font-inter text-[14px] md:text-[16px]">support@tenaly.com</p>
          </div>

          {/* Address Box */}
          <div className="bg-[#DFDFF9] p-4 rounded-[8px]">
             <Img 
            src="/addr.svg"
             alt="Phone" 
             width={24}
             height={24}
             className="w-[24px] h-[24px] mb-2" />
            <p className="text-[#525252] font-[500] font-inter text-[14px] md:text-[16px]">123 Tenaly Street, Lagos, Nigeria</p>
          </div>
        </div>

        {/* Right Box - Contact Form */}
        <div className="bg-[#F7F7FF] w-full md:w-[756px] h-auto md:h-[424px] rounded-[8px] border border-[#DFDFF9] p-4 md:p-8">
          <h2 className="text-[#000087] font-[500] text-[16px] md:text-[20px] mb-4">Send Message</h2>
          
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="text-[14px] font-medium text-[#525252] block mb-1">Email</label>
              <input
                type="email"
                id="email"
                className="w-full border border-[#CDCDD7] rounded-[4px] px-4 py-3 text-[14px] outline-none"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Message Textarea */}
            <div>
              <label htmlFor="message" className="text-[14px] font-medium text-[#525252] block mb-1">Message</label>
              <textarea
                id="message"
                className="w-full border border-[#CDCDD7] rounded-[4px] px-4 py-3 text-[14px] outline-none h-[120px]"
                placeholder="Write your message"
                 value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                minLength="10"
                maxLength="1000"
              />
            </div>

            {/* Feedback Messages */}
            {loading && (
              <p className="text-blue-600 text-sm">Sending message...</p>
            )}
             {successMessage && (
              <p className="text-green-600 text-sm">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="text-red-600 text-sm">{errorMessage}</p>
            )}

            {/* Submit Button */}
             <Button
                type="submit"
                className="w-full md:w-[262px] h-[44px] md:rounded-[8px] 
                 pt-[10px] pr-[10px] pb-[10px] pl-[16px] md:pt-[10px] md:pr-[16px] md:pb-[10px] md:pl-[16px] 
                 font-[500] md:text-[14px] bg-[#EDEDED] text-[#CDCDD7] 
                bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white"
                disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </div>
      </div>

      <div className="w-full flex justify-center mt-10 px-4">
        <div className="border border-[#CDCDD7]  w-full max-w-[552px] h-[158px] rounded-[8px] pt-[20px] pb-[20px] pr-[40px] pl-[40px] flex flex-col items-center justify-center text-center">
          {/* Title */}
          <h3 className="text-[#525252] font-[500] font-inter text-[16px] md:text-[24px]">
            Follow Us
          </h3>
          <p className="text-[#868686] font-[400] font-inter text-[14px]">
            Stay updated on the latest deal and updates
          </p>

            {/* Social Icons Row */}
          <div className="flex flex-row gap-4 justify-center items-center mt-5">
           <Img 
             src="/youtube.svg" 
             alt="YouTube" 
             width={22.8}
             height={16}
             className="w-[22.8px] h-[16px]" />
            <Img 
              src="/linkedin.svg" 
              alt="LinkedIn" 
              width={40}
              height={40}
              className="w-[40px] h-[40px]"
            />
           <Img 
            src="/facebook.svg" 
            alt="Facebook"
            width={40}
            height={40}
            className="w-[40px] h-[40px]"
            />
          <Img 
            src="/instagram.svg"
            alt="Instagram" 
            width={40}
            height={40}
            className="w-[40px] h-[40px]"
           />
          <Img 
           src="/tiktok.svg"
           alt="TikTok" 
           width={40}
           height={40}
          className="w-[40px] h-[40px]" 
         />
         <Img 
          src="/twitter.svg" 
          alt="X"  
          width={18}
          height={14}
         className="w-[18px] h-[14px]" />
    </div>
        </div>
      </div>

      <BuyAnything />
    </section>
  );
}
