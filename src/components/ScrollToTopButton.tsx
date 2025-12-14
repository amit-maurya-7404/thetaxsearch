
"use client";
import { useEffect, useState } from "react";
import { FaAngleUp } from "react-icons/fa6";

const ScrollToTopButton = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisible = () => {
            setVisible(window.scrollY > 300);
        };

        window.addEventListener("scroll", toggleVisible);
        return () => window.removeEventListener("scroll", toggleVisible);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 z-50 p-3 rounded-lg bg-teal-600 text-white border-2 border-white shadow-lg transition-opacity duration-300 
  ${visible ? "opacity-100" : "opacity-0"} glow-bounce hover:animate-none`}
            aria-label="Scroll to top"
        >
        <FaAngleUp size={20}/>
        </button>

    );
};

export default ScrollToTopButton;
