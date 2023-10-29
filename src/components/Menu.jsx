import { Link } from "react-router-dom";
import { Group, Anchor, Text, Button } from "@mantine/core";

const Menu = ({ user }) => {
  const padding = {
    paddingRight: 5,
  };

  const handleLogout = () => {
    window.localStorage.removeItem("blogUser");
    window.location.reload();
  };

  if (!user) {
    return (
      <Group>
        <Anchor component={Link} to="/" underline="hover">
          blogs
        </Anchor>
        <Anchor component={Link} to="/users" underline="hover">
          users
        </Anchor>
      </Group>
    );
  }

  return (
    <div>
      <Group>
        <Anchor component={Link} to="/" underline="hover">
          blogs
        </Anchor>
        <Anchor component={Link} to="/users" underline="hover">
          users
        </Anchor>
        <Text>{user.name} logged in</Text>
        <Button variant="light" size="xs" onClick={handleLogout}>
          logout
        </Button>
      </Group>
    </div>
  );
};

export default Menu;
