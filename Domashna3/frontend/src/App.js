import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes, useLocation} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Issuers from "./components/Issuers/Issuers";
import IssuerPage from "./components/IssuerPage/IssuerPage";
import About from "./components/About/About";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import Footer from "./components/Footer/Footer";
import Homepage from "./components/Homepage/Homepage";


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
                    <Route path="/profile" element={<PrivateRoute children={<ProfilePage/>}/>}/>
                    <Route path="/issuers" element={<Issuers/>} />
                </Routes>
            </div>
            {!isAuthPage && <Footer/>}
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
