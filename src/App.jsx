import { Routes, Route, Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useNotificationDispatch } from "./contexts/NotificationContext";

import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import Blogs from "./components/Blogs";
import Blog from "./components/Blog";
import Users from "./components/Users";
import User from "./components/User";
import Header from "./components/Header";

import loginService from "./services/login";

const App = () => {
  const noticeDispatch = useNotificationDispatch();

  const queryClient = useQueryClient();
  const loginMutation = useMutation({ mutationFn: loginService.login });

  const userResult = useQuery({
    queryKey: ["user"],
    queryFn: loginService.getStoredUser,
  });

  if (userResult.isLoading) {
    return <div>loading user data...</div>;
  }

  const user = userResult.data;

  if (user) {
    loginService.setToken(user.token);
  }

  const newNotice = (msgObject) => {
    noticeDispatch({
      type: "SET_MESSAGE",
      payload: msgObject,
    });
    setTimeout(() => {
      noticeDispatch({
        type: "CLEAN_MESSAGE",
      });
    }, 5000);
  };

  const handleLogin = async (userObject) => {
    loginMutation.mutate(userObject, {
      onSuccess: (user) => {
        queryClient.setQueryData(["user"], user);
        loginService.setToken(user.token);
        window.localStorage.setItem("blogUser", JSON.stringify(user));
      },
      onError: (error) => {
        newNotice({
          type: "error",
          message: "Wrong credentials",
        });
      },
    });
  };

  const loginForm = () => {
    return (
      <Togglable buttonLabel="login">
        <LoginForm handleLogin={handleLogin} />
      </Togglable>
    );
  };

  return (
    <div>
      <Header user={user} />
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Blogs user={user} handleNotice={newNotice} />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={user ? <Navigate replace to="/" /> : loginForm()}
        />
        <Route
          path="/blogs/:id"
          element={
            user ? (
              <Blog handleNotice={newNotice} />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route
          path="/users"
          element={user ? <Users /> : <Navigate replace to="/login" />}
        />
        <Route
          path="/users/:id"
          element={user ? <User /> : <Navigate replace to="/login" />}
        />
      </Routes>
    </div>
  );
};

export default App;
