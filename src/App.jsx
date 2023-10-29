import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import NewBlogForm from "./components/NewBlogForm";
import Togglable from "./components/Togglable";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [notice, setNotice] = useState(null);

  const newBlogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const userJSON = window.localStorage.getItem("blogUser");
    if (userJSON) {
      const user = JSON.parse(userJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const newNotice = ({ type, message }) => {
    setNotice({
      type: type,
      message: message,
    });
    setTimeout(() => {
      setNotice(null);
    }, 5000);
  };

  const handleLogin = async (userObject) => {
    try {
      const user = await loginService.login(userObject);
      window.localStorage.setItem("blogUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
    } catch (exception) {
      newNotice({
        type: "error",
        message: "Wrong credentials",
      });
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("blogUser");
    window.location.reload();
  };

  const handleCreateBlog = async (newBlogObject) => {
    try {
      newBlogFormRef.current.toggleVisibility();
      const blog = await blogService.create(newBlogObject);
      setBlogs(
        blogs.concat({
          ...blog,
          user: {
            username: user.username,
            name: user.name,
          },
        })
      );
      newNotice({
        type: "success",
        message: `a new blog ${blog.title} by ${blog.author} added`,
      });
    } catch (error) {
      newNotice({
        type: "error",
        message: `Error: ${error.response.data.error}`,
      });
    }
  };

  const handleAddLikes = async (updatedBlogObject) => {
    try {
      const blog = await blogService.update(updatedBlogObject);
      const index = blogs.findIndex((blog) => blog.id === updatedBlogObject.id);
      const updated = [...blogs];
      if (index > -1) {
        updated[index] = {
          ...blog,
          user: {
            username: user.username,
            name: user.name,
          },
        };
      }
      setBlogs(updated);
    } catch (error) {
      newNotice({
        type: "error",
        message: `Error: ${error.response.data.error}`,
      });
    }
  };

  const handleDelete = async (blogId) => {
    try {
      await blogService.deleteBlog(blogId);
      setBlogs(blogs.filter((blog) => blog.id !== blogId));
    } catch (error) {
      newNotice({
        type: "error",
        message: `Error: ${error.response.data.error}`,
      });
    }
  };

  const blogList = () => (
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

  const loginForm = () => {
    return (
      <Togglable buttonLabel="login">
        <LoginForm handleLogin={handleLogin} />
      </Togglable>
    );
  };

  return (
    <div>
      <h1>{user === null ? "log in to the application" : "blogs"}</h1>
      <Notification message={notice} />
      {user === null ? loginForm() : blogList()}
    </div>
  );
};

export default App;
