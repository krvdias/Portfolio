import LandingHeader from "../components/LandingHeader";
import Footer from "../components/Footer";
import Myimage from "../assets/images/my.jpg";
import front from "../assets/images/frontend.jpg";
import back from "../assets/images/backend.jpg";
import graphic from "../assets/images/graphic.jpeg";
import { useNavigate } from "react-router-dom";

const cards = [
    {id: 1, name: 'Frontend & Backend Development', image: front},
    {id: 2, name: 'UI / UX Design', image: back},
    {id: 3, name: 'Graphic & Logo Design', image: graphic},
];

const HomePage = () => {
    const navigate = useNavigate(); 

    const handleCardClick = (cards: { id: number; name: string; image: string; }) => {
        navigate('/projectview', { state: { cards } });
    };

    return (
        <div className="flex flex-col min-h-screen bg-black">

            {/* Navbar */}
            <LandingHeader />

            {/* 1st section */}
            <div id="home" className="container max-w-screen-xl mx-auto px-10 py-10 text-center flex-grow">
                <div className="flex flex-col lg:flex-row items-center justify-between mb-8">

                    <div className="w-full lg:w-1/3 flex flex-col justify-start items-end">
                        <h1 className="text-8xl font-bold text-white">VISHAN</h1>
                        <h1 className="text-7xl font-bold text-stroke-white">DIAS</h1>
                        <h4 className="text-2xl font-bold text-white">software engineer intern</h4>
                        <h4 className="text-2xl font-bold text-white">graphic designer</h4>
                    </div>

                    <div className="w-full lg:w-2/3 flex flex-col justify-start items-end">
                        <div className="w-[450px] h-[450px] rounded-full border-4 border-white" style={{
                            backgroundImage: `url(${Myimage})`,
                            backgroundSize: "cover",
                            height: "450px",
                        }}></div>
                    </div>
                </div>
            </div>

            {/* 2nd section */}
            <div className="bg-white py-10 px-15 text-center">
                <div className="flex items-center justify-center">
                    <h1 className="text-5xl font-bold">About Me.</h1>
                </div>
                
                <div className="flex items-center justify-center px-45 mt-10">
                <p className="text-2xl">Passionate software developer with hands-on experience in full-stack web development and application engineering.
                Currently expanding my expertise in modern frameworks while building robust solutions across multiple platforms.</p>
                </div>
                
                <div className="flex items-center justify-center mt-10">
                    <h3 className="text-3xl font-semibold">Technical Proficiencies</h3>
                </div>

                <div className="flex items-start justify-start mt-10 px-40">
                    <ul className="text-2xl space-y-2">
                        <li className="flex">
                        <span className="w-50 font-semibold">Frontend:</span>
                        <span>HTML5, CSS3, JavaScript, ReactJS</span>
                        </li>
                        <li className="flex">
                        <span className="w-50 font-semibold">Backend:</span>
                        <span>PHP, Python, Node.js, Laravel, WordPress</span>
                        </li>
                        <li className="flex">
                        <span className="w-50 font-semibold">Databases:</span>
                        <span>SQL, MySQL</span>
                        </li>
                        <li className="flex">
                        <span className="w-50 font-semibold">Languages:</span>
                        <span>Java, C++, C#, Python</span>
                        </li>
                        <li className="flex">
                        <span className="w-50 font-semibold">Mobile:</span>
                        <span>Android Development (Java)</span>
                        </li>
                    </ul>
                </div>

            </div>

            {/* 3rd section */}
            <div className="py-10 px-15 text-center">
                <div className="flex items-center justify-center">
                    <h1 className="text-5xl font-bold text-white">What I Do.</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20 mb-20 px-40">
                    {cards.map((card) => (
                    <div
                        key={card.id}
                        className="relative w-full h-[200px] rounded-4xl overflow-hidden shadow-lg transition-transform transform hover:scale-105"
                        style={{
                        backgroundImage: `url(${card.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        }}
                        onClick={() => handleCardClick(card)}
                    >
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black opacity-60 flex items-center justify-center">
                            <div className="relative p-5 text-white">
                                <h2 className="text-white text-2xl font-bold">{card.name}</h2>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    )
}

export default HomePage;