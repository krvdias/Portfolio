import React from 'react';
import LandingHeader from "../components/LandingHeader";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import ProjectsSection from "../components/ProjectsSection";
import GraphicDesignsSection from "../components/GraphicDesignsSection";
import ChatSection from "../components/ChatSection";

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

                {/* 3rd Section - Work Experience */}
                <ExperienceSection />

                {/* 4th Section - Dynamic Projects */}
                <ProjectsSection />

                {/* 5th Section - Graphic Designs */}
                <GraphicDesignsSection />
            </main>

            {/* Footer */}
            <Footer />

            {/* Floating Chat Widget — fixed bottom-right, above everything */}
            <ChatSection />
        </div>
    );
};

export default HomePage;