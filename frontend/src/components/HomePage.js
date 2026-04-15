import React from "react";
import "./HomePage.css";
import bg from "./home4.jpg";   // ✅ import image

function HomePage() {
    return (
        <div
            className="home"
            style={{ backgroundImage: `url(${bg})` }}
        >
            <div className="home-content">
                <h1>Construction Cost of Private Houses</h1>
                <p>
                    Planning to build your private house?
                    Use our cost estimator to budget effectively!
                </p>
            </div>
        </div>
    );
}

export default HomePage;