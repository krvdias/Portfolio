import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, ChevronRight } from 'lucide-react';

interface Experience {
  role: string;
  company: string;
  period: string;
  type: 'full-time' | 'intern';
  highlights: string[];
  tags: string[];
}

const experiences: Experience[] = [
  {
    role: 'Associate Software Engineer',
    company: 'CygnusOne (Pvt) Ltd',
    period: '2026 March – Present',
    type: 'full-time',
    highlights: [
      'Developing and customising Odoo ERP modules as an Odoo developer.',
      'Working across 5–6 live client projects simultaneously.',
      'Building frontend components with OWL.js within the Odoo framework.',
    ],
    tags: ['Odoo', 'Python', 'XML', 'PostgreSQL', 'OWL.js'],
  },
  {
    role: 'Software Engineer Intern',
    company: 'CygnusOne (Pvt) Ltd',
    period: '2025 October – 2026 February',
    type: 'intern',
    highlights: [
      'Worked as an Odoo developer on 2–3 projects.',
      'Learned XML and Python-based Odoo addon creation.',
      'Gained hands-on experience with ERP module customisation.',
    ],
    tags: ['Odoo', 'Python', 'XML', 'PostgreSQL'],
  },
  {
    role: 'Software Engineer Intern',
    company: 'K D Enterprises (Pvt) Ltd',
    period: '2025 January – 2025 July',
    type: 'intern',
    highlights: [
      'Worked as a full-stack developer across 5 production sites.',
      'Integrated PayHere payment gateway and Cloudflare R2 / AWS S3 storage.',
      'Researched and implemented Google Meet generation via Google Calendar APIs.',
      'Built WhatsApp chatbots using WhatsAppWeb.js.',
      'Gained experience with RabbitMQ for message queuing.',
    ],
    tags: ['React', 'TypeScript', 'Next.js', 'Node.js', 'MySQL'],
  },
];

const typeBadge: Record<Experience['type'], { label: string; className: string }> = {
  'full-time': {
    label: 'Full-time',
    className: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  },
  intern: {
    label: 'Internship',
    className: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
  },
};

const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="py-20 px-4 md:px-10 bg-white dark:bg-black">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Work Experience.
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            My professional journey — from full-stack web development to Odoo ERP engineering.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-purple-500 to-transparent hidden sm:block" />

          <div className="flex flex-col gap-10">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative flex gap-6 sm:gap-10"
              >
                {/* Icon dot */}
                <div className="hidden sm:flex flex-shrink-0 items-start pt-1">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg z-10">
                    <Briefcase className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Card */}
                <div className="flex-1 p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-sm hover:shadow-md">
                  {/* Header row */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{exp.role}</h3>
                      <p className="text-blue-600 dark:text-blue-400 font-semibold mt-0.5">{exp.company}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeBadge[exp.type].className}`}>
                        {typeBadge[exp.type].label}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {exp.period}
                      </span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <ul className="mb-5 space-y-2">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <ChevronRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
