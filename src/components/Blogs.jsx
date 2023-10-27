import { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import blogService from "../services/blogs";

import Blog from "./Blog";
import Togglable from "./Togglable";
import NewBlogForm from "./NewBlogForm";

const BlogList = ({ user, handleNotice }) => {
  const queryClient = useQueryClient();
  const createMutation = useMutation({ mutationFn: blogService.create });
  const updateMutation = useMutation({ mutationFn: blogService.update });
  const deleteMutation = useMutation({ mutationFn: blogService.deleteBlog });

  const newBlogFormRef = useRef();

  const blogsResult = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
  });

  if (blogsResult.isLoading) {
    return <div>loading data...</div>;
  }

  if (blogsResult.isError) {
    return <div>blog service not available due to problems in server</div>;
  }

  const blogs = blogsResult.data;

  const handleCreateBlog = async (newBlogObject) => {
    newBlogFormRef.current.toggleVisibility();

    createMutation.mutate(newBlogObject, {
      onSuccess: (newBlog) => {
        const blogs = queryClient.getQueryData(["blogs"]);
        queryClient.setQueryData(["blogs"], [...blogs, newBlog]);
        handleNotice({
          type: "success",
          message: `a new blog ${newBlogObject.title} by ${newBlogObject.author} added`,
        });
      },
      onError: (error) => {
        handleNotice({
          type: "error",
          message: `Error: ${error.response.data.error}`,
        });
      },
    });
  };

  const handleAddLikes = async (updatedBlogObject) => {
    updateMutation.mutate(updatedBlogObject, {
      onSuccess: (newBlog) => {
        const blogs = queryClient.getQueryData(["blogs"]);
        const blogToUpdate = {
          ...updatedBlogObject,
          user: {
            username: user.username,
            name: user.name,
          },
        };
        queryClient.setQueryData(
          ["blogs"],
          blogs.map((blog) =>
            blog.id === updatedBlogObject.id ? blogToUpdate : blog
          )
        );
      },
      onError: (error) => {
        handleNotice({
          type: "error",
          message: `Error: ${error.response.data.error}`,
        });
      },
    });
  };

  const handleDelete = async (blogId) => {
    deleteMutation.mutate(blogId, {
      onSuccess: () => {
        const blogs = queryClient.getQueryData(["blogs"]);
        queryClient.setQueryData(
          ["blogs"],
          blogs.filter((blog) => blog.id !== blogId)
        );
      },
      onError: (error) => {
        handleNotice({
          type: "error",
          message: `Error: ${error.response.data.error}`,
        });
      },
    });
  };

  const handleLogout = () => {
    window.localStorage.removeItem("blogUser");
    window.location.reload();
  };

  return (
    <div>
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="create" ref={newBlogFormRef}>
        <NewBlogForm handleCreate={handleCreateBlog} />
      </Togglable>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            user={user}
            blog={blog}
            handleAddLikes={handleAddLikes}
            handleDelete={handleDelete}
          />
        ))}
    </div>
  );
};

export default BlogList;
