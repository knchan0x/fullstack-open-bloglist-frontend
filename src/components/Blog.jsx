import { useParams } from "react-router-dom";
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import blogService from "../services/blogs";

const Blog = ({ handleNotice }) => {
  const id = useParams().id;
  const [comment, setComment] = useState("");

  const queryClient = useQueryClient();
  const updateMutation = useMutation({ mutationFn: blogService.update });
  const addCommentMutation = useMutation({
    mutationFn: blogService.addComment,
  });

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

  if (!blogs || blogs.length === 0) {
    return null;
  }

  const blog = blogs.find((blog) => blog.id === id);

  if (!blog) {
    return null;
  }

  const handleAddLikes = () => {
    const updatedBlogObject = {
      ...blog,
      likes: blog.likes + 1,
    };

    updateMutation.mutate(updatedBlogObject, {
      onSuccess: (newBlog) => {
        const blogs = queryClient.getQueryData(["blogs"]);
        queryClient.setQueryData(
          ["blogs"],
          blogs.map((blog) =>
            blog.id === updatedBlogObject.id ? updatedBlogObject : blog
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

  const handleAddComment = (e) => {
    e.preventDefault();
    if (comment !== "") {
      const blogId = blog.id;
      addCommentMutation.mutate(
        { blogId, comment },
        {
          onSuccess: (newBlog) => {
            const blogs = queryClient.getQueryData(["blogs"]);
            queryClient.setQueryData(
              ["blogs"],
              blogs.map((blog) =>
                blog.id === blogId
                  ? {
                    ...blog,
                    comments: blog.comments.concat(comment),
                  }
                  : blog
              )
            );
          },
          onError: (error) => {
            handleNotice({
              type: "error",
              message: `Error: ${error.response.data.error}`,
            });
          },
        }
      );
    }
  };

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
        <p>
          likes {blog.likes}
          <button id="add-like-button" onClick={handleAddLikes}>
            like
          </button>
        </p>
        <p>added by {blog.user.name}</p>
      </div>
      <h3>comments</h3>
      <form onSubmit={handleAddComment}>
        <input
          type="text"
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments.map((comment) => (
          <li key={comment}>{comment}</li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;
