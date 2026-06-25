import React from 'react';
import LandingHeader from "../components/LandingHeader";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import ProjectsSection from "../components/ProjectsSection";
import GraphicDesignsSection from "../components/GraphicDesignsSection";

const HomePage: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-black transition-colors duration-300">
            {/* Navbar */}
            <LandingHeader />

            {/* Main Content Sections */}
            <main className="flex-grow">
                {/* 1st Section - Hero */}
                <HeroSection />

                {/* 2nd Section - About */}
                <AboutSection />

                {/* 3rd Section - Dynamic Projects */}
                <ProjectsSection />

                {/* 4th Section - Graphic Designs */}
                <GraphicDesignsSection />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default HomePage;