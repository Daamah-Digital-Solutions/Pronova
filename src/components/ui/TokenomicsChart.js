import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const TokenomicsChart = ({ className = '' }) => {
  const chartRef = useRef(null);

  // Tokenomics data from the whitepaper
  const tokenomicsData = {
    labels: [
      'Founders (7.5%)',
      'Liquidity (12%)',
      'Partnerships (15%)',
      'Team (2.5%)',
      'Presale (40%)',
      'Community (5%)',
      'Strategic Reserves (6%)',
      'Marketing & Development (12%)'
    ],
    datasets: [
      {
        data: [7.5, 12, 15, 2.5, 40, 5, 6, 12],
        backgroundColor: [
          '#2563eb', // Primary Blue
          '#1e40af', // Dark Blue
          '#7c3aed', // Purple
          '#6d28d9', // Dark Purple
          '#f59e0b', // Amber
          '#10b981', // Emerald
          '#3b82f6', // Light Blue
          '#8b5cf6'  // Light Purple
        ],
        borderColor: [
          '#ffffff',
          '#ffffff',
          '#ffffff',
          '#ffffff',
          '#ffffff',
          '#ffffff',
          '#ffffff',
          '#ffffff'
        ],
        borderWidth: 2,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          font: {
            size: 14
          },
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
        }
      },
      tooltip: {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
        titleColor: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
        bodyColor: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
        borderColor: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 16,
          weight: 'bold'
        },
        bodyFont: {
          size: 14
        },
        displayColors: true,
        boxWidth: 10,
        boxHeight: 10,
        boxPadding: 3,
        usePointStyle: true
      }
    },
    cutout: '65%',
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  // Update chart theme when dark mode changes
  useEffect(() => {
    const updateChartTheme = () => {
      if (chartRef.current) {
        const isDarkMode = document.documentElement.classList.contains('dark');
        
        chartRef.current.options.plugins.legend.labels.color = isDarkMode ? '#e5e7eb' : '#374151';
        chartRef.current.options.plugins.tooltip.backgroundColor = isDarkMode ? '#1f2937' : '#ffffff';
        chartRef.current.options.plugins.tooltip.titleColor = isDarkMode ? '#ffffff' : '#000000';
        chartRef.current.options.plugins.tooltip.bodyColor = isDarkMode ? '#e5e7eb' : '#374151';
        chartRef.current.options.plugins.tooltip.borderColor = isDarkMode ? '#374151' : '#e5e7eb';
        
        chartRef.current.update();
      }
    };

    // Set up a MutationObserver to watch for changes to the 'dark' class on the html element
    const observer = new MutationObserver(updateChartTheme);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`h-[400px] md:h-[500px] ${className}`}>
      <Doughnut 
        data={tokenomicsData} 
        options={options} 
        ref={chartRef}
      />
    </div>
  );
};

export default TokenomicsChart;