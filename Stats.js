import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Stats.css';

const Stats = () => {
    const [stats, setStats] = useState({
        approvedLoans: 0,
        pendingApplications: 0,
        reviewApplication:0,
        rejectedApplication: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [
                    approvedLoansRes,
                    pendingApplicationsRes,
                    reviewApplicationRes,
                    rejectedApplicationRes,
                ] = await Promise.all([
                    axios.get('http://192.168.1.82:3001/loan/approved/count'), // Fetch approved loans count
                    axios.get('http://192.168.1.82:3001/loan/pending/count'),
                    axios.get('http://192.168.1.82:3001/loan/review/count'), // Fetch review applications count
                    axios.get('http://192.168.1.82:3001/loan/rejected/count'),
                ]);


                setStats({
                    approvedLoans: approvedLoansRes.data.count || 0,
                    pendingApplications: pendingApplicationsRes.data.count || 0,
                    reviewApplication: reviewApplicationRes.data.count || 0, // Set review count
                    rejectedApplication: rejectedApplicationRes.data.count || 0,                });
            } catch (err) {
                console.error('Error fetching stats:', err.message);
                // Optionally, set stats to indicate failure
                setStats((prevStats) => ({
                    ...prevStats,
                    error: true, // Add an error flag (if needed)
                }));
            }
        };

        fetchStats();
    }, []); // Dependency array ensures this runs only on mount
    console.log('Stats:', stats);
    return (
        <div className="stats-container">
            <div className="stats">
                <div className="stat-box active-loans">
                    <h2>{stats.approvedLoans}</h2>
                    <p>Total Active/Approved Loans</p>
                </div>
                <div className="stat-box pending-applications">
                    <h2>{stats.pendingApplications}</h2>
                    <p>Pending Loan Applications</p>
                </div>
                
                <div className="stat-box review-payments">
                    <h2>{stats.reviewApplication}</h2>
                    <p>On Review Applications</p>
                </div>
                <div className="stat-box rejected-applications">
                    <h2>{stats.rejectedApplication}</h2>
                    <p>Rejected Applications</p>
                </div>
            </div>
        </div>
    );
};

export default Stats;
