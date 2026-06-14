import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const CryptoChart = ({ crypto }) => {
  const chartData = {
    labels: crypto
      .slice(0, 5)
      .map((coin) => coin.name),

    datasets: [
      {
        data: crypto
          .slice(0, 5)
          .map(
            (coin) => coin.current_price
          ),
      },
    ],
  };

  return <Doughnut data={chartData} />;
};

export default CryptoChart;