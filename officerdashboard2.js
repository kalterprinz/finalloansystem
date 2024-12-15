import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './officerdashboard.css';
import './officerprof.css'; 

const Dashboard2 = () => {
  const [loggedIn, setLoggedIn] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editData, setEditData] = useState({
    loanId: '',
    applicantName: '',
    loanAmount: '',
    loanType: '',
    loanTerm: '',
    defaultStatus: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // Number of items to display per page
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    setLoggedIn(false);
    navigate('/login');
  };

  // Fetch pending loans on component load
  useEffect(() => {
    const fetchPendingLoans = async () => {
      try {
        const response = await fetch('http://192.168.1.82:3001/loans/pending');
        if (!response.ok) throw new Error('Failed to fetch pending loans');
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching pending loans:', error);
      } finally {
        setIsLoading(false); // Data has finished loading
      }
    };

    fetchPendingLoans();
  }, []);

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction =>
    transaction.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.loanAmount.toString().includes(searchTerm.toLowerCase()) ||
    transaction.loanType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.loanTerm.toString().includes(searchTerm.toLowerCase()) ||
    transaction.applicationDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.defaultStatus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate the filtered transactions
  const indexOfLastTransaction = currentPage * itemsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  // Handle Edit Functionality
  const handleEdit = (transaction) => {
    setEditData(transaction);
    setModalIsOpen(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://192.168.1.82:3001/loan/${editData.loanId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      if (!response.ok) throw new Error('Error updating transaction');
      const updatedTransactions = transactions.map(t =>
        t.loanId === editData.loanId ? editData : t
      );
      setTransactions(updatedTransactions);
      setModalIsOpen(false);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prevState => ({ ...prevState, [name]: value }));
  };

  // Handle Delete Functionality
  const handleDelete = async (loanId) => {
    if (window.confirm('Are you sure you want to delete this loan?')) {
      try {
        await fetch(`http://192.168.1.82:3001/loan/${loanId}`, { method: 'DELETE' });
        setTransactions(transactions.filter(t => t.loanId !== loanId));
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  // Handle Pagination buttons
  const handleNext = () => {
    if (currentPage < Math.ceil(filteredTransactions.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="offdashboard">
      <header className="header2">
        <img src="logo.png" alt="MSU-IIT NMPC Logo" className="logooff2" />
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
            <span>Pending Loan Applications</span>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Show Loading... if data is being fetched */}
          {isLoading ? (
         <p style={{ padding: '10px' }}>Loading...</p>
        ) : filteredTransactions.length === 0 ? (
            <p>No Pending Loan Applications</p>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Applicant Name</th>
                    <th>Loan Amount</th>
                    <th>Loan Type</th>
                    <th>Tenure</th>
                    <th>Date Applied</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTransactions.map((transaction) => (
                    <tr key={transaction.loanId}>
                      <td>{transaction.applicantName}</td>
                      <td>{transaction.loanAmount}</td>
                      <td>{transaction.loanType}</td>
                      <td>{transaction.loanTerm}</td>
                      <td>{transaction.applicationDate}</td>
                      <td>{transaction.defaultStatus}</td>
                      <td className="action-buttons">
                      <Link to={`/view?loanId=${transaction._id}`}>
                      <button className="btn-view" onClick={() => console.log(`Viewing details`)}>
                        View more..
                      </button></Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination controls */}
              <div className="pagination-controls">
                <button className="page" onClick={handlePrevious} disabled={currentPage === 1}>Previous</button>
                <span>Page {currentPage}</span>
                <button className="page" onClick={handleNext} disabled={currentPage === Math.ceil(filteredTransactions.length / itemsPerPage)}>Next</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal for Editing */}
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <h2>Edit Loan</h2>
        <label>Applicant Name</label>
        <input 
          type="text" 
          name="applicantName" 
          value={editData.applicantName} 
          onChange={handleChange}
        />
        <label>Loan Amount</label>
        <input 
          type="number" 
          name="loanAmount" 
          value={editData.loanAmount} 
          onChange={handleChange}
        />
        <label>Loan Type</label>
        <input 
          type="text" 
          name="loanType" 
          value={editData.loanType} 
          onChange={handleChange}
        />
        <label>Loan Term</label>
        <input 
          type="number" 
          name="loanTerm" 
          value={editData.loanTerm} 
          onChange={handleChange}
        />
        <label>Default Status</label>
        <input 
          type="text" 
          name="defaultStatus" 
          value={editData.defaultStatus} 
          onChange={handleChange}
        />
        <button onClick={handleSave}>Save</button>
        <button onClick={() => setModalIsOpen(false)}>Cancel</button>
      </Modal>
    </div>
  );
};

export default Dashboard2;
