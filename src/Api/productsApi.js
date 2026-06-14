import axios from "axios";

export const fetchProducts = async () => {
  const { data } = await axios.get(
    "https://dummyjson.com/products?limit=12"
  );

  return data.products;
};