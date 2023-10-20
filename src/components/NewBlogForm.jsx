import { useState } from "react";

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
    <form onSubmit={create}>
      <div>
        title
        <input
          id="input-title"
          type="text"
          value={title}
          name="Title"
          placeholder="write blog title here"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author
        <input
          id="input-author"
          type="text"
          value={author}
          name="Author"
          placeholder="write blog author here"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url
        <input
          id="input-url"
          type="text"
          value={url}
          name="Url"
          placeholder="input blog url here"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button id="create-button" type="submit">create</button>
    </form>
  );
};

export default NewBlogForm;
