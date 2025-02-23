import React from 'react';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineElement, BarElement, PointElement } from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  PointElement
);

const Charts = () => {
  // Example Data for Pie Charts
  const studentApplication = {
    labels: ['Rejected', 'Accepted', 'Pending'],
    datasets: [
      {
        data: [30, 45, 25],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const visaSuccess = {
    labels: ['Accepted', 'Rejected', 'Pending'],
    datasets: [
      {
        data: [40, 20, 40],
        backgroundColor: ['#4CAF50', '#9C27B0', '#FF9800'],
        hoverBackgroundColor: ['#4CAF50', '#9C27B0', '#FF9800'],
      },
    ],
  };

  // Example Data for Line Graph
  const lineData = {
    labels: ['Nepal', 'Pakistan', 'India', 'Thailand', 'Bangladesh',
             'Myanmar','Sri Lanka', 'China','Sudan', 'Kenya', 'Egypt'],
    datasets: [
      {
        label: 'Sales',
        data: [65, 49, 80, 72, 26, 40, 55, 10, 15, 5, 21],
        fill: false,
        borderColor: '#36A2EB',
        tension: 0.4,
      },
    ],
  };

  // Example Data for Bar Graph
  const barData = {
    labels: ['MBA', 'Data Science', 'AI/ML', 'MSc Nursing', 'Petrolium Engg', 'Msc Finance'],
    datasets: [
      {
        label: 'Course Enrollments',
        data: [120, 190, 30, 50, 120, 20],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#CAF1DE', '#FF9800'],
      },
    ],
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
      {/* Pie Charts */}
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ width: '30%' }}>
          <h3>Student Application Status</h3>
          <Pie data={studentApplication} />
        </div>
        <div style={{ width: '30%' }}>
          <h3>Visa Success Rate</h3>
          <Pie data={visaSuccess} />
        </div>
      </div>

      {/* Line Graph */}
      <div style={{ width: '80%', margin: '0 auto' }}>
        <h3>Line Graph</h3>
        <Line data={lineData} />
      </div>

      {/* Bar Graph */}
      <div style={{ width: '80%', margin: '0 auto' }}>
        <h3>Bar Graph</h3>
        <Bar data={barData} />
      </div>
    </div>
  );
};

export default Charts;
