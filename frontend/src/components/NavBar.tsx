import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { NavBarPropsI } from "../models/NavBarProps";
import "./NavBar.css"; 

const NavBar: React.FC<NavBarPropsI> = ({ imageSrcPath, navItems }) => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    // Dark mode toggler
    const toggleDarkMode = () => setDarkMode(!darkMode);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark-mode");
            document.body.classList.remove("light-mode");
        } else {
            document.body.classList.add("light-mode");
            document.body.classList.remove("dark-mode");
        }
    }, [darkMode]);

    // Toggle mobile menu
    const handleMenuToggle = () => setMenuOpen(!isMenuOpen);

    return (
        <nav className="navbar navbar-expand-md navbar-purple shadow">
            <div className="container-fluid">
                {/* Logo */}
                <NavLink to="/" className="navbar-brand">
                    <img
                        src={imageSrcPath}
                        width="60"
                        height="60"
                        className="d-inline-block align-center"
                        alt="Logo"
                    />
                </NavLink>

                {/* Hamburger button */}
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={handleMenuToggle}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Menu items */}
                <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}>
                    <ul className="navbar-nav me-auto mb-2 mb-md-1">
                        {navItems.map((item) => (
                            <li key={item.path} className="nav-item">
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        isActive ? "nav-link active fw-bold" : "nav-link"
                                    }
                                    end={item.path === '/'} // Home tačno za '/'
                                >
                                    {item.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    {/* Dark mode toggle button */}
                    <button className="dark-mode-button" onClick={toggleDarkMode}>
                        {darkMode ? "Light Mode" : "Dark Mode"}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
