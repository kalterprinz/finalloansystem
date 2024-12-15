import React, { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi'; 
import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios';
import Modal from 'react-modal';
import './TransactionsTable.css';

const TransactionsTable = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch transactions from the backend
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://192.168.1.82:3001/loans');
        // Sort transactions by applicationDate in descending order (most recent first)
        const sortedTransactions = response.data.sort((a, b) => 
          new Date(b.applicationDate) - new Date(a.applicationDate)
        );
        setTransactions(sortedTransactions);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transactions');
        setLoading(false);
      }
    };
  
    fetchTransactions();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prevState => ({ ...prevState, [name]: value }));
  };

  // Filter transactions based on the search term
  const filteredTransactions = transactions.filter(transaction => 
    (transaction.applicantName && transaction.applicantName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (transaction.loanAmount && transaction.loanAmount.toString().includes(searchTerm.toLowerCase())) ||
    (transaction.loanType && transaction.loanType.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (transaction.loanTerm && transaction.loanTerm.toString().includes(searchTerm.toLowerCase())) ||
    (transaction.applicationDate && transaction.applicationDate.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (transaction.paymentStatus && transaction.paymentStatus.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  // Handle page change
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="transactions-table">
      <div className="transactions-header">
        <span>Recent Transactions</span>
        <div className="search-bar1">
          <input 
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div> 
      {loading ? (
        <p style={{ padding: '10px' }}>Loading...</p>
      ) : error ? (
        <p>{error}</p>
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
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((transaction, index) => (
                  <tr key={index}>
                    <td>{transaction.applicantName}</td>
                    <td>{transaction.loanAmount}</td>
                    <td>{transaction.loanType}</td>
                    <td>{transaction.loanTerm}</td>
                    <td>{new Date(transaction.applicationDate).toLocaleDateString()}</td>
                    <td>{transaction.paymentStatus}</td>
                    <td className="action-buttons">
                    <Link to={`/view?loanId=${transaction._id}`}>
                      <button className="btn-view" onClick={() => console.log(`Viewing details`)}>
                        View more..
                      </button></Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button 
              className="page" 
              onClick={handlePreviousPage} 
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="pagespan" >{currentPage} of {totalPages}</span>
            <button 
              className="page" 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}

    </div>
  );
};

export default TransactionsTable;
