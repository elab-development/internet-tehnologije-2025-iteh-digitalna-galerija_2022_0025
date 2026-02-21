
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import homeImage from '../images/home_transparent_strict.png'; 
import './Home.css';
import WeatherWidget from "./WeatherWidget";

const Home: React.FC = () => { 
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Home';
    }, []);

    return (
        <div className="home-wrapper">
            <div className="home-container"> 
                <div className="text-container"> 
                    <h1 className="prvi">Pixel Museum</h1> 
                    <p className="home-description">
                        Experience gallery sighting from the comfort of your home!
                    </p> 
                    <button className="redirect-btn" onClick={() => navigate('/components/Gallery')}>
                        View Gallery
                    </button>
                </div>
                <img src={homeImage} alt="Home" className="home-image" /> 
            </div>
            {/* Weather widget fixed at bottom right */}
            <div className="weather-widget-fixed">
                <WeatherWidget />
            </div>
        </div>
    );
};

export default Home;