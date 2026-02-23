import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { NavBarPropsI } from "../models/NavBarProps";
import "../App.css";


function NavBar({ imageSrcPath, navItems }: NavBarPropsI) {
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    const handleMenuToggle = () => {
        setMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar navbar-expand-md navbar-purple shadow">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">
                    <img
                        src={imageSrcPath}
                        width="60"
                        height="60"
                        className="d-inline-block align-center"
                        alt="Logo"
                    />
                </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={handleMenuToggle}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className={`collapse navbar-collapse ${
                        isMenuOpen ? "show" : ""
                    }`}
                >
                    <ul className="navbar-nav me-auto mb-2 mb-md-1">
                        {navItems.map((item, index) => (
                            <li
                                key={item.path}
                                className="nav-item"
                                onClick={() => setSelectedIndex(index)}
                            >
                                <Link
                                    className={`nav-link ${
                                        selectedIndex === index
                                            ? "active fw-bold"
                                            : ""
                                    }`}
                                    to={item.path}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <button className="dark-mode-button" onClick={toggleDarkMode}>
                        {darkMode ? "Change to Light Mode" : "Change to Dark Mode"}
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
