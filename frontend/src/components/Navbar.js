import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    return (
        <div className="navbar">
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/services">Services</Link>
                <Link to="/calculator">Calculator</Link>
                <Link to="/history">History</Link>
                <Link to="/favorites">⭐ Favorites</Link>

            </div>
        </div>
    );
}

export default Navbar;