import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LockedTokensChart = ({ className = '' }) => {
  const chartRef = useRef(null);

  // Locked tokens data from the whitepaper
  const lockedTokensData = {
    labels: [
      'Founders (7% out of 7.5%)',
      'Partnerships (15% out of 15%)',
      'Team (2% out of 2.5%)',
      'Community (5% out of 5%)',
      'Strategic Reserves (6% out of 6%)',
      'Marketing (10% out of 12%)'
    ],
    datasets: [
      {
        label: 'Locked Tokens (%)',
        data: [7, 15, 2, 5, 6, 10],
        backgroundColor: [
          'rgba(37, 99, 235, 0.8)',
          'rgba(124, 58, 237, 0.8)',
          'rgba(5, 150, 105, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderColor: [
          'rgba(37, 99, 235, 1)',
          'rgba(124, 58, 237, 1)',
          'rgba(5, 150, 105, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(139, 92, 246, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          font: {
            size: 14
          },
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
        }
      },
      title: {
        display: true,
        text: 'Pronova Locked Tokens Distribution',
        font: {
          size: 16,
          weight: 'bold'
        },
        color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
        padding: 20
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
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
          font: {
            size: 12
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
          font: {
            size: 12
          }
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    }
  };

  // Update chart theme when dark mode changes
  useEffect(() => {
    const updateChartTheme = () => {
      if (chartRef.current) {
        const isDarkMode = document.documentElement.classList.contains('dark');
        
        chartRef.current.options.plugins.legend.labels.color = isDarkMode ? '#e5e7eb' : '#374151';
        chartRef.current.options.plugins.title.color = isDarkMode ? '#e5e7eb' : '#374151';
        chartRef.current.options.plugins.tooltip.backgroundColor = isDarkMode ? '#1f2937' : '#ffffff';
        chartRef.current.options.plugins.tooltip.titleColor = isDarkMode ? '#ffffff' : '#000000';
        chartRef.current.options.plugins.tooltip.bodyColor = isDarkMode ? '#e5e7eb' : '#374151';
        chartRef.current.options.plugins.tooltip.borderColor = isDarkMode ? '#374151' : '#e5e7eb';
        chartRef.current.options.scales.y.grid.color = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        chartRef.current.options.scales.y.ticks.color = isDarkMode ? '#e5e7eb' : '#374151';
        chartRef.current.options.scales.x.ticks.color = isDarkMode ? '#e5e7eb' : '#374151';
        
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
      <Bar 
        data={lockedTokensData} 
        options={options} 
        ref={chartRef}
      />
    </div>
  );
};

export default LockedTokensChart;