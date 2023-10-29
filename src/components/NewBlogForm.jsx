import { useState } from "react";
import { Button, TextInput, Stack, Space } from "@mantine/core";

const NewBlogForm = ({ handleCreate }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const create = (event) => {
    event.preventDefault();
    handleCreate({ title, author, url });
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <Stack align="flex-start">
      <form onSubmit={create}>
        <TextInput
          label="Title"
          id="input-title"
          type="text"
          value={title}
          name="Title"
          placeholder="write blog title here"
          onChange={({ target }) => setTitle(target.value)}
        />
        <Space h="md" />
        <TextInput
          label="Author"
          id="input-author"
          type="text"
          value={author}
          name="Author"
          placeholder="write blog author here"
          onChange={({ target }) => setAuthor(target.value)}
        />
        <Space h="md" />
        <TextInput
          label="URL"
          id="input-url"
          type="text"
          value={url}
          name="Url"
          placeholder="input blog url here"
          onChange={({ target }) => setUrl(target.value)}
        />
        <Space h="md" />
        <Button id="create-button" type="submit">
          create
        </Button>
      </form>
    </Stack>
  );
};

export default NewBlogForm;
