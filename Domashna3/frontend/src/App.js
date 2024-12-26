import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Homepage from "./components/Homepage/Homepage";
import IssuerPage from "./components/IssuerPage/IssuerPage";
import About from "./components/About/About";
import TechAnalysis from "./components/tech/tech";


const App = () => {
    return (
        <Router>
            <Navbar />

            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<Homepage/>} />
                    <Route path="/issuer/:issuerName" element={<IssuerPage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/tech" element={<TechAnalysis />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
