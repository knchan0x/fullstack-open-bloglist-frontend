import axios from "axios";
import loginService from "./login";

const baseUrl = "/api/users";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newUserObject) => {
  const config = {
    headers: { Authorization: loginService.getToken() },
  };
  const response = await axios.post(baseUrl, newUserObject, config);
  return response.data;
};

export default { getAll, create };
