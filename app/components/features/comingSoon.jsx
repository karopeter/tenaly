"use client";
import { useState } from 'react';
import Img from '../Image';
import api from '@/services/api';
import Button from '../Button';
import { toast } from 'react-toastify';

// Define the Form component
const Form = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [hasJoined, setHasJoined] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (hasJoined) return;

        setLoading(true);
        setMessage(null);

        try {
          const res = await api.post("/waitlist/add-to-waitlist", { name, email });

          if (res.status === 200 || res.status === 201) {
           setMessage({ type: "success", text: res.data.message }); 
            toast.success(res.data.message || "Your waitlist has been added successfully.");
            setHasJoined(true);
            setName("");
            setEmail("");
          } 
        } catch (error) {
           console.error("Waitlist error:", error.response?.data || error.message);

          setMessage({
            type: "error",
            text: error.response?.data?.message || "Something went wrong, try again.",
         });
         toast.error(error.response?.data?.message || "Error posting waitlist, Please try again");
        } finally {
         setLoading(false);
        }
    };
    return (
    <form 
     onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-8 bg-[#5b5b9e] rounded-lg shadow-lg">
        <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-[#EDEDED] font-[400]">
                Name
            </label>
            <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                disabled={hasJoined}
                className="w-full px-4 py-3 bg-white text-gray-900 
                border border-gray-300 rounded-md
                 focus:outline-none focus:ring-2 focus:ring-[#000087]"
            />
        </div>
        <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[#EDEDED] font-[400]">
                Email
            </label>
            <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={hasJoined}
                className="w-full px-4 py-3 bg-white text-gray-900 
                border border-gray-300 rounded-md focus:outline-none 
                focus:ring-2 focus:ring-[#000087]"
            />
        </div>
        <button 
           type="submit"
           disabled={loading || hasJoined}
           className="flex justify-center items-center mt-4 px-6 
           py-3 bg-[#000087] w-full text-[#FFFFFF] text-[16px] 
           rounded-md hover:bg-opacity-90 transition">
             {loading ? "Joining..." : hasJoined ? "Already Joined" : "Join"}
        </button>
        {message && (
         <p 
          className={`text-sm mt-2 ${message.type === "success" ? "text-green-300" : "text-red-300"}`}>
           {message.text}
         </p>
        )}
    </form>
    );
};

// Main component with state management
export default function ComingSoonSection() {
    const [showForm, setShowForm] = useState(false);

    const handleJoinClick = () => {
        setShowForm(true);
    };

    return (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-20 px-4 sm:px-6 md:px-8 py-12">
            {/* Left content */}
            <div className="w-full md:w-1/2 flex flex-col items-start md:mt-20 text-left">
                <h3 className="text-[24px] md:text-[40px] font-[500] text-[#FFFFFF] font-inter leading-tight">
                    Coming Soon to <br className="hidden md:block" />
                    Mobile App
                </h3>
                <p className="text-[#EDEDED] font-[400] font-inter mt-4 text-[15px] max-w-md">
                    Be the first to know when our app launches. Join the waitlist for early access and exclusive updates.
                </p>
                
                {/* Conditional rendering based on showForm state */}
                {!showForm ? (
                    <Button
                        onClick={handleJoinClick}
                        className="flex justify-center items-center gap-2 mt-6 px-6 py-3 bg-[#000087] w-full md:w-[370px] md:h-[64px] rounded-[8px] text-[#FFFFFF] text-[16px] rounded-md text-sm hover:bg-opacity-90 transition"
                    >
                        Join our waitlist
                        <Img 
                            src="/arrow-right.svg"
                            alt="arrow-right"
                            width={24}
                            height={24}
                            className="w-[24px] h-[24px]"
                        />
                    </Button>
                ) : (
                    <div className="mt-6 w-full md:w-[370px]">
                        <Form />
                    </div>
                )}
            </div>
            
            {/* Right image */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                <Img
                    src="/waitlistImg.png"
                    alt="Mobile App Preview"
                    width={590}
                    height={296}
                    className="w-[250px] h-auto md:w-[590px] object-contain"
                />
            </div>
        </div>
    );
}