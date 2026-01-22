import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import imagePath from "./assets/graphics.png";

import Home from "./components/Home";
import Login from "./components/Login";
import Gallery from "./components/Gallery";
import AboutUs from "./components/AboutUs";
import PhotographerPage from "./components/PhotographerPage";
import Profile from "./components/Profile";
import ExhibitionDetail from "./components/ExhibitionDetail";
import './App.css';

import { NavBarPropsI } from "./models/NavBarProps";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem('auth_token'));
    };

    window.addEventListener('authChange', handleAuthChange);

    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  const navItems = [
    { name: "Home", path: '/' },
    { name: isLoggedIn ? "Profile" : "Login", path: isLoggedIn ? '/profile' : '/login' },
    { name: "Gallery", path: '/components/Gallery' },
    { name: "About Us", path: '/components/AboutUs' },
  ];

  const navBarProps: NavBarPropsI = {
    imageSrcPath: imagePath,
    navItems: navItems,
    handleMenuToggle: () => {},
    isMenuOpen: false
  };

  return (
    <Router>
      <div id="root">
        <NavBar {...navBarProps} />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/components/Gallery" element={<Gallery />} />
            <Route path="/components/AboutUs" element={<AboutUs />} />
            <Route path="/photographer/:username" element={<PhotographerPage />} />
            <Route path="/exhibitions/:id" element={<ExhibitionDetail />} />
          </Routes>
        </div>
        <footer className="footer">
          &copy; All rights reserved. Pixel Museum ~
        </footer>
      </div>
    </Router>
  );
}

export default App;
