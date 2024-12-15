import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Link, useNavigate } from 'react-router-dom';
import './landing.css'; 
import './quizresult.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import BorrowerHeader from './borrowerheader';
import Footer from './footer';

const Landing = () => {
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is logged in by looking for the token in localStorage
        const token = localStorage.getItem('token');
        if (token) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    }, []);

    // Function to handle when the user clicks on the profile image
    const handleProfileClick = () => {
        // Ensure the token is still available and then navigate to the officer profile page
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/borrowerdash'); // Redirect to officer profile
        } else {
            // Optional: Handle the case when no token is found (e.g., navigate to login)
            navigate('/login');
        }
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: true,
    };

    const slides = [
        { id: 1, image: '1.jpg'},
        { id: 2, image: '2.jpg'},
        { id: 3, image: '3.jpg'},
        { id: 4, image: '4.jpg'},
        { id: 5, image: '5.jpg' },
        { id: 6, image: '6.jpg'},
        { id: 7, image: '7.jpg'},
        { id: 8, image: '8.jpg'},
        { id: 9, image: '9.jpg'},
        { id: 10, image: '10.jpg'},
    ];

    //pop up
    const loanDetails = {
        educational: {
            title: "Educational Loan",
            description: (
                <div className="loan-info-container">
                 <p>
                 The MSU-IIT National Multi-Purpose Cooperative (NMPC) offers an Educational Loan 
                 designed to support students in achieving their academic goals. 
                 This loan provides financial assistance to cover tuition fees, 
                 school supplies, and other educational expenses, 
                 making it easier for students to focus on their studies without the financial burden.
                </p>
                <p>Educational loan can be used for almost anything, such as:</p>
                <ul>
                     <li>Loan Amount: Up to ₱50,000 </li>
                     <li>Covers tuition fees</li>
                     <li>School supplies</li>
                     <li>Other educational needs</li>
                </ul>
                <div className="text-content1">
                    <button
                        onClick={() => {
                            if (loggedIn) {
                                navigate('/appform');
                                window.scrollTo({ top: 0, behavior: 'smooth' }); 

                            } else {
                                navigate('/login'); // Redirect to login page if not logged in
                            }
                        }}
                    >
                        Apply Now!
                    </button>
                </div>

                </div>
            ),
            imgSrc: "educ.jpg",
        },
        personal: {
            title: "Personal Loan",
            description: (
                <div className="loan-info-container">
                 <p>
                     This personal loan allows individuals to borrow up to ₱10,000 to help achieve
                      their personal goals, whether it's for home expenses, emergencies, or other personal needs. 
                      The loan comes with a low interest rate and is payable over a 6-month period, 
                      making it more manageable for borrowers.
                </p>
                <p>A personal loan can be used for almost anything, such as:</p>
                <ul>
                     <li>Debt consolidation (paying off multiple debts)</li>
                     <li>Medical expenses</li>
                     <li>Home improvements</li>
                     <li>Wedding expenses</li>
                     <li>Travel</li>
                </ul>
                <div className="text-content1">
                    <button
                        onClick={() => {
                            if (loggedIn) {
                                navigate('/appform');
                                window.scrollTo({ top: 0, behavior: 'smooth' }); 

                            } else {
                                navigate('/login'); // Redirect to login page if not logged in
                            }
                        }}
                    >
                        Apply Now!
                    </button>
                </div>
                </div>
            ),
            imgSrc: "personal.jpg",
        },
        pensioner: {
            title: "Pensioner Loan",
            description: "Information about the Pensioner Loan...",description: (
                <div className="loan-info-container">
                 <p>
                 Provide financial support to pensioners who
                  need assistance with their medical, living,
                   or other essential expenses. This loan is 
                   tailored to ensure that senior citizens can 
                   enjoy a comfortable and secure lifestyle by 
                   giving them access to funds when needed most.
                </p>
                <p>Educational loan can be used for almost anything, such as:</p>
                <ul>
                     <li>Loan Amount: Up to ₱20,000 </li>
                     <li>Medical expenses</li>
                     <li>Home improvements</li>
                     <li>Emergency cost</li>
                     <li>Daily living needs</li>
                </ul>
                <div className="text-content1">
                    <button
                        onClick={() => {
                            if (loggedIn) {
                                navigate('/appform');
                                window.scrollTo({ top: 0, behavior: 'smooth' }); 

                            } else {
                                navigate('/login'); // Redirect to login page if not logged in
                            }
                        }}
                    >
                        Apply Now!
                    </button>
                </div>

                </div>
            ),
            imgSrc: "pens.jpg",
        },
    };

    const openPopup = (loanType) => {
        if (loanDetails[loanType]) {
            setSelectedLoan(loanDetails[loanType]);
        } else {
            console.error("Loan type not found:", loanType);
        }
    };
    
    const closePopup = () => {
        setSelectedLoan(null);
    };

    

    return (
        <div className="landing-page">
             <header>        
             {loggedIn ? (
                    <>
                    <   BorrowerHeader /> 
                        
                    </>
                ) : (
                    <>
                    <img src="logo.png" alt="MSU-IIT NMPC Logo" className="logolan"/>
                    <h2 className="landingh2q">MSU-IIT National Multi-Purpose Cooperative</h2>
                        <div className="logger">
                            <a href="/login" className="nave">Login</a>
                            <a href="/register" className="nave1">Register</a>
                        </div>
                        
                    </>
                )}
            </header>
            
            <div className="contentlan">
               <div className="main-banner">
               <div className="text-content">
                    <h1>Quick and Easy Loans for Your Financial Needs.</h1>
                    <p>Our loan services offer a hassle-free and streamlined borrowing experience, providing you with the funds you need in a timely manner to meet your financial requirements.</p>
                    <button
                        onClick={() => {
                            if (loggedIn) {
                                navigate('/appform');
                            } else {
                                navigate('/login'); // Redirect to login page if not logged in
                            }
                        }}
                    >
                        Apply Now!
                    </button>
                </div>
                    <img src="bldg.png" alt="Building" className="banner-img"/>
                </div>
                <div className="services-section">
                        <h2 className="services">About Us</h2>
                            <p className="aboutpp">The MSU-IIT National Multi-Purpose Cooperative is a financial institution based in Iligan City, Lanao del Norte, Philippines.
                            It was established to serve the needs of the faculty, staff, and students of Mindanao State University-Iligan Institute of Technology (MSU-IIT). 
                            However, it has since expanded its membership to include individuals and groups outside of the university.
                            The MSU-IIT National Multi-Purpose Cooperative is a member of the National Confederation of Cooperatives (NATCCO), 
                            a network of cooperatives in the Philippines.This membership allows the cooperative to access various resources and support services. </p>

                    <div className="vmc-section">
                        <div className="vmc-grid">
                            <div className="vmc-card">
                                <img src="vision.jpg" alt="vision" className="vision"/>     
                            </div>
                            <div className="vmc-card">
                             <img src="mission.jpg" alt="mission" className="mission"/>   
                            </div>
                            <div className="vmc-card">  
                                <img src="core-values.jpg" alt="core-values" className="core"/>   
                            </div>
                        </div>
                    </div>
                </div>
                {/* Personal Loan Card 
                                <button onClick={() => navigate('/appform')}>Apply now</button>
                        */}
                
                <div className="slideshow">
                <h2 className="slidep">Photos</h2>
                    <Slider {...settings}>
                        {slides.map((slide) => (
                            <div key={slide.id} className="slide">
                                <img src={slide.image} alt={`Slide ${slide.id}`} className="slide-image" />
                            </div>
                        ))}
                    </Slider>
                </div>

            <div className="services-section">
                <h2 className="services1">Our Services</h2>
                <div className="services-grid">
                <div className="service-card" >
                    <img src="personal.png" alt="Building" className="icon" />
                    <h3>Personal Loan</h3>
                    <p>Personal loans provide borrowers with flexibility in how they use the funds...</p>
                    <button onClick={() => openPopup('personal')}>More Details</button>

                </div>
                    <div className="service-card">
                        <img src="educ.png" alt="Building" className="icon"/>       
                        <h3>Educational Loan</h3>
                        <p>Educational Loan Services provide financial assistance to students for various purposes...</p>
                        <button onClick={() => openPopup('educational')}>More Details</button>
                    </div>
                    <div className="service-card">
                        <img src="pension.png" alt="Building" className="icon"/>   
                        <h3>Pensioner Loan</h3>
                        <p>Pensioner Loan Services provide financing options for older adults...</p>
                        <button  onClick={() => openPopup('pensioner')}>More Details</button>
                    </div>

                    <div className="service-card">
                        <img src="quiz.png" alt="Building" className="icon"/>   
                        <h3>Pre-Approval Quiz</h3>
                        <p>Pre-Approval Quiz helps applicants decide on loan eligibility and how to proceed...</p>
                    <button
                        onClick={() => {
                            if (loggedIn) {
                                navigate('/prequiz');
                            } else {
                                navigate('/login'); // Redirect to login page if not logged in
                            }
                        }}
                    >
                        Take a Quiz
                    </button>
                    </div>
                    <div className="service-card">
                        <img src="calculator.png" alt="Building" className="icon"/>   
                        <h3>Loan Calculator</h3>
                        <p>The Loan Calculator helps estimate monthly payments...</p>
                        <button onClick={() => navigate('/calculator')}>Calculate now</button>
                    </div>
                </div>
                </div>   
            </div>
            {selectedLoan && (
                    <div className="popup-overlay" onClick={closePopup}>
                        <div className="popup-box" onClick={(e) => e.stopPropagation()}>
                            <button className="close-button" onClick={closePopup}>X</button>
                            <div className="popup-info">
                                <h3>{selectedLoan.title}</h3>
                                <div className="loan-container">
                                    {selectedLoan.description || <p>Details about this loan are not available.</p>}
                                </div>
                            </div>
                            <div className="popup-image-container">
                                <img src={selectedLoan.imgSrc} alt={selectedLoan.title} className="popup-image" />
                            </div>



                        </div>

                    </div>
                )}

            <Footer/>
        </div>
    );
};

export default Landing;