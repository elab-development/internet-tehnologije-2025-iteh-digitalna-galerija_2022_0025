import { useState } from "react";
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
import './App.css';

import { NavBarPropsI } from "./models/NavBarProps";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  const handleLoginSuccess = (username: string) => {
    setIsLoggedIn(true);
    setLoggedInUser(username);
  };

  const navItems = [
    { name: "Home", path: '/' },
    { name: "Profile", path: '/profile' },
    { name: isLoggedIn ? "Profile" : "Login", path: isLoggedIn ? `/photographer/${loggedInUser}` : '/components/Login' },
    { name: "Gallery", path: '/components/Gallery' },
    { name: "AboutUs", path: '/components/AboutUs' },
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
            <Route path="/components/Login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/components/Gallery" element={<Gallery />} />
            <Route path="/components/AboutUs" element={<AboutUs />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="photographer/:name" element={<PhotographerPage />} />
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
