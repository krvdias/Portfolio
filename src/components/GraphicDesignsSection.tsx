import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolioData } from '../contexts/PortfolioDataContext';

const GraphicDesignsSection: React.FC = () => {
  const { data } = usePortfolioData();
  const designs = data.graphicDesigns;

  return (
    <section className="py-20 px-4 md:px-10 bg-gray-50 dark:bg-black/50 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">Graphic Designs.</h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A showcase of my creative side, including logo design and social media posts.
          </p>
        </motion.div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {designs.map((design, index) => (
            <motion.div
              key={design.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="break-inside-avoid overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-800 group relative"
            >
              <img
                src={design.src}
                alt={design.alt}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-medium text-lg px-4 py-2 bg-black/50 rounded-lg backdrop-blur-sm">
                  {design.alt}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GraphicDesignsSection;
