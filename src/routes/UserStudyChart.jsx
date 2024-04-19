import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the necessary chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const UserStudyChart = ({ data }) => {
  const options = {
    maintainAspectRatio: true,
    aspectRatio: 1.5,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    responsive: true,
  };

  return (
    <Box sx={{ width: 400, height: 400 }}>
      <Pie data={data} options={options} />
    </Box>
  );
};

export default UserStudyChart;
