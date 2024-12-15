import React from 'react';
import { Link } from 'react-router-dom';
import './officerdash.css'; 
import LoanStatus from './loanstatus';
import TransactionHistory from './transac';

const Officerdash = () => {

    return (
        <div className="landing-page">
            <header>
                <img src="logo.png" alt="MSU-IIT NMPC Logo" className="logo"/>
                <h2>MSU-IIT National Multi-Purpose Cooperative</h2>
                <nav>
                    <Link to="/login">
                        <span className="span2">Login</span>
                    </Link>
                    <span className="span2">Sign Up</span>
                </nav>
            </header>
            <div className="content">
            <aside>
                <div className="profile-section">
                    <div className="cover-photo">
                        <img src="cover-photo-url.jpg" alt="Cover" />
                        <button className="edit-cover-btn">Edit Cover Photo</button>
                    </div>
                    <div className="profile-info">
                        <img src="profile-photo-url.jpg" alt="Profile" className="profile-photo" />
                        <h2>Charles Deo</h2>
                        <p>Business Owner</p>
                        <button className="edit-profile-btn">Edit Profile</button>
                    </div>
                    <div className="about-info">
                        <p><strong>Male</strong></p>
                        <p>Born June 26, 1980</p>
                        <p>2nd Floor, Robinsons Mall, Macapagal Ave, Iligan City</p>
                        <p>charles5182@ummoh.com</p>
                        <p>33757005467</p>
                    </div>
                </div>
            </aside>
                    <main>
                    <div className="balance-info">
                        <h3>Total Balance</h3>
                        <p>₱2,548.00</p>
                        <div className="balance-details">
                        <p>Income: ₱1,840.00</p>
                        <p>Expenses: ₱284.00</p>
                        </div>
                    </div>
                    <LoanStatus />
                    <TransactionHistory />
                    </main>
                </div>

            <footer className="footer">
            <div className="footer-container">
                <div className="footer-logo">
                    <h3>MSU-IIT NMPC</h3>
                    <img src="nmpc_logo1.jpg" alt="MSU-IIT NMPC Logo" className="logo1"/>
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

        </div>
    );
};

export default Officerdash;