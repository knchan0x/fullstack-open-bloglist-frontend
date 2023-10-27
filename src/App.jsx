import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useNotificationDispatch } from "./contexts/NotificationContext";

import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import Notification from "./components/Notification";
import BlogList from "./components/Blogs";

import blogService from "./services/blogs";
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
    blogService.setToken(user.token);
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
        blogService.setToken(user.token);
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
      <h1>{user === null ? "log in to the application" : "blogs"}</h1>
      <Notification />
      {user === null ? (
        loginForm()
      ) : (
        <BlogList user={user} handleNotice={newNotice} />
      )}
    </div>
  );
};

export default App;
