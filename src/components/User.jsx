import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import userService from "../services/users";

const User = () => {
  const id = useParams().id;

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

  if (!users || users.length === 0) {
    return null;
  }

  const user = users.find((user) => user.id === id);

  if (!user) {
    return null;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <strong>added blogs</strong>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default User;
