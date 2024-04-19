import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Box } from '@mui/material';
// Register the necessary chart components for Bar chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const UserStudyChart = ({ data, chartType = 'bar' }) => {
  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    },
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Categories'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Values'
        }
      }
    }
  };

  return (
    <Box sx={{ width: '100%', height: '400px' }}>
      {chartType === 'bar' && <Bar data={data} options={options} />}
      {/* Add other chart types if needed */}
    </Box>
  );
};

export default UserStudyChart;
