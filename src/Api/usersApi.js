import axios from "axios";

export const fetchUsers = async () => {
  const { data } = await axios.get(
    "https://randomuser.me/api/?results=12"
  );

  return data.results;
};