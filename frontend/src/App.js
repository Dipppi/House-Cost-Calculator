import React from 'react';
import { Route, Routes } from 'react-router-dom';
import History from "./components/History";
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import About from './components/About';
import Services from './components/Services';
import Calculator from './components/Calculator';
import Favorites from './components/Favorites';

const App = () => {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/history" element={<History />} />
                <Route path="/favorites" element={<Favorites />} />
            </Routes>
        </>
    );
};

export default App;