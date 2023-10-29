import axios from "axios";
const baseUrl = "/api/login";

const login = async ({ username, password }) => {
  const request = await axios.post(baseUrl, { username, password });
  return request.data;
};

const getStoredUser = () => {
  const userJSON = window.localStorage.getItem("blogUser");
  if (userJSON) {
    return JSON.parse(userJSON);
  }
  return null;
};

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getToken = () => token;

export default { login, getStoredUser, setToken, getToken };
