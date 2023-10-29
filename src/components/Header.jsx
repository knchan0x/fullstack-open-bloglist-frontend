import Menu from "./Menu";
import Notification from "./Notification";
import { Text } from "@mantine/core";

const Header = ({ user }) => {
  return (
    <div>
      <Menu user={user} />
      <Text size="xl">blog app</Text>
      <Notification />
    </div>
  );
};

export default Header;
