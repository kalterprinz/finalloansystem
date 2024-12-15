import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import './footer.css'; 

const Footer = () => {
    
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-logo">
                    <h3>MSU-IIT NMPC</h3>
                    <img src="nmpc_logo1.jpg" alt="MSU-IIT NMPC Logo" className="logofooter"/>
                </div>
                <div className="footer-links">
                    <div className="useful-links">
                        <p>USEFUL LINKS</p>
                        <ul>
                            <li><a href="#terms">Membership</a></li>
                            <li><a href="#terms">Loans</a></li>
                            <li><a href="#terms">Job Opportunities </a></li>
                            <li><a href="#terms">Point of Service</a></li>
                            <li><a href="#terms">Labs and Sports</a></li>
                            <li><a href="#terms">News and Events</a></li>
                        </ul>
                    </div>
                    <div className="contact-us">
                        <p>CONTACT US</p>
                        <ul>
                            <li>Head Office: Gregorio T. Lluch Sr. Ave., Pala-o Iligan City, 9200, Philippines</li>
                            <li>Tel. No.: (063) 223-5874</li>
                            <li>Email: msuiitnmpc@msuiitcoop.org</li>
                            <li className="social-icons">
                                <img src="tw.png" alt="Twitter"/>
                                <img src="fb.png" alt="Facebook"/>
                                <img src="ig.png" alt="Instagram"/>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 MSU-IIT National Multi-Purpose Cooperative. All rights reserved.
                    <a href="#terms">Terms and Condition</a>
                    <a href="#privacy">Privacy Policy</a></p>
            </div>
        </footer>
    );
};

export default Footer;
