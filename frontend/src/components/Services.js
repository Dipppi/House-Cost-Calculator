import React from 'react';
import './Services.css'; 

const Services = () => {
    return (
        <div className="services-container">
            <h1 className="services-title">Our Services</h1>
            <p className="services-description">
                At Home Cost Estimator, we provide comprehensive services to help you 
                plan your dream home in India. Our goal is to simplify the building 
                process and provide you with accurate cost estimates.
            </p>
            <div className="services-list">
                <div className="service-item">
                    <h2>Cost Estimation Calculator</h2>
                    <p>
                        Use our advanced calculator to get an estimated cost for building your home based on your inputs 
                        such as location, size, and materials.
                    </p>
                </div>
                <div className="service-item">
                    <h2>Custom Home Maps</h2>
                    <p>
                        In the future, we will provide suggested layouts and maps tailored to your preferences and location.
                    </p>
                </div>
                <div className="service-item">
                    <h2>Local Builder Contacts</h2>
                    <p>
                        Get connected with local builders and contractors near your location for assistance in your building project.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Services;

