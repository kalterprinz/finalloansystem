import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';

const Login = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    // Load remembered username/email if "Remember Me" was checked
    useEffect(() => {
        const rememberedUsername = localStorage.getItem('rememberedUsername');
        if (rememberedUsername) {
            setUsernameOrEmail(rememberedUsername);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
    
        try {
            console.log("Payload:", { usernameOrEmail, password });
            const response = await axios.post('http://192.168.1.82:3001/login', { 
                usernameOrEmail, 
                password 
            });
    
            console.log("Payload:", { usernameOrEmail, password });
            // Validate and store backend response
            const { token, userId, role } = response.data;
    
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            localStorage.setItem('role', role);
    
            if (rememberMe) {
                localStorage.setItem('rememberedUsername', usernameOrEmail);
            } else {
                localStorage.removeItem('rememberedUsername');
            }
    
            // Redirect based on role
            if (role === 'admin') {
                navigate('/officerdashboard1'); // Admin dashboard
            } else if (role === 'member') {
                navigate('/'); // Member landing page
            } else {
                throw new Error('Invalid role received.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError('Login failed. Please check your username/email and password.');
            window.alert('Login failed. Please check your username/email and password.');
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    const handleRegister = () => {
        navigate('/signup');
    };

    return (
        <div className="login-page">
            <div className="login-box">
                <button className="back-btn" onClick={handleBack}>Back</button>
                <img src="logo.png" alt="MSU-IIT NMPC Logo" className="logolog"/>
                <h2 className="loginh2">MSU-IIT National Multi-Purpose Cooperative</h2>
                <p className="loginp">Your Gateway to Financial Possibilities.</p>
                <form onSubmit={handleSubmit}>
                    <label className="labelp">Username</label>
                    <input 
                        type="text" 
                        id="usernameoremail"
                        className="login"
                        placeholder="Username or Email..." 
                        value={usernameOrEmail}
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                    />
                    <label className="labelp">Password</label>
                    <input 
                        type="password" 
                        id="password"
                        className="login"
                        placeholder="**************" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="options">
                        <div className="remember-me">
                            <input 
                                type="checkbox" 
                                id="remember" 
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)} 
                            />
                            <label htmlFor="remember">Remember me</label>
                        </div>
                        <a href="#" className="forgot">Forgot Password?</a>
                    </div>
                    <button className="login-btn">Login</button>
                </form>
                
                <button className="register-btn" onClick={handleRegister}>Register</button>
            </div>
        </div>
    );
};

export default Login;
