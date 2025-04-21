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

        {/* 1st Section */}
        <div id="home" className="container max-w-screen-xl mx-auto px-4 md:px-10 py-10 text-center flex-grow">
            <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 mb-8">
                {/* Text Block */}
                <div className="w-full lg:w-1/3 flex flex-col justify-start items-center lg:items-end text-center lg:text-right mt-6 lg:mt-0">
                    <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold text-white">VISHAN</h1>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-stroke-white">DIAS</h1>
                    <h4 className="text-lg md:text-xl lg:text-2xl font-bold text-white">software engineer intern</h4>
                    <h4 className="text-lg md:text-xl lg:text-2xl font-bold text-white">graphic designer</h4>
                </div>

                {/* Image */}
                <div className="w-full lg:w-2/3 flex justify-center lg:justify-end">
                    <div
                        className="w-64 h-64 md:w-[350px] md:h-[350px] lg:w-[450px] lg:h-[450px] rounded-full border-4 border-white bg-cover bg-center"
                        style={{ backgroundImage: `url(${Myimage})` }}
                    ></div>
                </div>
            </div>
        </div>

        {/* 2nd Section - About */}
        <div className="bg-white py-10 px-4 md:px-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold">About Me.</h1>

            <div className="mt-8 md:mt-10 max-w-4xl mx-auto px-2">
                <p className="text-lg md:text-2xl">Passionate software developer with hands-on experience in full-stack web development and application engineering.
                    Currently expanding my expertise in modern frameworks while building robust solutions across multiple platforms.
                </p>
            </div>

            <div className="mt-10">
                <h3 className="text-2xl md:text-3xl font-semibold">Technical Proficiencies</h3>
            </div>

            <div className="mt-8 md:mt-10 max-w-4xl mx-auto text-left text-lg md:text-2xl">
                <ul className="space-y-3">
                    <li><span className="font-semibold">Frontend:</span> HTML5, CSS3, JavaScript, ReactJS</li>
                    <li><span className="font-semibold">Backend:</span> PHP, Python, Node.js, Laravel, WordPress</li>
                    <li><span className="font-semibold">Databases:</span> SQL, MySQL</li>
                    <li><span className="font-semibold">Languages:</span> Java, C++, C#, Python</li>
                    <li><span className="font-semibold">Mobile:</span> Android Development (Java)</li>
                </ul>
            </div>
        </div>

        {/* 3rd Section - What I Do */}
        <div className="py-10 px-4 md:px-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white">What I Do.</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 md:mt-20 mb-10 md:mb-20">
                {cards.map((card) => (
                    <div
                        key={card.id}
                        className="relative w-full h-[180px] sm:h-[200px] rounded-3xl overflow-hidden shadow-lg transition-transform transform hover:scale-105 cursor-pointer flex items-center justify-center"
                        style={{
                            backgroundImage: `url(${card.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                        onClick={() => handleCardClick(card)}
                    >
                        <div className="absolute inset-0 bg-black opacity-70"></div>
                        <div className="relative">
                            <h2 className="text-white text-xl md:text-2xl font-bold">{card.name}</h2>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Footer */}
        <Footer />
    </div>

    );
};

export default HomePage;