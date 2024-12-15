import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './officerdashboard.css';
import './officerprof.css'; 

const Dashboard3 = () => {
  const [loggedIn, setLoggedIn] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [borrowers, setBorrowers] = useState([]);
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    setLoggedIn(false);
    navigate('/login');
  };

  // Fetch approved borrowers on component load
  useEffect(() => {
    const fetchApprovedBorrowers = async () => {
      try {
        const response = await fetch('http://192.168.1.82:3001/loans');
        if (!response.ok) throw new Error('Failed to fetch approved borrowers');
        const data = await response.json();
        console.log(data);  // Log the data to see its structure
        setBorrowers(data);  // Save the data in the state
      } catch (error) {
        console.error('Error fetching approved borrowers:', error);
      }
    };
  
    fetchApprovedBorrowers();
  }, []);
  

  // Filter borrowers based on search term across all columns
  const filteredBorrowers = borrowers.filter(borrower => {
    console.log(borrower);  // Log each borrower object to inspect its structure
    return borrower.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrower.loanAmount.toString().includes(searchTerm.toLowerCase()) ||
      borrower.loanType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrower.repaymentSchedule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrower.paymentDueDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrower.loanTerm.toString().includes(searchTerm.toLowerCase()) ||
      borrower.paymentStatus.toLowerCase().includes(searchTerm.toLowerCase());
  });
  

  return (
    <div className="offdashboard">
      <header className="headeroff">
        <img src="logo.png" alt="MSU-IIT NMPC Logo" className="logooff2" />
        <h2 className="landingh2off3">MSU-IIT National Multi-Purpose Cooperative</h2>
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
          {/*<Link to="/Officerprof">Profile</Link>*/}
        </nav>

        <div className="Logoff" onClick={handleLogout}>
          <img src="Sign_out_squre.png" alt="Logout" className="outpicoff" />
          <div className="logoutcontoff">
            <Link to="/login" className="logoutoff">Logout</Link>
          </div>
        </div>
      </div>

      <div className="containeroff">
        <div className="pending-table">
          <div className="pending-header">
            <span>Borrower List</span>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search borrowers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Borrower Name</th>
                <th>Loan Amount</th>
                <th>Loan Type</th>
                <th>Loan Term</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {borrowers.length === 0 ? (
                <tr>
                  <td colSpan="8">Loading borrowers...</td>
                </tr>
              ) : filteredBorrowers.length > 0 ? (
                filteredBorrowers.map((borrower) => (
                  <tr key={borrower._id}>
                    <td>{borrower.applicantName}</td>
                    <td>{borrower.loanAmount}</td>
                    <td>{borrower.loanType}</td>
                    <td>{borrower.loanTerm}</td>
                    <td>{borrower.paymentStatus}</td>
                    <td>
                      <Link to={`/view?loanId=${borrower._id}`}>
                        <button className="view-button">View more..</button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No borrowers found</td>
                </tr>
              )}
            </tbody>

          </table>
          {/**
           *           <Link to={`/view`}>
                      <button className="view-button" onClick={() => console.log(`Viewing details`)}>
                        View more..
                      </button></Link>
          */}

        </div>
      </div>
    </div>
  );
};

export default Dashboard3;