import axios from "axios";
import loginService from "./login";

const baseUrl = "/api/blogs";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newBlogObject) => {
  const config = {
    headers: { Authorization: loginService.getToken() },
  };
  const response = await axios.post(baseUrl, newBlogObject, config);
  return response.data;
};

const update = async (updatedBlogObject) => {
  const config = {
    headers: { Authorization: loginService.getToken() },
  };
  const response = await axios.put(
    `${baseUrl}/${updatedBlogObject.id}`,
    updatedBlogObject,
    config
  );
  return response.data;
};

const addComment = async ({ blogId, comment }) => {
  const config = {
    headers: { Authorization: loginService.getToken() },
  };
  const response = await axios.put(
    `${baseUrl}/${blogId}/comments`,
    { comment },
    config
  );
  return response.data;
};

const deleteBlog = async (blogId) => {
  const config = {
    headers: { Authorization: loginService.getToken() },
  };
  const response = await axios.delete(`${baseUrl}/${blogId}`, config);
  return response.data;
};

export default { getAll, create, update, addComment, deleteBlog };
