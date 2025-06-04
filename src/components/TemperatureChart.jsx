import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TemperatureChart = ({ temperatureHistory, color }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const getCssVariable = (variable) => {
    if (variable == '--chart-fill-color') return color + '50';
    if (variable == '--chart-line-color') return color;
    if (variable == '--chart-point-bg') return color;
    if (variable == '--chart-point-border') return color;
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  }

  useEffect(() => {
    const data = {
      labels: temperatureHistory.map((_, index) => {
        const time = new Date();
        time.setSeconds(time.getSeconds() - (temperatureHistory.length - index - 1) * 3);
        return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      }),
      datasets: [
        {
          label: "Temperature",
          data: temperatureHistory,
          fill: true,
          backgroundColor: color ? color + '50' : getCssVariable('--chart-fill-color'),
          borderColor: color || getCssVariable('--chart-line-color'),
          tension: 0.4,
          pointRadius: 5, // Slightly larger points
          pointBackgroundColor: color || getCssVariable('--chart-point-bg'),
          pointBorderColor: color || getCssVariable('--chart-point-border'),
          pointBorderWidth: 2,
          pointHoverRadius: 8, // Larger hover radius
          pointHoverBackgroundColor: getCssVariable('--chart-point-hover-bg'),
          pointHoverBorderColor: getCssVariable('--chart-point-border'),
          pointHoverBorderWidth: 3, // Thicker hover border
        },
      ],
    };


    setChartData(data);

    // This effect updates chart styling if CSS variables change (e.g., theme switch)
    const chart = chartRef.current;
    if (chart) {
      chart.options.scales.y.ticks.color = getCssVariable('--chart-tick-color');
      chart.options.scales.x.ticks.color = getCssVariable('--chart-tick-color');
      chart.options.scales.y.grid.color = getCssVariable('--chart-grid-color');
      chart.data.datasets[0].borderColor = getCssVariable('--chart-line-color');
      chart.data.datasets[0].backgroundColor = getCssVariable('--chart-fill-color');
      chart.data.datasets[0].pointBackgroundColor = getCssVariable('--chart-point-bg');
      chart.data.datasets[0].pointBorderColor = getCssVariable('--chart-point-border');
      chart.data.datasets[0].pointHoverBackgroundColor = getCssVariable('--chart-point-hover-bg');
      chart.update('none'); // Use 'none' to prevent re-animation on style update
    }

  }, [temperatureHistory, color]);

    const minTemp = Math.min(...temperatureHistory);
    const maxTemp = Math.max(...temperatureHistory);
    const yMin = Math.floor(minTemp - 5);
    const yMax = Math.ceil(maxTemp + 5);
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true, // Ensure tooltip is enabled
        backgroundColor: "rgba(0,0,0,0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "hsla(var(--primary) / 0.6)", // More visible border
        borderWidth: 1.5,
        padding: 14, // Increased padding
        cornerRadius: 10, // Softer corners
        displayColors: false, // No color box in tooltip
        titleFont: { size: 15, weight: 'bold', family: "inherit" },
        bodyFont: { size: 14, family: "inherit" },
        yAlign: 'bottom',
        caretPadding: 10,
        caretSize: 7,
        callbacks: {
          title: function (tooltipItems) {
            // Show time in title
            if (tooltipItems.length > 0) {
              return tooltipItems[0].label;
            }
            return '';
          },
          label: function (context) {
            // Show temperature in body
            return `Temp: ${context.parsed.y.toFixed(1)}°C`;
          }
        }
      },
    },
    scales: {
      y: {
        min: Math.floor(minTemp - 20),
        max: Math.ceil(maxTemp + 20),
        grid: {
          color: "var(--chart-grid-color)",
          drawBorder: false,
        },
        ticks: {
          callback: value => value.toFixed(1) + "°C",
          font: { size: 12, family: "inherit" },
          color: "var(--chart-tick-color)",
          padding: 10,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: "inherit",
          },
          color: "var(--chart-tick-color)",
          maxRotation: 0,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: 7,
          padding: 10,
        },
      },
    },
    interaction: {
      mode: "index",
      intersect: false, // Tooltip will appear when hovering near points
      axis: 'x', // Consider 'x' for better touch interaction on dense charts
    },
    animation: {
      duration: 500,
      easing: 'easeInOutQuart',
    },
  };

  return (
    <motion.div
      className="h-full w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {chartData.labels.length > 0 && <Line ref={chartRef} data={chartData} options={options} />}
    </motion.div>
  );
};

export default TemperatureChart;