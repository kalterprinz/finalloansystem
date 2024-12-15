import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './officerprof.css'; 
import Chart from 'chart.js/auto';

const OfficerProf = () => {
    const [loggedIn, setLoggedIn] = useState(true); // Define the loggedIn state
    const navigate = useNavigate(); // For navigation after logout

    useEffect(() => {
        const ctx = document.getElementById('myPieChart').getContext('2d');
        
        // Create a new chart instance
        const myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [
                    'Pending Loan Applications', 
                    'Overdue', 
                    'Due Date', 
                    'Active Loans'
                ],
                datasets: [{
                    label: 'Statistics',
                    data: [12, 19, 3, 10],// call diri 
                    backgroundColor: [
                        '#a020f0', 
                        '#f08080', 
                        '#ffd700', 
                        '#000080'
                    ],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false // Custom legend handling
                    }
                }
            }
        });

        // Cleanup function to destroy the chart when the component unmounts
        return () => {
            myChart.destroy();
        };
    }, []);

    const handleLogout = () => {
        // Remove token and other user info from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        setLoggedIn(false); // Update loggedIn state to false
        navigate('/login'); // Redirect to home page after logout
    };

    return (
        <div className="container">
            <header className="headeroffprof">
                <img src="logo.png" alt="MSU-IIT NMPC Logo" className="logol"/>
                <h2 className="landingh2">MSU-IIT National Multi-Purpose Cooperative</h2>
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
                    <Link to="/Officerprof">Profile</Link>
                </nav>

                <div className="Log" onClick={handleLogout}>
                    <img src="Sign_out_squre.png" alt="Logout" className="outpic" />
                    <div className="logoutcont">
                        <Link to="/login" className="logout">Logout</Link>
                    </div>
                </div>
            </div>

            <main1 className="dashboard">
                <div>
                    <div>
                        <img src="cover.png" alt="MSU-IIT NMPC Logo" className="bannero"/>
                    </div>
                    <div className="content1">
                        <aside>
                            <div className="profile-section">
                                <div className="profile-info">
                                    <img src="User_circle1.png" alt="Profile" className="profile-photo1" />
                                    <h2 className="name3">Nicholas Patrick</h2>                
                                </div>

                                <div className="about-info1">
                                    <h4>About</h4>
                                    <p><i className="fas fa-male" style={{ marginRight: '8px' }}></i><strong>Male</strong></p><hr />
                                    <p><i className="fas fa-map-marker-alt" style={{ marginRight: '8px' }}></i>2nd Floor, Robinsons Mall, Macapagal Ave, Iligan City</p><hr />
                                    <p><i className="fas fa-envelope" style={{ marginRight: '8px' }}></i>charles5182@ummoh.com</p><hr />
                                    <p><i className="fas fa-phone" style={{ marginRight: '8px' }}></i>33757005467</p> <hr />
                                </div>
                            </div>
                        </aside>

                        <div className="dashboard-welcome">
                            <div className="welcome-text">
                                <h3>Welcome back Mr. Del Valle!<br/>Check dashboard</h3>
                            </div>
                            <div className="welcome-image">
                                <img src="bg.png" alt="Welcome Dashboard" />
                            </div>
                        </div>
                    </div>
                </div>
            </main1>
            <main2>
                <div className="statistics-section">
                    <div className="statistics-container">
                        <div className="legend">
                        <div className="stathead"><h2>Statistics</h2></div>
                            <ul>
                                <li><span className="color-box" style={{ backgroundColor: '#a020f0' }}></span> Pending Loan Applications</li>
                                <li><span className="color-box" style={{ backgroundColor: '#f08080' }}></span> Overdue</li>
                                <li><span className="color-box" style={{ backgroundColor: '#ffd700' }}></span> Due Date</li>
                                <li><span className="color-box" style={{ backgroundColor: '#000080' }}></span> Active Loans</li>
                            </ul>
                        </div>
                        <div className="chart-container">
                            <canvas id="myPieChart"></canvas>
                        </div>
                    </div><br/><br/>
                </div>

            </main2>
            
            
            
        </div>
    );
}

export default OfficerProf;