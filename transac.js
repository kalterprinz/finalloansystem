import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Ensure jwt-decode is installed
import { useNavigate } from 'react-router-dom';

const TransactionHistory = () => {
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const fetchPaymentStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage. Please log in.');
        setError('You must log in.');
        setLoading(false);
        navigate('/login');
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken?.id; // Adjust based on your token structure

      if (!userId) {
        throw new Error('Invalid token: userId not found.');
      }

      // Fetch payment and loan details
      const loanResponse = await fetch(`http://192.168.1.82:3001/api/toget/payment/${userId}`);
      if (!loanResponse.ok) {
        throw new Error(`Failed to fetch loan details: ${loanResponse.statusText}`);
      }

      const loanData = await loanResponse.json();
      setPayment(loanData);
    } catch (error) {
      console.error('Error fetching loan status:', error);
      setError('Error fetching loan status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentStatus();
  }, []);

  return (
    <div className="transaction-history">
  {loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div className="error-message">{error}</div>
  ) : (
    <>
      <div className="transactions-tableb">
        <div className="transactions-headerb">
          <span>
            <i className="fas fa-calendar" style={{ marginRight: '8px' }}></i>Payment Schedule
          </span>
        </div>
        <table>
          <thead className="theadb">
            <tr>
              <th>Month</th>
              <th>Amount Due</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody className="transactions-tableb">
            {payment.map((payment) => (
              <tr key={payment._id}>
                <td>{payment?.paymentDate || 'N/A'}</td>
                <td>{payment?.amountDue || 'N/A'}</td>
                <td>{payment?.paymentStatus || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
    </>
  )}
</div>
  );
};

export default TransactionHistory;
