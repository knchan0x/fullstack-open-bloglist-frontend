import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewBlogForm from "./NewBlogForm";

describe("<NewBlogForm />", () => {
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

  const handleCreateBlog = jest.fn();

  let container;

  beforeEach(() => {
    container = render(
      <NewBlogForm handleCreate={handleCreateBlog} />
    ).container;
  });

  test("updates parent state and calls onSubmit", async () => {
    const user = userEvent.setup();

    const titleInput = screen.getByPlaceholderText("write blog title here");
    const authorInput = screen.getByPlaceholderText("write blog author here");
    const urlInput = screen.getByPlaceholderText("input blog url here");
    const submitButton = screen.getByText("create");

    await user.type(titleInput, blog.title);
    await user.type(authorInput, blog.author);
    await user.type(urlInput, blog.url);
    await user.click(submitButton);

    expect(handleCreateBlog.mock.calls).toHaveLength(1);
    expect(handleCreateBlog.mock.calls[0][0]).toEqual({
      title: blog.title,
      author: blog.author,
      url: blog.url,
    });
  });
});
