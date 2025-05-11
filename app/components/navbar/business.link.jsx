"use client";
import Link from "next/link";

export default function BusinessLink() {
  const links = [
    { key: "details", label: "Business Details", href: "/Business" },
    { key: "hours", label: "Business Hours", href: "/BusinessHours" },
    { key: "delivery", label: "Delivery", href: "/Business/delivery" },
  ];

  return (
    <div className="bg-[#FAFAFA] md:rounded-[8px] p-4 w-[250px] h-fit">
      <ul className="space-y-2 text-left">
        {links.map((item) => (
          <li key={item.key}>
            <Link
              href={item.href}
              className="text-[#525252] md:text-[16px] font-[500]   
              font-inter underline hover:underline block mb-4"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
