import { useLocation, useNavigate } from 'react-router-dom'; 
import { X } from "lucide-react";
import Footer from "../components/Footer";
import front from "../assets/images/frontend.jpg";
import back from "../assets/images/backend.jpg";
import {logo1,logo2,logo3,logo4,post1,post2,post3,post4,post5,post6,post7,post8,post9} from "../assets/images/posts/index.ts";

const projects = [
    {id: 1, name: 'Sales Management System', description: 'web application', link: 'https://github.com/krvdias/sales_management_system', card_id: 1, image: front},
    {id: 2, name: 'Auto Mobile System', description: 'web application', link: 'https://github.com/krvdias/Auto-Wizard', card_id: 1, image: front},
    {id: 3, name: 'Library Managememt System', description: 'web application', link: 'https://github.com/krvdias/Library-Management-System', card_id: 1, image: front},
    {id: 4, name: 'Expence Tracker System', description: 'standalone app', link: 'https://github.com/krvdias/ExpenceTrackingSystem', card_id: 1, image: front},
    {id: 5, name: 'Portfolio', description: '', link: 'https://www.figma.com/design/ncbpZoEpmk1oS8P1SpG9xj/Portfolio?node-id=0-1&t=NC4BsMHdrWhVuxtP-1', card_id: 2, image:back},
    {id: 6, name: 'Memora App', description: '', link: 'https://www.figma.com/design/u2pbWssXfs50rEA0VyWt2g/HCI-Project?node-id=0-1&t=afGPvXYPPIvlj3R3-1', card_id: 2, image: back},
    {id: 7, name: 'Library Management System', description: '', link: 'https://www.figma.com/design/yXKd0MBxdyIRiD9SsaWbCo/Library-Management-System?t=afGPvXYPPIvlj3R3-1', card_id: 2, image: back},
    {id: 8, name: '', description: '', link: '', card_id: 3, image: post1},
    {id: 9, name: '', description: '', link: '', card_id: 3, image: post2},
    {id: 10, name: '', description: '', link: '', card_id: 3, image: post3},
    {id: 11, name: '', description: '', link: '', card_id: 3, image: post4},
    {id: 12, name: '', description: '', link: '', card_id: 3, image: post5},
    {id: 13, name: '', description: '', link: '', card_id: 3, image: post6},
    {id: 14, name: '', description: '', link: '', card_id: 3, image: post7},
    {id: 15, name: '', description: '', link: '', card_id: 3, image: post8},
    {id: 16, name: '', description: '', link: '', card_id: 3, image: post9},
    {id: 17, name: '', description: '', link: '', card_id: 3, image: logo1},
    {id: 18, name: '', description: '', link: '', card_id: 3, image: logo2},
    {id: 19, name: '', description: '', link: '', card_id: 3, image: logo3},
    {id: 19, name: '', description: '', link: '', card_id: 3, image: logo4}
];

interface Card {
    id: number;
    name: string;
    image: string;
}

const ProjectView = () => {
    const location = useLocation();
    const navigate = useNavigate(); 
    const { cards } = location.state || {} as { cards: Card };

    const filteredProjects = projects.filter(project => project.card_id === cards.id);

    const handleExit = () => {
        navigate("/");
    };

    return (
        <div className="flex flex-col min-h-screen bg-black no-select">
            {/* Header Section with Card Image */}
            <div
                className="relative flex items-center justify-start bg-cover bg-center z-2"
                style={{
                    backgroundImage: `url(${cards.image})`,
                    backgroundSize: "cover",
                    height: "400px",
                }}
            >
                <div className="absolute inset-0 bg-black opacity-80"></div>

                {/* Exit Button */}
                <button
                    className="absolute top-4 right-4 bg-white-800 text-white p-2 rounded-full hover:bg-gray-700 transition z-[10]"
                    onClick={handleExit}
                >
                    <X size={24} />
                </button>

                <div className="relative p-4 lg:p-15 text-white">
                    <h1 className="text-2xl lg:text-5xl font-bold text-white ml-4 lg:ml-8">
                        {cards.name}
                    </h1>
                    <h1 className="text-xl lg:text-3xl font-bold text-white ml-4 lg:ml-8 mt-2 lg:mt-4">
                        {filteredProjects?.length} Projects
                    </h1>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="container mx-auto px-10 md:px-15 sm:px-6 py-10 sm:py-16 md:py-20 flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project) => (
                        cards.id === 3 ? (
                            <div
                              key={project.id}
                              className="w-full h-full rounded-xl overflow-hidden shadow-md"
                            >
                              <img
                                src={project.image}
                                alt="Project"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div
                                key={project.id}
                                className="relative w-full h-[250px] rounded-4xl overflow-hidden shadow-lg transition-transform transform hover:scale-105 group flex items-center justify-center"
                                style={{ 
                                    backgroundImage: `url(${project?.image})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black opacity-70 "></div>
                                    <div className="relative transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex flex-col items-center">
                                        <h3 className="text-2xl font-bold text-white mb-2">{project?.name}</h3>
                                        <p className="text-gray-300 mb-4">{project?.description}</p>
                                        {project.link && (
                                            <a 
                                                href={project?.link} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-block px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 transition"
                                            >
                                                View Project
                                            </a>
                                        )}
                                    </div>
                            </div>
                          )
                    ))}
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ProjectView;