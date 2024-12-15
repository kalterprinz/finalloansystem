import React, { useState, useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import axios from "axios";
import './Graphs.css';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
Chart.register(ChartDataLabels);


const Graphs = () => {
  const [repaymentStatusData, setRepaymentStatusData] = useState({ paid: 0, overdue: 0, upcoming: 0 });
  const [loanTypeData, setLoanTypeData] = useState({ personal: 0, educational: 0, pensioner: 0 });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [age, setAge] = useState({ fir: 0,sec: 0,thi: 0,fou: 0});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: paydata } = await axios.get('http://192.168.1.82:3001/loans/payment/graph');
        const { data: typedata } = await axios.get('http://192.168.1.82:3001/loans/type/graph');
        const { data: ageRes } = await axios.get('http://192.168.1.82:3001/loan/age-distribution');

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

        setAge({
          fir: ageRes.group18_25 || 0,
          sec: ageRes.group26_35 || 0,
          thi: ageRes.group36_50 || 0,
          fou: ageRes.groupAbove50 || 0,
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


  const repaymentStatusChartData = {
    labels: ['Paid', 'Overdue', 'Upcoming'],
    datasets: [
      {
        label:  "Loan Repayment Status",
        data: [repaymentStatusData.paid, repaymentStatusData.overdue, repaymentStatusData.upcoming],
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
        text: 'Loan Repayment Status',
        font: {
          size: 15,
        },
        padding: {
          top: -15,
          bottom:50,
        },
      },
      legend: {
        display: false,
        position: 'top',
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
  
 

  const loanTypeDonutData = {
    labels: ["Personal", "Educational", "Pensioner"],
    datasets: [
      {
        label: "Loan Type Breakdown",
        data: [loanTypeData.personal, loanTypeData.educational, loanTypeData.pensioner],
        backgroundColor: ["#4caf50", "#f44336", "#ff9800"],
        borderColor: ["#4caf50", "#f44336", "#ff9800"],
      },
    ],
  };
  const optiondonut = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Loan Type Breakdown',
        font: {
          size: 15,
          
        },
        padding: {
          top: -15,
          bottom:20,
        },
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          font: {
            size: 14,
          },
          padding: 20,
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


  return (
    <div className="graphs">
      {loading ? (
        <div className="loader">Loading...</div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="small-graphs">
          <div className="small-graph">
            <Bar
              data={repaymentStatusChartData}
              options={optionrepay}
            />
                   
          </div>
          {/*<div className="small-graph">
           <Bar 
              data={ageDistributionData} 
              options={ageChartOptions} />
            
          </div>*/}
          <div className="small-graph1">
            <Doughnut
              data={loanTypeDonutData}
              options={optiondonut}
            />
          </div>
          
        </div>
      )}
    </div>
  );
};

export default Graphs;