import axios from "axios";

export const fetchCrypto = async () => {
  const { data } = await axios.get(
    "https://api.coingecko.com/api/v3/coins/markets",
    {
      params: {
        vs_currency: "usd",
        per_page: 12,
        page: 1,
      },
    }
  );

  return data;
};