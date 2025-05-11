// "use client";
// import { useState } from "react";
// import { ChevronDown, ChevronRight } from "lucide-react";
// import Img from "../Image";
// import Button from "../Button";

// export default function PostSidebar () {
//     const [expanded, setExpanded] = useState(null);

//     const sidebarItems = [
//       { label: "Profile", icon: "/profile-circle.svg" },
//       { label: "My Ads", icon: "/addItem.svg" },
//       { label: "Analytics", icon: "/chart.svg" },
//       { label: "Customer Reviews", icon: "/star.svg" },
//       { label: "Premium Services", icon: "/crown-2.svg" },
//       { label: "Pro Sales", icon: "/presention-chart.svg" },
//       { label: "Wallet", icon: "/wallet-money.svg" },
//       { label: "Customer Support", icon: "/24-support.svg" },
//       { label: "FAQs", icon: "/message-question.svg" },
//       { label: "Settings", icon: "/setting-2.svg" }
//     ];
  
//     const toggleExpand = (label) => {
//       setExpanded(prev => (prev === label ? null : label));
//     };

//     return (
//       <div>
//       <aside className="w-72 flex flex-col">
//           <div className="bg-[#F7F7FF]  md:h-[206px] p-4 md:rounded-[8px] md:pt-[24px] md:pb-[24px] text-center mb-6">
//             <Img
//               src="/profileImg.svg"
//               alt="Profile"
//               width={83.33}
//               height={83.33}
//               className="w-20 h-20 rounded-full mx-auto mb-2" />
//               <h3 className="mt-1 text-[#525252] font-[500] md:text-[16px] font-inter mb-2">Golibe Faith</h3>
//               <p className="text-[#868686] md:text-[12px] font-[400] font-inter">Joined since March 2024</p>
//           </div>

//           {/* Sidebar Items - with its own background */}
//           <div className="bg-[#FAFAFA] border-[1px] border-[#EDEDED] p-4 md:rounded-[4px] shadow-sm">
//             <nav className="flex flex-col space-y-4 text-[#525252] md:text-[16px] font-[500] font-inter">
//               {sidebarItems.map(item => (
//                 <div key={item.label}>
//                   <Button
//                     onClick={() => toggleExpand(item.label)}
//                     className="flex justify-between items-center w-full 
//                         hover:border-[1px] hover:border-[#EDEDED] hover:bg-[#000087] 
//                        hover:pt-[10px] hover:pr-[16px] hover:pb-[10px] hover:pl-[16px] 
//                        hover:text-[#FFFFFF] cursor-pointer transition-all duration-300">
//                     <div className="flex items-center gap-3">
//                       <img src={item.icon} alt={item.label} className="w-5 h-5" />
//                       <span>{item.label}</span>
//                     </div>
//                     {expanded === item.label ? (
//                       <ChevronDown className="w-4 h-4" />
//                     ) : (
//                       <ChevronRight className="w-4 h-4" />
//                     )}
//                   </Button>
//                   {expanded === item.label && (
//                     <div className="ml-8 mt-2 text-sm text-gray-500">
//                       Coming soon...
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </nav>
//           </div>
//         </aside>
//       </div>
//     );
// }