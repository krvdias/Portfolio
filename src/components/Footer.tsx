import React from "react";
import { github, facebook, linkedin, whatsapp } from "../assets/icons/index";
import Image2 from "../assets/images/contact.png";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-lg relative z-[100]">
      <div className="max-w-screen-3xl mx-auto text-center">
        
        <div className="flex items-center justify-center mt-8">
          <h1 className="text-5xl font-bold">Contact Me.</h1>
        </div>

        <div className="flex flex-col-reverse lg:flex-row items-center justify-between">
          {/* Left Side Image - aligned to left corner with no padding */}
          <div className="w-full lg:w-1/2 flex justify-start items-start">
            <img src={Image2} alt="Image2" className="max-w-[500px] lg:max-w-[400px]" />
          </div>

          {/* Right Side Social Icons */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start space-x-6 lg:space-x-12 mt-15 lg:mt-0 sm:mb-10 sm:mt-10">
            <a href="https://wa.me/94783764730" target="_blank" rel="noopener noreferrer">
              <img src={whatsapp} alt="WhatsApp" className="h-15 sm:h-20" />
            </a>
            <a href="https://github.com/krvdias" target="_blank" rel="noopener noreferrer">
              <img src={github} alt="Github" className="h-15 sm:h-20" />
            </a>
            <a href="https://web.facebook.com/krv.dias" target="_blank" rel="noopener noreferrer">
              <img src={facebook} alt="Facebook" className="h-15 sm:h-20" />
            </a>
            <a href="https://www.linkedin.com/in/vishan-dias-2b4b92213" target="_blank" rel="noopener noreferrer">
              <img src={linkedin} alt="Linkedin" className="h-15 sm:h-20" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
