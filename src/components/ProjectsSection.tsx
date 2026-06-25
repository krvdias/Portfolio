import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Code2, ExternalLink } from 'lucide-react';

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
}

const ProjectsSection: React.FC = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.github.com/users/krvdias/repos?sort=updated&per_page=10')
      .then(res => res.json())
      .then((data: Repo[]) => {
        // Filter out repos without descriptions or forks, then take the top 5
        const validRepos = data.filter(r => r.description).slice(0, 5);
        
        // Add the private Tithr project manually
        const tithrProject: Repo = {
          id: 9999999,
          name: "Tithr Church Management System",
          description: "A comprehensive church management application featuring member tracking, donations, and event scheduling. Built as a private proprietary system.",
          html_url: "https://linkedin.com/in/vishan-dias-2b4b92213",
          language: "Flutter",
          stargazers_count: 0
        };

        setRepos([tithrProject, ...validRepos]);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch repos', err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-20 px-4 md:px-10 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-10 text-center text-gray-900 dark:text-white">
          Latest Projects.
        </h2>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repos.map((repo, idx) => (
            <motion.a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="block p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <Code2 className="w-8 h-8 text-blue-500" />
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white line-clamp-1">
                {repo.name.replace(/[-_]/g, ' ')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                {repo.description}
              </p>
              <div className="flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                {repo.language && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {repo.stargazers_count}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProjectsSection;
