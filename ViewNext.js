import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ViewMore.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ViewMorePage = () => {
  const navigate = useNavigate();
  const borrower = {
    fullName: "John Doe",
    dob: "1990-01-01",
    contactNumber: "123-456-7890",
    email: "johndoe@example.com",
    address: "123 Main Street",
    occupation: "Software Engineer",
    employer: "TechCorp",
    loanDetails: {
      loanId: "L001",
      loanType: "Personal Loan",
      applicationDate: "2023-01-01",
      loanStatus: "Active",
      loanAmount: 5000,
      interestRate: 5,
      loanTerm: 12,
      monthlyPayment: 450,
    },
    repayments: [
      { date: "2023-02-01", amount: 450, status: "Late" },
      { date: "2023-03-01", amount: 450, status: "On-time" },
    ],
    documents: {
      loanAgreement: "Agreement_001.pdf",
      collateral: "Collateral_001.pdf",
    },
  };

  const handleBack = () => {
    navigate('/view'); 
};

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
   
   // Set up PDF dimensions
   const pdf = new jsPDF('p', 'mm', [215.9,  355.6]); // Adjust for long paper size
   const imgWidth = pdf.internal.pageSize.getWidth();
   const imgHeight = (canvas.height * imgWidth) / canvas.width;
   
   let position = 0; // To track the vertical position
   const pageHeight = pdf.internal.pageSize.getHeight(); // Height of one page in PDF
   
   // Loop through canvas and create pages if the content exceeds one page
   while (position < imgHeight) {
     pdf.addImage(imgData, 'PNG', 0, -position, imgWidth, imgHeight); // Y position set to -position
     position += pageHeight; // Move down by one page height

     // Add a new page if there's still content left to add
     if (position < imgHeight) {
       pdf.addPage();
     }
   }
   
   pdf.save('Borrower_Information 2/2.pdf');
 } catch (error) {
   console.error("Error generating PDF:", error);
 }
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
  return (
    <div className="pdf-container">
      <header className="headeroff">
          <img src="logo.png" alt="MSU-IIT NMPC Logo" className="logooff"/>
          <h2 className="landingh2off">MSU-IIT National Multi-Purpose Cooperative</h2>
      </header>
        <button className="back-btn1" onClick={handleBack}>Back</button>
        <button className="printDownload1" onClick={handleDownloadPDF}>Download</button>
      <br/>
        <div className="headerview">
          <h1>Borrower Information</h1>
          <p>Loan Application and Transaction Summary</p>
          <h5>Date: {formattedDate} Time: {formattedTime}</h5>
        </div>
        <div ref={overviewRef} id="overviewRef"><br/>
        <div className="section">
          <h2>Loan Application Details</h2>
          <div className="section-content1">
            <div class="profile-column">
              <p><strong>Loan ID:</strong> {borrower.loanDetails.loanId}</p>
              <p><strong>Branch Applied:</strong> {borrower.loanDetails.loanId}</p>
              <p><strong>Date Filed:</strong> {borrower.loanDetails.loanId}</p>
              <p><strong>New/Renewal:</strong> {borrower.loanDetails.loanId}</p>
              <p><strong>Loan Type:</strong> {borrower.loanDetails.loanType}</p>
              <p><strong>Amount Applied:</strong> {borrower.loanDetails.loanId}</p>
              <p><strong>Term of Loan:</strong> {borrower.loanDetails.loanId}</p>
              <p><strong>Purpose of Loan:</strong> {borrower.loanDetails.applicationDate}</p>
              <p><strong>Loan Amount Approved:</strong> ${borrower.loanDetails.loanAmount}</p>
            </div>
            <div class="profile-column">
              <p><strong>Loan Status:</strong> {borrower.loanDetails.loanStatus}</p>
              <p><strong>Interest Rate:</strong> {borrower.loanDetails.interestRate}%</p>
              <p><strong>Collateral/Security Offered:</strong> ${borrower.loanDetails.monthlyPayment}</p>
              <p><strong>Source of Payment:</strong> ${borrower.loanDetails.monthlyPayment}</p>
              <p><strong>Mode of Payment:</strong> ${borrower.loanDetails.monthlyPayment}</p>
              <p><strong>Manner of Payment:</strong> ${borrower.loanDetails.monthlyPayment}</p>
              <p><strong>Loan Application Verified By:</strong> ${borrower.loanDetails.monthlyPayment}</p>
              <p><strong>Verified by:</strong> ${borrower.loanDetails.monthlyPayment}</p>
              <p><strong>Verified Date:</strong> ${borrower.loanDetails.monthlyPayment}</p>
            </div>
          </div><br/>
        </div>
        <div className="section">  
          <h2>Co-Maker's Statement Details</h2>
          <div className="section-content1">
            <div class="profile-column">
              <p><strong>Member ID:</strong> {borrower.loanDetails.loanId}</p>
              <p><strong>From Branch:</strong> {borrower.loanDetails.loanId}</p>
              <p><strong>Date Signed:</strong> {borrower.loanDetails.loanId}</p>
              <p><strong>Full Name:</strong> {borrower.fullName}</p>
              <p><strong>Civil Status:</strong> {borrower.dob}</p>
              <p><strong>No. of Dependent/s:</strong> {borrower.dob}</p>
              <p><strong>Sex:</strong> {borrower.contactNumber}</p>
              <p><strong>Age:</strong> {borrower.email}</p>
              <p><strong>Contact/Telephone Number:</strong> {borrower.contactNumber}</p>
              <p><strong>Email Address:</strong> {borrower.email}</p>
              <p><strong>Name of Spouse:</strong> {borrower.email}</p>
              <p><strong>Permanent Address:</strong> {borrower.email}</p>
              <p><strong>Present Address:</strong> {borrower.email}</p>
              <p><strong>Residence Status:</strong> {borrower.email}</p><br/>
              <p><strong>Realtionship to Member-borrower:</strong> ${borrower.loanDetails.loanAmount}</p>
              <p><strong>Known Member-borrower for how amny years?:</strong> ${borrower.loanDetails.loanAmount}</p>
              <p><strong>Valid ID/#:</strong> ${borrower.loanDetails.loanAmount}</p>
            </div>
            <div class="profile-column">
              <p><strong>Employer:</strong> {borrower.contactNumber}</p>
              <p><strong>Employer Contact Number:</strong> {borrower.email}</p>
              <p><strong>Employement Status/Position Held:</strong> {borrower.email}</p>
              <p><strong>Annual Salary:</strong> {borrower.email}</p>
              <p><strong>Length of Service:</strong> {borrower.contactNumber}</p>
              <br/>
              <p><strong>Firm/Trade/Business Name:</strong> {borrower.email}</p>
              <p><strong>Business Address:</strong> {borrower.contactNumber}</p>
              <p><strong>Nature of Business:</strong> {borrower.email}</p>
              <p><strong>Sole Owner or Partner:</strong> {borrower.contactNumber}</p>
              <p><strong>Capital Invested:</strong> {borrower.email}</p>
            </div>
            </div><br/>
          </div>
        <div className="section">  
            <h2>Outstanding Obligation/s, if any: (As Proncipal or Co-maker)</h2> 
            <div className="section-content"> 
            <table classname="obligations-table">
              <thead>
                <tr>
                  <th>Creditor</th>
                  <th>Principal Amount</th>
                  <th>Present Balance</th>
                  <th>Maturity Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{borrower.loanDetails.loanId}</td>
                  <td>{borrower.loanDetails.loanId}</td>
                  <td>{borrower.loanDetails.loanId}</td>
                  <td>{borrower.loanDetails.loanId}</td>
                </tr>
              </tbody>
            </table> <br/><br/>

            <h2>List of Properties(Real and Personal)</h2>  
            <table classname="obligations-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Location </th>
                  <th>Area </th>
                  <th>Market value</th>
                  <th>Encumbrances </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{borrower.loanDetails.loanId}</td>
                  <td>{borrower.loanDetails.loanId}</td>
                  <td>{borrower.loanDetails.loanId}</td>
                  <td>{borrower.loanDetails.loanId}</td>
                  <td>{borrower.loanDetails.loanId}</td>
                </tr>
              </tbody>
            </table> <br/>

          </div>
        </div>

        <div className="section">
          <h2>Repayment History</h2>
          <div className="section-content">
            {borrower.repayments.length > 0 ? (
              <table className="repayment-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {borrower.repayments.map((payment, index) => (
                    <tr key={index}>
                      <td>{payment.date}</td>
                      <td>${payment.amount}</td>
                      <td>{payment.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No repayment history available</p>
            )}
          </div>
        </div>


        <div className="section">
          <h2>Documents</h2>
          <div className="section-content">
            <table className="cash-flow-table">
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>File</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Member-Borrower's Signature</td>
                  <td> {borrower.documents.collateral}
                  <button  className="btn1 btn-view"  onClick={() => handleEdit(transaction)} >
                          View
                        </button>
                        <button className="btn1 btn-download" onClick={() => handleDelete(transaction.loanId)} >
                          Download
                        </button>
                  </td>
                </tr>
              </tbody>
            </table><br/>
          </div>
        </div>
      </div>  

      <footer className="footer">
            <div className="footer-container">
                <div className="footer-logo1">
                    <h3>MSU-IIT NMPC</h3>
                    <img src="nmpc_logo1.jpg" alt="MSU-IIT NMPC Logo" className="logofooter1"/>
                </div>
                       
                        <ul className="footerUl">
                        <p>CONTACT US</p>
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
            
            <div className="footer-bottom">
                <p>&copy; 2024 MSU-IIT National Multi-Purpose Cooperative. All rights reserved.
                    <a href="#terms">Terms and Condition</a>
                    <a href="#privacy">Privacy Policy</a></p>
            </div>
        </footer>
    </div>
  );
};

export default ViewMorePage;
