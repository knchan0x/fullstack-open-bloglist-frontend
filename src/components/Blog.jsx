import { useState } from "react";

const Blog = ({ user, blog, handleAddLikes, handleDelete }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const [visible, setVisible] = useState(false);

  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const addLikes = () => {
    handleAddLikes({
      ...blog,
      likes: blog.likes + 1,
    });
  };

  const deleteBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      handleDelete(blog.id);
    }
  };

  return (
    <div className="blog" style={blogStyle}>
      <p>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? "hide" : "view"}</button>
      </p>
      <div className="blog-detail" style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>
          likes {blog.likes}
          <button id="add-like-button" onClick={addLikes}>like</button>
        </p>
        <p>{blog.user.name}</p>
        {blog.user.username === user.username && <button id="delete-button" onClick={deleteBlog}>remove</button> }
      </div>
    </div>
  );
};

export default Blog;
