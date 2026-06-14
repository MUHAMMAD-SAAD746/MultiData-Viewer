import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const ProductChart = ({ products }) => {
  const chartData = {
    labels: products
      .slice(0, 6)
      .map((p) => p.title),

    datasets: [
      {
        label: "Price",
        data: products
          .slice(0, 6)
          .map((p) => p.price),
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default ProductChart;