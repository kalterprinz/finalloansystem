import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './calculator.css';
import BorrowerHeader from './borrowerheader';

const Calculator = () => {
  const [loanType, setLoanType] = useState('Personal');
  const [loanAmount, setLoanAmount] = useState(10000);
  const [paymentPeriod, setPaymentPeriod] = useState(1);
  const [interestRate, setInterestRate] = useState(1.25);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmountPayable, setTotalAmountPayable] = useState(0);

  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  // Update interest rate based on loan type
  const handleLoanTypeChange = (type) => {
    setLoanType(type);
    if (type === 'Personal') {
      setInterestRate(1.25);
    } else if (type === 'Educational') {
      setInterestRate(0.83);
    } else if (type === 'Pensioner') {
      setInterestRate(1.0);
    }
  };

  // Calculate loan interest and total payable amount
  const calculateLoan = () => {
    const interest = (loanAmount * interestRate * paymentPeriod) / 100;
    const totalPayable = loanAmount + interest;
    setTotalInterest(interest);
    setTotalAmountPayable(totalPayable);
  };

  // Recalculate whenever loanAmount, paymentPeriod, or interestRate changes
  useEffect(() => {
    calculateLoan();
  }, [loanAmount, paymentPeriod, interestRate]);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);
  
const handleBack = () => {
    navigate('/');
};
  return (
    <div>
      <header className="calhead">
        {loggedIn ? (
          <BorrowerHeader />
        ) : (
          <>
            <Link to="/">
              <img src="logo.png" alt="MSU-IIT NMPC Logo" className="logolan" />
            </Link>
            <h2 className="landingh2q">MSU-IIT National Multi-Purpose Cooperative</h2>
            <div className="logger">
              <a href="/login" className="nave">Login</a>
              <a href="/register" className="nave1">Register</a>
            </div>
          </>
        )}
      </header>
      <div className="loan-calculator-container">
        <button className="back-btn1" onClick={handleBack}>Back</button>

        <h1 className="loanh1">
          How Much Would You Like <span>To Borrow?</span>
        </h1>
        <p className="loanp1">Calculate Your Interest Payable</p>
        <p className="subtext">Calculate the monthly interest payable on your loan.</p>

        <div className="loan-calculator-layout">
          {/* Left side - Loan Calculation Form */}
          <div className="loan-form">
            <div className="section1">
              <label className="section-title">Available Loan Type</label>
              <div className="loan-type">
                <button
                  className={`loan-type-btn ${loanType === 'Personal' ? 'selected' : ''}`}
                  onClick={() => handleLoanTypeChange('Personal')}
                >
                  Personal
                </button>
                <button
                  className={`loan-type-btn ${loanType === 'Educational' ? 'selected' : ''}`}
                  onClick={() => handleLoanTypeChange('Educational')}
                >
                  Educational
                </button>
                <button
                  className={`loan-type-btn ${loanType === 'Pensioner' ? 'selected' : ''}`}
                  onClick={() => handleLoanTypeChange('Pensioner')}
                >
                  Pensioner
                </button>
              </div>
            </div>

            <div className="section1">
              <label className="section-title">Loan Amount</label>
              <input
                type="range"
                min="1"
                max="1000000"
                step="1000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="slider"
              />
              <p className="slider-value">
                <input
                  type="text"
                  value={loanAmount.toLocaleString()}  // Format the value with commas
                  onChange={(e) => {
                    // Remove any non-numeric characters except for the decimal point
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setLoanAmount(Math.min(Math.max(Number(value), 1), 1000000)); 
                  }}
                  className="slider-input"
                />
                Pesos
              </p>
            </div>

            <div className="section1">
              <label className="section-title">Payment Period</label>
              <input
                type="range"
                min="1"
                max="120"
                step="1"
                value={paymentPeriod}
                onChange={(e) => setPaymentPeriod(Number(e.target.value))}
                className="slider"
              />
              <p className="slider-value">
                <input
                  type="number"
                  value={paymentPeriod}
                  onChange={(e) => {
                    const value = Math.min(Math.max(Number(e.target.value), 1), 120);
                    setPaymentPeriod(value);
                  }}
                  className="slider-input"
                />
                Months
              </p>
            </div>

            <div className="interest-deposit-section">
              <div>
                <label>Interest Rate %</label>
                <p>{interestRate}%</p>
              </div>
            </div>
          </div>

          {/* Right side - Account Summary */}
          <div className="account-summary">
            <h2>Amount Payable</h2>
             <p className="balance-amount">₱{totalAmountPayable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <div className="summary-details">
                <p className="summaryp1">Total Interest: ₱{totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="summaryp2">Loan Amount: ₱{loanAmount.toLocaleString()}</p>
            </div>

            <div className="summary-actions">
              <button
                className="apply-now"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;