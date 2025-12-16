"use client";
import { MdEmail, MdWhatsapp } from "react-icons/md";
import { useState } from "react";
import { IoCall } from "react-icons/io5";

const buttons = [

    {
        icon: <MdWhatsapp className="hidden sm:block" size={"2.4vw"} />,
        iconMobile: <MdWhatsapp className="block sm:hidden" size={'10vw'} />, // 32px for mobile
        text: "enquire Now",
        href: "https://wa.me/+91",
        bg: "bg-indigo-500 hover:bg-indigo-500",
    },
];

export default function ScrollActionButtons() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Desktop version (hidden on mobile)
    return (
        <>
            <div className="hidden sm:flex fixed right-0  lg:top-[25vw] -translate-y-1/2 z-[99999] pointer-events-auto space-y-[1vw] flex-col items-end">
                {buttons.map((btn, index) => (
                    <div
                        key={index}
                        className="group cursor-pointer"
                        onMouseEnter={() =>
                            window.innerWidth >= 640 && setHoveredIndex(index)
                        }
                        onMouseLeave={() =>
                            window.innerWidth >= 640 && setHoveredIndex(null)
                        }
                        onClick={() => {
                            if (window.innerWidth < 640) {
                                setHoveredIndex((prev) => (prev === index ? null : index));
                            }
                        }}
                    >
                        <div
                            className={`flex items-center rounded-l-full text-white shadow-md transition-all duration-300 ${btn.bg}
              ${hoveredIndex === index ? "w-[14vw] translate-x-[-0vw]" : "w-[5vw] translate-x-0"} sm:${hoveredIndex === index ? "w-[14vw] translate-x-[-0vw]" : "w-[0vw] translate-x-0"
                                }`}
                        >
                            {/* Icon button */}
                            <div
                                className=" lg:w-[3vw] lg:h-[3vw] flex justify-center items-center rounded-full bg-indigo-600 text-white transition-transform p-[2vw]"
                                style={{
                                    boxShadow: "4px 0 6px -1px rgba(0,0,0,0.3)",
                                }}
                            >
                                <span
                                    className="transition-transform"
                                    style={{
                                        animation:
                                            hoveredIndex === index ? "rotateOnce 0.6s linear" : "none",
                                    }}
                                >
                                    {btn.icon}
                                </span>
                            </div>

                            {/* Text + link button (only when expanded) */}
                            {hoveredIndex === index && (
                                <a
                                    href={btn.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="py-[0.5vw] ml-[0.7vw] mr-0 text-[1.3vw] text-white truncate"
                                >
                                    {btn.text}
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile version (hidden on desktop) */}
            <div className="flex sm:hidden fixed right-0  top-[95vw] -translate-y-1/2 z-[99999] pointer-events-auto space-y-[0vw] flex-col items-end">
                {buttons.map((btn, index) => (
                    <div
                        key={index}
                        className="group cursor-pointer"
                        onMouseEnter={() =>
                            window.innerWidth >= 640 && setHoveredIndex(index)
                        }
                        onMouseLeave={() =>
                            window.innerWidth >= 640 && setHoveredIndex(null)
                        }
                        onClick={() => {
                            if (window.innerWidth < 640) {
                                setHoveredIndex((prev) => (prev === index ? null : index));
                            }
                        }}
                    >
                        <div
                            className={`flex items-center rounded-l-full text-white shadow-md transition-all duration-300 ${btn.bg}
              ${hoveredIndex === index ? "w-[40vw] translate-x-[-0vw]" : "w-[15vw] translate-x-0"} 
              ${hoveredIndex === index ? "w-[40vw] translate-x-[-0vw]" : "w-[0vw] translate-x-0"
                                }`}
                        >
                            {/* Icon button */}
                            <div
                                className=" w-[13vw] h-[13vw] flex justify-center items-center rounded-full bg-indigo-500 text-white transition-transform p-[5vw]"
                                style={{
                                    boxShadow: "4px 0 6px -1px rgba(0,0,0,0.3)",
                                }}
                            >
                                <span
                                    className="transition-transform "
                                    style={{
                                        animation:
                                            hoveredIndex === index ? "rotateOnce 0.6s linear" : "none",
                                    }}
                                >
                                    {btn.iconMobile}
                                </span>
                            </div>

                            {/* Text + link button (only when expanded) */}
                            {hoveredIndex === index && (
                                <a
                                    href={btn.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="py-[0.5vw] ml-[0vw] mr-[0.6vw] text-[4.3vw] text-white truncate"
                                >
                                    {btn.text}
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
