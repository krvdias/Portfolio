import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Users, BookOpen } from 'lucide-react';
import { my } from '../assets/images/index';

interface GithubStats {
  public_repos: number;
  followers: number;
  following: number;
}

const HeroSection: React.FC = () => {
  const [stats, setStats] = useState<GithubStats | null>(null);

  useEffect(() => {
    fetch('https://api.github.com/users/krvdias')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to fetch github stats', err));
  }, []);

  return (
    <section className="relative pt-32 pb-20 px-4 md:px-10 max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-12 min-h-screen">
      
      {/* Text Content */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-left z-10"
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white leading-none tracking-tighter mb-2">
          VISHAN
        </h1>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-6">
          DIAS
        </h1>
        
        <div className="flex flex-col gap-2 mb-8 text-lg md:text-2xl font-medium text-gray-600 dark:text-gray-300">
          <p>Associate Software Engineer</p>
          <p>Graphic Designer</p>
        </div>

        {/* Social Links */}
        <div className="flex gap-4 mb-12">
          <a href="https://github.com/krvdias" target="_blank" rel="noreferrer" className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white">
            <Github className="w-6 h-6" />
          </a>
          <a href="https://linkedin.com/in/vishan-dias-2b4b92213" target="_blank" rel="noreferrer" className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-blue-700 dark:text-blue-400">
            <Linkedin className="w-6 h-6" />
          </a>
        </div>

        {/* Dynamic Stats */}
        {stats && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex gap-8 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm"
          >
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white mb-1">
                <BookOpen className="w-5 h-5 text-blue-500" />
                {stats.public_repos}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Repositories</span>
            </div>
            
            <div className="w-px bg-gray-200 dark:bg-gray-800"></div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white mb-1">
                <Users className="w-5 h-5 text-purple-500" />
                {stats.followers}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Followers</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Image */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-1/2 flex justify-center lg:justify-end z-10"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full blur-3xl opacity-30 dark:opacity-40 animate-pulse"></div>
          <div 
            className="relative w-64 h-64 md:w-96 md:h-96 rounded-full border-4 border-white dark:border-gray-800 shadow-2xl bg-cover bg-center overflow-hidden z-10"
            style={{ backgroundImage: `url(${my})` }}
          ></div>
        </div>
      </motion.div>
      
    </section>
  );
};

export default HeroSection;
