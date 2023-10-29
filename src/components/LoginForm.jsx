import { useState } from "react";
import { Stack, Button, TextInput, PasswordInput, Space } from "@mantine/core";

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = (event) => {
    event.preventDefault();
    handleLogin({
      username,
      password,
    });
    setUsername("");
    setPassword("");
  };

  return (
    <Stack align="flex-start">
      <form onSubmit={login}>
        <TextInput
          label="Username"
          variant="filled"
          id="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
        <Space h="md" />
        <PasswordInput
          label="Password"
          variant="filled"
          id="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
        <Space h="md" />
        <Button id="login-button" type="submit">
          login
        </Button>
      </form>
    </Stack>
  );
};

export default LoginForm;
