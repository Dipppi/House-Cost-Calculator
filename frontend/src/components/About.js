import React from 'react';
import './About.css'; 

const About = () => {
    return (
        <div className="about-container">
            <h1 className="about-heading">ABOUT US</h1>
            <div className="about-header">
                <img src="/construction-bg.jpeg" alt="Construction" className="about-image" />
                <p className="about-paragraph">
                    Welcome to the House Construction Cost Calculator, your go-to tool for simplifying the process of estimating construction costs. We understand that building a home is one of the most significant investments in a person's life, and accurate budgeting plays a crucial role in making the project a success. Our goal is to help homeowners, builders, and architects easily calculate the cost of construction materials, without needing professional assistance or complex tools.
                </p>
            </div>

            <h2 className="about-subheading">WHY</h2>
            <div className="about-section">
                <p className="about-paragraph">
                    Estimating construction costs manually can be time-consuming and error-prone. With so many factors involved—such as the cost of materials, labor, and different building components—it’s easy to make inaccurate calculations. This is where our cost calculator comes in. We built this tool to provide a fast, user-friendly solution that helps you estimate your construction expenses with just a few inputs. Whether you're planning to build a single-story home or a multi-floor building, our calculator gives you a detailed cost breakdown so you can plan effectively.
                </p>
                <img src="/lookingathouse.jpg" alt="Looking at House" className="about-image right" />
            </div>

            <h2 className="about-subheading">OUR VISION</h2>
            <div className="about-section">
                <img src="/ourvision.jpg" alt="Our Vision" className="about-image" />
                <p className="about-paragraph">
                    Our vision is to empower people with the tools they need to make informed decisions during the home construction process. By providing a transparent, simple, and efficient way to calculate costs, we aim to take the guesswork out of budgeting and help users avoid surprises down the line. We believe that anyone, regardless of their technical expertise, should have access to tools that make building their dream home easier.
                </p>
            </div>
        </div>
    );
};

export default About;
