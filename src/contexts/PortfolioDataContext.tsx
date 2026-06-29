import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface PortfolioData {
  hero: {
    firstName: string;
    lastName: string;
    roles: string[];
    githubUrl: string;
    linkedinUrl: string;
  };
  about: {
    description: string;
  };
  experience: {
    role: string;
    company: string;
    period: string;
    type: 'full-time' | 'intern';
    highlights: string[];
    tags: string[];
  }[];
  projects: {
    title: string;
    description: string;
    link: string;
    language?: string;
  }[];
  graphicDesigns: {
    id: number;
    src: string;
    alt: string;
  }[];
}

const IMAGE_URL = import.meta.env.VITE_CLOUDFLARE_IMAGE;

export const defaultPortfolioData: PortfolioData = {
  hero: {
    firstName: "VISHAN",
    lastName: "DIAS",
    roles: ["Associate Software Engineer", "Graphic Designer"],
    githubUrl: "https://github.com/krvdias",
    linkedinUrl: "https://linkedin.com/in/vishan-dias-2b4b92213"
  },
  about: {
    description: "Associate Software Engineer at CygnusOne, specialising in Odoo ERP development using Python, XML, and PostgreSQL. Previously worked as a full-stack developer with React, Next.js, TypeScript, and Node.js. Final-year BSc IT undergraduate at BCI Campus, graduating August 2026."
  },
  experience: [
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
    }
  ],
  projects: [
    {
      title: "Tithr Church Management System",
      description: "A comprehensive church management application featuring member tracking, donations, and event scheduling. Built as a private proprietary system.",
      link: "https://linkedin.com/in/vishan-dias-2b4b92213",
      language: "Flutter"
    }
  ],
  graphicDesigns: [
    { id: 1, src: `${IMAGE_URL}/images/posts/post1.png`, alt: "Design 1" },
    { id: 2, src: `${IMAGE_URL}/images/posts/post2.jpg`, alt: "Design 2" },
    { id: 3, src: `${IMAGE_URL}/images/posts/logo1.jpg`, alt: "Logo 1" },
    { id: 4, src: `${IMAGE_URL}/images/posts/post3.png`, alt: "Design 3" },
    { id: 5, src: `${IMAGE_URL}/images/posts/logo2.png`, alt: "Logo 2" },
    { id: 6, src: `${IMAGE_URL}/images/posts/post4.jpg`, alt: "Design 4" },
    { id: 7, src: `${IMAGE_URL}/images/posts/post5.png`, alt: "Design 5" },
    { id: 8, src: `${IMAGE_URL}/images/posts/logo3.jpg`, alt: "Logo 3" },
    { id: 9, src: `${IMAGE_URL}/images/posts/post6.png`, alt: "Design 6" },
    { id: 10, src: `${IMAGE_URL}/images/posts/post7.jpg`, alt: "Design 7" },
    { id: 11, src: `${IMAGE_URL}/images/posts/logo4.png`, alt: "Logo 4" },
    { id: 12, src: `${IMAGE_URL}/images/posts/post8.png`, alt: "Design 8" },
    { id: 13, src: `${IMAGE_URL}/images/posts/post9.png`, alt: "Design 9" },
  ]
};

interface PortfolioContextProps {
  data: PortfolioData;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextProps>({
  data: defaultPortfolioData,
  isLoading: true,
  refreshData: async () => {}
});

export const usePortfolioData = () => useContext(PortfolioContext);

// Change this to your deployed worker URL when ready, or leave empty if served from the same domain
export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8787';

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/api/portfolio-data`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setData(json.data as PortfolioData);
        }
      }
    } catch (error) {
      console.error("Failed to fetch portfolio data, using defaults", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Visitor Tracking
  useEffect(() => {
    fetch(`${API_URL}/api/visit`, { method: 'POST' }).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PortfolioContext.Provider value={{ data, isLoading, refreshData: fetchData }}>
      {children}
    </PortfolioContext.Provider>
  );
};
