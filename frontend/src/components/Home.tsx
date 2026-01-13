
import { useEffect} from "react";
import homeImage from '../images/home_transparent_strict.png'; 
import './Home.css';


const Home: React.FC = () => { 

    useEffect(() => {
            document.title = 'Home';
        }, []);

    return (
        <div>
            <div className="home-container"> 
                <div className="text-container"> 
                    <p className="prvi">Pixel Museum</p> 
                    <p>Experience gallery sighting from the comfort of your home!</p> 
                </div>
                <img src={homeImage} alt="Home" className="home-image" /> 
            </div>
        </div>
    );
};

export default Home; 