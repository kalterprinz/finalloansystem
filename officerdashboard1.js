import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import axios from "axios";
import jsPDF from 'jspdf';
import Stats from './Stats';
import Graphs from './Graphs';
import TransactionsTable from './TransactionsTable';
import './officerdashboard.css';
import './officerprof.css'; 

const Dashboard1 = () => {
  const [loggedIn, setLoggedIn] = useState(true); // Define the loggedIn state
  const navigate = useNavigate(); // For navigation after logout
  const handleLogout = () => {
    // Remove token and other user info from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    setLoggedIn(false); // Update loggedIn state to false
    navigate('/login'); // Redirect to home page after logout
};

const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Update date and time every second
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Clear timer on component unmount
    return () => clearInterval(timer);
  }, []);
  // Format date and time
  const formattedDate = currentDateTime.toLocaleDateString();
  const formattedTime = currentDateTime.toLocaleTimeString();

// PDF Download Function
const overviewRef = useRef(null);
const handleDownloadPDF = async () => {
  if (!overviewRef.current) {
    console.error("Element not attached to the DOM.");
    return;
  }

  try {
    const canvas = await html2canvas(overviewRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    // Set up jsPDF for A4 size
    const pdf = new jsPDF('p', 'mm', 'a4'); // A4 paper size (210 x 297 mm)

    // Define margins (in mm)
    const margin = { top: 20, left: 20, right: 20, bottom: 20 };

    // Calculate the usable content width and height
    const contentWidth = pdf.internal.pageSize.getWidth() - margin.left - margin.right;
    const contentHeight = pdf.internal.pageSize.getHeight() - margin.top - margin.bottom;

    // Adjust image dimensions to fit within content area
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = margin.top; // Start from the top margin
    let remainingHeight = imgHeight; // Track remaining content height

    // Loop through the content to paginate if it exceeds one page
    while (remainingHeight > 0) {
      pdf.addImage(imgData, 'PNG', margin.left, position, imgWidth, Math.min(remainingHeight, contentHeight));

      // Reduce remaining height
      remainingHeight -= contentHeight;

      // Add a new page if content exceeds current page
      if (remainingHeight > 0) {
        pdf.addPage();
        position = margin.top; // Reset position for the new page
      }
    }

    // Save the PDF
    pdf.save('Overview_Report.pdf');
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

  return (
    <div className="offdashboard">
      <header className="headeroff">
          <img src="logo.png" alt="MSU-IIT NMPC Logo" className="logooff"/>
          <h2 className="landingh2off">MSU-IIT National Multi-Purpose Cooperative</h2>
      </header>

      <div className="sidebar">
          <div className="profile">
              <img src="User_circle1.png" alt="Profile" className="profile-pic"/>
              <div className="profile-info">
                  <h3 className="username">Nicholas Patrick</h3>
                  <div className="username-divider"></div>
                  <p className="role">Loan Clerk</p>
              </div>
          </div>
          <nav className="nav-menu">
              <Link to="/officerdashboard1">Dashboard</Link>
              <Link to="/OfficerDashboard2">Loan Applications</Link>
              <Link to="/OfficerDashboard3">Borrower List</Link>
               {/*<Link to="/Officerprof">Profile</Link>*/}
          </nav>

          <div className="Logoff" onClick={handleLogout}>
              <img src="Sign_out_squre.png" alt="Logout" className="outpicoff" />
              <div className="logoutcontoff">
                  <Link to="/login" className="logoutoff">Logout</Link>
              </div>
          </div>
      </div>
      <div className="containeroff" >
        <div ref={overviewRef} id="overviewRef">
          <h1 className="loan-title">Loan Management System</h1>
          
          <button className="generate-report-button" onClick={handleDownloadPDF}>Generate Report</button>
      
          <h5>Date: {formattedDate} Time: {formattedTime}</h5>
          
          <Stats />
          <Graphs />
        </div>
       
        <TransactionsTable />
      </div>
    </div>
  );
};

export default Dashboard1;