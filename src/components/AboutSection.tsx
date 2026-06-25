import React from 'react';
import { motion } from 'framer-motion';
import { Code, Database, Layout, Smartphone } from 'lucide-react';

const skills = [
  { icon: <Layout className="w-6 h-6" />, title: "Frontend", desc: "HTML5, CSS3, JavaScript, ReactJS" },
  { icon: <Database className="w-6 h-6" />, title: "Backend", desc: "PHP, Python, Node.js, Laravel, WordPress" },
  { icon: <Code className="w-6 h-6" />, title: "Languages", desc: "Java, C++, C#, Python, SQL" },
  { icon: <Smartphone className="w-6 h-6" />, title: "Mobile", desc: "Android Development (Java, Kotlin), Flutter" }
];

const AboutSection: React.FC = () => {
  return (
    <section className="py-20 px-4 md:px-10 bg-gray-50 dark:bg-black/50 border-y border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">About Me.</h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Passionate software developer with hands-on experience in full-stack web development and application engineering.
            Currently expanding my expertise in modern frameworks while building robust solutions across multiple platforms.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                {skill.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{skill.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{skill.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
