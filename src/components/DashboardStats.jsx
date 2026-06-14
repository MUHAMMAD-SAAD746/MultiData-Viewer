import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

const DashboardStats = ({
  products,
  users,
  crypto,
}) => {
  const totalProducts = products.length;

  const averagePrice =
    products.reduce(
      (sum, p) => sum + p.price,
      0
    ) / products.length;

  const topCoin = crypto[0]?.name;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent>
          <Typography color="text.secondary">
            Total Products
          </Typography>

          <Typography variant="h4">
            {totalProducts}
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography color="text.secondary">
            Users
          </Typography>

          <Typography variant="h4">
            {users.length}
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography color="text.secondary">
            Avg Product Price
          </Typography>

          <Typography variant="h4">
            ${averagePrice.toFixed(0)}
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography color="text.secondary">
            Top Coin
          </Typography>

          <Typography variant="h5">
            {topCoin}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;