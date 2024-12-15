import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bar, Pie,  Doughnut } from 'react-chartjs-2'; // Import Pie Chart too
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import html2canvas from 'html2canvas';
import axios from "axios";
import jsPDF from 'jspdf';
import './Generate.css'; 

// Registering chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement 
  );

const Generate = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(true);
  const [stats, setStats] = useState({ approvedLoans: 0,pendingApplications: 0,overduePayment: 0,rejectedLoans: 0});
  const [age, setAge] = useState({ fir: 0,sec: 0,thi: 0,fou: 0});
  const [loanTypeData, setLoanTypeData] = useState({ personal: 0, educational: 0, pensioner: 0 });
  const [loanD, setLoanD] = useState({ loan: 0, ave:0, per:0, edu:0, pen:0});
  const [repay, setRepay] = useState({ paid:0,overdue:0});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const { data: approvedLoansRes } = await axios.get('http://192.168.1.82:3001/loans/status/count');
            const { data: ageRes } = await axios.get('http://192.168.1.82:3001/loan/age-distribution');
            const { data: typedata } = await axios.get('http://192.168.1.82:3001/loans/type/graph');
            const { data: totalLoanRes } = await axios.get('http://192.168.1.82:3001/loan/total-loan-amount');
            const { data: repayRes } = await axios.get('http://192.168.1.82:3001/loan/payment-status');

            setStats({
                approvedLoans: approvedLoansRes.approved || 0,
                pendingApplications: approvedLoansRes.pending || 0,
                overduePayment: approvedLoansRes.overdue || 0,
                rejectedLoans: approvedLoansRes.rejected || 0,
            });

            setAge({
              fir: ageRes.group18_25 || 0,
              sec: ageRes.group26_35 || 0,
              thi: ageRes.group36_50 || 0,
              fou: ageRes.groupAbove50 || 0,
            });

            setLoanTypeData({
              personal: typedata.personal || 0,
              educational: typedata.educational || 0,
              pensioner: typedata.pensioner || 0,
            });

            setLoanD({
              total: totalLoanRes.totalLoanAmount ||0,
              aver: totalLoanRes.averageLoanAmount ||0,
              perr:totalLoanRes.educationalLoanAmount ||0,
              eduu:totalLoanRes.personalLoanAmount ||0,
              penn:totalLoanRes.pensionerLoanAmount ||0,
            })

            setRepay({
              repaypaid: repayRes.paidLoansCount||0,
              repayover: repayRes.overdueLoansCount||0,
            })

            setLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load data. Please try again later.');
            setLoading(false);
        }
    };
    fetchData();
}, []);

console.log('Stats:', stats);
console.log('Stats:', loanD);
// Handle logout
const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    setLoggedIn(false);
    navigate('/login');
  };

  // Sample chart data
  const loanData = {
    labels: ['Personal', 'Educational', 'Pensioner'],
    datasets: [
      {
        label: 'Disbursement by Loan Type',
        data: [loanD.perr, loanD.eduu, loanD.penn, 80000],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const repaymentPerformanceData = {
    labels: ['On-Time', 'Overdue'],
    datasets: [
      {
        label: 'Repayment Performance',
        data: [repay.repaypaid, repay.repayover],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderWidth: 1,
      },
    ],
  };
// Borrower Demographics Data
const ageDistributionData = {
    labels: ['18-25', '26-35', '36-50', '50+'],
    datasets: [
      {
        label: 'Age Distribution ',
        data: [age.fir, age.sec, age.thi, age.fou], // Example data
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderWidth: 1,
      },
    ],
  };
  const ageChartOptions = {
    responsive: true, // Makes the chart resize on window resize
    maintainAspectRatio: false, // Prevents aspect ratio from being maintained, so we can adjust width/height directly
    plugins: {
      legend: {
        position: 'top', // Adjust legend position
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Age Range',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Borrowers',
        },
      },
    },
  };

 
  const loanPurposeData = {
    labels: ['Pensioner', 'Education', 'Personal'],
    datasets: [
      {
        label: 'Loan Type Breakdown (%)',
        data: [loanTypeData.pensioner, loanTypeData.educational, loanTypeData.personal], // Example data for loan purposes
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'],
        borderWidth: 1,
      },
    ],
  };
  const loanPurposeChartOptions = {
    responsive: true, // Makes the chart resize based on its container
    maintainAspectRatio: false, // Prevents maintaining the aspect ratio
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

// overall

  
  // Data for Horizontal Bar Chart (Applications)
  const applicationData = {
    labels: ['Pending Loan Applications','Active Loans', 'On Review Applications', 'Rejected Loan Applications'],
    datasets: [
      {
        label: 'Loan Applications', 
        data: [stats.pendingApplications, stats.approvedLoans,stats.overduePayment,stats.rejectedLoans],  // Values based on your example
        backgroundColor: ['#7BB8E6', '#77D1A7','#FF8F8F','#FFB74D'],
      },
    ],
  };
  
  
  // Common options for charts
  const optionsover = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
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
    const pdf = new jsPDF('p', 'mm', [215.9, 330.2]); // Adjust for long paper size
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
    
    pdf.save('Overview_Report.pdf');
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
  const [repaymentStatusData, setRepaymentStatusData] = useState({ paid: 0, overdue: 0, upcoming: 0 });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: paydata } = await axios.get('http://192.168.1.82:3001/loans/payment/graph');
        const { data: typedata } = await axios.get('http://192.168.1.82:3001/loans/type/graph');

        setRepaymentStatusData({
          paid: paydata.paid || 0,
          overdue: paydata.overdue || 0,
          upcoming: paydata.upcoming || 0,
        });

        setLoanTypeData({
          personal: typedata.personal || 0,
          educational: typedata.educational || 0,
          pensioner: typedata.pensioner || 0,
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const repaylabel = ['Pending Loan Applications','Active Loans', 'On Review Applications', 'Rejected Loan Applications','Paid', 'Overdue', 'Upcoming'];
  const repaymentStatusChartData = {
    labels: repaylabel,
    datasets: [
      {
        label:  ['Pending Loan Applications','Active Loans', 'On Review Applications', 'Rejected Loan Applications','Paid', 'Overdue', 'Upcoming'],
        data: [stats.pendingApplications, stats.approvedLoans,stats.reviewApplications,stats.rejectedLoans,repaymentStatusData.paid, repaymentStatusData.overdue, repaymentStatusData.upcoming],
        backgroundColor: ["#4caf50", "#f44336", "#ff9800"],
        borderColor: ["#4caf50", "#f44336", "#ff9800"],
        borderWidth: 1,
      },
    ],
  };
  const optionrepay = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: '',
        font: {
          size: 15,
        },
        padding: {
          top: -15,
          bottom:50,
        },
      },
      legend: {
        display: true,
        position: 'bottom',
        align:'center',
        labels: {
          font: {
            size: 12,
          },
          boxwidth:5,
          padding: 10,
          
        },
      },
      datalabels: {
        display: true, // Show the labels
        color: '#fff', // Set text color
        font: {
          size: 16,
        },
        formatter: (value, context) => {
          return value; // Display the actual data value
        },
      },
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20,
      },
    },
  };
  
 

  return (
    <div className="offdashboard">
      <header className="headeroff">
        <img src="logo.png" alt="MSU-IIT NMPC Logo" className="logooff" />
        <h2 className="landingh2off2">MSU-IIT National Multi-Purpose Cooperative</h2>
      </header>

      <div className="sidebar">
        <div className="profile">
          <img src="User_circle1.png" alt="Profile" className="profile-pic" />
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
        </nav>

        <div className="Logoff" onClick={handleLogout}>
          <img src="Sign_out_squre.png" alt="Logout" className="outpicoff" />
          <div className="logoutcontoff">
            <Link to="/login" className="logoutoff">Logout</Link>
          </div>
        </div>
      </div>

      <div className="containerOverview" ref={overviewRef} id="overviewRef">
        <h1>
          Loan Management System Overview
          <button className="printDownload" onClick={handleDownloadPDF}>Download</button>
        </h1>
        <h5>Date: {formattedDate} Time: {formattedTime}</h5>
       
     
        <div>
        
            <div className="cardover">
               <div className="titleSum"><h3>Overall Loan Portfolio Summary</h3></div>
                <div className="chart-containerover">
                    
                    <div className="chart-itemovear">
                      <Bar data={repaymentStatusChartData} options={optionrepay}/>
                    </div>
                </div>
            </div><br/>

            
        </div>

        <div className="cardover2">
            <div className="titleSum2"><h3>Borrower Demographics</h3></div>
            <div className="chart-row">
                <div className="chart-item">
                <br /> <li>Borrower Age Distribution:</li><br />
                    <Bar data={ageDistributionData} options={ageChartOptions} />
                </div>
                
                <div className="chart-item1">
                <br />  <li>Loan Type Breakdown:</li><br /><br/>
                    <Pie data={loanPurposeData} options={loanPurposeChartOptions} />
                </div>

               
            </div>
          </div>

      </div>
    </div>
    
  );
};

export default Generate;
