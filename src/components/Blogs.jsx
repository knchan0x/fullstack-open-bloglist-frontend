import { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import blogService from "../services/blogs";

import Togglable from "./Togglable";
import NewBlogForm from "./NewBlogForm";

const Blogs = ({ user, handleNotice }) => {
  const queryClient = useQueryClient();
  const createMutation = useMutation({ mutationFn: blogService.create });
  const updateMutation = useMutation({ mutationFn: blogService.update });

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

  return (
    <div>
      <Togglable buttonLabel="create" ref={newBlogFormRef}>
        <NewBlogForm handleCreate={handleCreateBlog} />
      </Togglable>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <p key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </Link>
          </p>
        ))}
    </div>
  );
};

export default Blogs;
