import React, { useState, useEffect } from 'react';
import './prequiz.css'; // This file will contain the necessary CSS
import Footer from './footer';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate for navigation
import BorrowerHeader from './borrowerheader';

const PreQuiz = () => {
    const [monthlyIncome, setMonthlyIncome] = useState(0); // State for monthly income
    const navigate = useNavigate();

    useEffect(() => {
        // Scroll to top when the component is mounted
        window.scrollTo(0, 0);
    }, []);

    const handleNext = (e) => {
        e.preventDefault();
        // Pass the monthly income value to the QuizResult page
        navigate('/quizresult', { state: { monthlyIncome } });
    };

    return (
        <div className="applicationquiz">
            <BorrowerHeader /> 

            {/* Form Container */}
            <div className="sulodPormquiz">
                <h3 className="titlequiz">Pre Approval Quiz</h3>
                <form className="quizpre">
                    <div className="form-row">
                        <div className="form-column">
                            <div className="quizsection">
                                <p>Personal Information</p>
                                {/* Personal Information Fields */}
                                <div className="itemquiz">
                                    <label>First Name:</label>
                                    <input type="text" />
                                </div>
                                <div className="itemquiz">
                                    <label>Middle Name:</label>
                                    <input type="text" />
                                </div>
                                <div className="itemquiz">
                                    <label>Last Name:</label>
                                    <input type="text" />
                                </div>
                                <div className="itemquiz">
                                    <label>Birth Date:</label>
                                    <input type="date" />
                                </div>
                                <div className="itemquiz">
                                    <label>Age:</label>
                                    <input type="number" />
                                </div>
                                <div className="itemquiz">
                                    <label>Mobile Number:</label>
                                    <input type="tel" />
                                </div>
                                <div className="itemquiz">
                                    <label>Email Address:</label>
                                    <input type="email" />
                                </div>
                                <div className="itemquiz">
                                    <label>Residential Status:</label>
                                    <input type="text" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="form-column">
                            <div className="quizsection">
                                <p>Employment Information</p>
                                {/* Employment Fields */}
                                <div className="itemquiz">
                                    <label>Job Title:</label>
                                    <input type="text" />
                                </div>
                                <div className="itemquiz">
                                    <label>Employer Name:</label>
                                    <input type="text" />
                                </div>
                                <div className="itemquiz">
                                    <label>Monthly Income:</label>
                                    <input 
                                        type="number" 
                                        value={monthlyIncome} 
                                        onChange={(e) => setMonthlyIncome(e.target.value)} // Update state
                                    />
                                </div>
                            </div>
                            <p className="note">*Note: If student, enter parents' monthly income.</p>

                            <br/>
                        </div>
                    </div>
                    
                    <div className="parent-containerapp">
                        <button onClick={handleNext} className="submit-btn1">Next →</button>
                    </div>
                </form>
            </div>

            <Footer />
        </div>
    );
};

export default PreQuiz;