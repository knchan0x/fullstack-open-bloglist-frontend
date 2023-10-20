import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("<Blog />", () => {
  const blog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    user: {
      username: "test",
      name: "Test User",
    },
    id: "5a422a851b54a676234d17f7",
  };

  const handleAddLikes = jest.fn();
  const handleDelete = jest.fn();

  let container;

  beforeEach(() => {
    container = render(
      <Blog
        key={blog.id}
        blog={blog}
        handleAddLikes={handleAddLikes}
        handleDelete={handleDelete}
      />
    ).container;
  });

  test("at start the blog title and author are shown", () => {
    const header = screen.getByText(`${blog.title} ${blog.author}`);
    expect(header).toBeDefined();
  });

  test("at start the blog detail are not displayed", () => {
    const div = container.querySelector(".blog-detail");
    expect(div).toHaveStyle("display: none");
  });

  test("after clicking the view button, blog detail is displayed", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("view");
    await user.click(button);

    const div = container.querySelector(".blog-detail");
    expect(div).not.toHaveStyle("display: none");
  });

  test("after clicking the like button, updates parent state and calls onClick", async () => {
    const user = userEvent.setup();

    const button = screen.getByText("like");
    await user.click(button);
    await user.click(button);

    expect(handleAddLikes.mock.calls).toHaveLength(2);
  });
});
