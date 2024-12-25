import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes, useLocation} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Homepage from "./components/Homepage/Homepage";
import IssuerPage from "./components/IssuerPage/IssuerPage";
import About from "./components/About/About";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";


const PrivateRoute = ({children}) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
}


const AppRoutes = () => {

    const location = useLocation();
    const isAuthPage = location.pathname === '/login' ||  location.pathname === '/register'
    return (
        <>
            {!isAuthPage && <Navbar/>}
            <div className={` ${isAuthPage ? 'no-margin' : 'container mt-4'}`}>
                <Routes>
                    <Route path="/" element={<Homepage/>}/>
                    <Route path="/issuer/:issuerName" element={<IssuerPage/>}/>
                    <Route path="/about" element={<About/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                </Routes>
            </div>
        </>
    );
}


const App = () => {

    return (
        <Router>
            <AppRoutes/>
        </Router>
    );
};

export default App;
