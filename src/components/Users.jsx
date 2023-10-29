import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import userService from "../services/users";

const userRow = (user) => {
  return (
    <tr key={user.id}>
      <td>
        <Link to={`/users/${user.id}`}>{user.name}</Link>
      </td>
      <td>{user.blogs.length}</td>
    </tr>
  );
};

const Users = () => {
  const usersResult = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
  });

  if (usersResult.isLoading) {
    return <div>loading data...</div>;
  }

  if (usersResult.isError) {
    return <div>blog service not available due to problems in server</div>;
  }

  const users = usersResult.data;

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>{users.map((user) => userRow(user))}</tbody>
      </table>
    </div>
  );
};

export default Users;
