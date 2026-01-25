import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { NavBarPropsI } from "../models/NavBarProps";
import "./NavBar.css"; 

const NavBar: React.FC<NavBarPropsI> = ({ imageSrcPath, navItems }) => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdminStatus = () => {
            const userRole = localStorage.getItem("user_role");
            console.log("Checking admin status, user_role:", userRole);
            setIsAdmin(userRole === "admin");
        };

        // Ako je korisnik ulogovan a nema role, fetchuj user podatke
        const fetchUserRoleIfNeeded = async () => {
            const token = localStorage.getItem("auth_token");
            const role = localStorage.getItem("user_role");
            
            if (token && !role) {
                console.log("Fetching user to get role...");
                try {
                    const res = await fetch("http://localhost:8000/api/user", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        },
                    });
                    if (res.ok) {
                        const userData = await res.json();
                        console.log("User data received, role:", userData.role);
                        localStorage.setItem("user_role", userData.role || "guest");
                        checkAdminStatus();
                    }
                } catch (err) {
                    console.error("Error fetching user:", err);
                }
            } else {
                checkAdminStatus();
            }
        };

        // Proverava odmah pri montiranju
        fetchUserRoleIfNeeded();

        // Slušaj authChange event
        window.addEventListener("authChange", fetchUserRoleIfNeeded);
        
        // Slušaj sve promene u localStorage
        window.addEventListener("storage", fetchUserRoleIfNeeded);

        // Postavi interval za redovnu proveru svakih 1s
        const interval = setInterval(fetchUserRoleIfNeeded, 1000);

        return () => {
            window.removeEventListener("authChange", fetchUserRoleIfNeeded);
            window.removeEventListener("storage", fetchUserRoleIfNeeded);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark-mode");
            document.body.classList.remove("light-mode");
        } else {
            document.body.classList.add("light-mode");
            document.body.classList.remove("dark-mode");
        }
    }, [darkMode]);

    // Dark mode toggler
    const toggleDarkMode = () => setDarkMode(!darkMode);

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
                        {isAdmin && (
                            <li className="nav-item">
                                <NavLink
                                    to="/admin/dashboard"
                                    className={({ isActive }) =>
                                        isActive ? "nav-link active fw-bold admin-link" : "nav-link admin-link"
                                    }
                                >
                                    📊 Admin Panel
                                </NavLink>
                            </li>
                        )}
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
