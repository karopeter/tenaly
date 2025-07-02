"use client";
import Img from "../Image";
import Link from "next/link";
import { footerData } from "../../lib/constants";

export default function Footer() {
  return (
    <footer className="bg-[#021820] text-white py-10 px-4 md:px-10 md:mt-40">
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Logo & Description */}
        <div>
          <Img
            src="/footerLogo.svg"
            alt="Logo"
            width={156.92}
            height={80}
            className="w-[120px] md:w-[156.92px] h-auto"
          />
          <p className="mt-4 text-[14px] font-[400] font-inter leading-relaxed text-[#EDEDED] max-w-[320px]">
            Tenaly, your trusted marketplace for vehicles and real estate—buy anything, sell anything with ease, transparency, and reliability
          </p>
        </div>

        {/* Mobile Row for Company and Support */}
        <div className="flex flex-row justify-between gap-6 md:hidden">
          {[footerData[0], footerData[1]].map((section, index) => (
            <div key={index}>
              <h4 className="text-[#FFFFFF] text-[16px] font-[500] font-inter mb-4">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-2 text-[14px] text-[#EDEDED] font-[400] font-inter">
                {section.links.map((linkObj, i) => (
                  <li key={i}>
                    <Link href={linkObj.href}>{linkObj.label.replace(/-/g, " ")}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Desktop view for Company */}
        <div className="hidden md:block">
          <h4 className="text-[#FFFFFF] text-[16px] font-[500] font-inter mb-4">
            {footerData[0].title}
          </h4>
          <ul className="flex flex-col gap-2 text-[14px] text-[#EDEDED] font-[400] font-inter">
            {footerData[0].links.map((linkObj, i) => (
              <li key={i}>
                <Link href={linkObj.href}>{linkObj.label.replace(/-/g, " ")}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop view for Support */}
        <div className="hidden md:block">
          <h4 className="text-[#FFFFFF] text-[16px] font-[500] font-inter mb-4">
            {footerData[1].title}
          </h4>
          <ul className="flex flex-col gap-2 text-[14px] text-[#EDEDED] font-[400] font-inter">
            {footerData[1].links.map((linkObj, i) => (
              <li key={i}>
                <Link href={linkObj.href}>{linkObj.label.replace(/-/g, " ")}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="text-[#FFFFFF] text-[16px] font-[500] font-inter mb-4">
            {footerData[2].title}
          </h4>
          <div className="flex flex-row items-center gap-4 text-[20px] text-white">
            {footerData[2].socialIcons.map((social, i) => {
              const Icon = social.icon;
              return (
                <Link
                  href={social.link}
                  key={i}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-110"
                >
                  <Icon color={social.color || "white"} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <div className="text-center mt-10">
         <p className="text-[#8C8C8C] text-[14px] font-[400] font-inter">© 2025 Tenaly. All rights reserved.</p>
      </div>
    </footer>
  );
}
