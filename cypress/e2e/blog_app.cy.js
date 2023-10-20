describe("Note app", function () {
  const users = [
    {
      name: "Matti Luukkainen",
      username: "mluukkai",
      password: "salainen",
    },
    {
      name: "Michael",
      username: "michael",
      password: "testing",
    },
  ];

  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
    users.map((user) =>
      cy.request("POST", `${Cypress.env("BACKEND")}/users`, user)
    );
    cy.visit("");
  });

  it("login form is shown", function () {
    cy.contains("log in to the application");
    cy.contains("login").click();
  });

  it("succeeds with correct credentials", function () {
    cy.contains("login").click();
    cy.get("#username").type(users[0].username);
    cy.get("#password").type(users[0].password);
    cy.get("#login-button").click();

    cy.contains(`${users[0].name} logged in`);
  });

  it("fails with wrong credentials", function () {
    cy.contains("login").click();
    cy.get("#username").type(users[0].username);
    cy.get("#password").type("incorrect_password");
    cy.get("#login-button").click();

    cy.get(".notification.error")
      .should("contain", "Wrong credentials")
      .and("have.css", "color", "rgb(255, 0, 0)")
      .and("have.css", "border-style", "solid");

    cy.contains(`${users.name} logged in`).should("not.exist");
  });

  describe("When logged in", function () {
    const initialBlogs = [
      {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 5,
      },
      {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_HarBlog.html",
        likes: 10,
      },
    ];

    const newBlog = {
      title: "will remove this soon",
      author: "noname",
      url: "https://delete.it/",
    };

    beforeEach(function () {
      cy.login(users[0]);
      initialBlogs.map((blog) => cy.createBlog(blog));
    });

    it("A blog can be created", function () {
      cy.contains("create").click();
      cy.get("#input-title").type(newBlog.title);
      cy.get("#input-author").type(newBlog.author);
      cy.get("#input-url").type(newBlog.url);
      cy.get("#create-button").click();

      cy.contains(`${newBlog.title} ${newBlog.author}`);
      initialBlogs.map((blog) => cy.contains(`${blog.title} ${blog.author}`));
    });

    describe("when a blog exists", function () {
      beforeEach(function () {
        cy.logout();
        cy.login(users[1]);
        cy.createBlog(newBlog);
      });

      it("it can be liked", function () {
        cy.contains(`${newBlog.title} ${newBlog.author}`)
          .parent()
          .as("container");

        cy.get("@container").click().contains("view").click();

        cy.get("@container")
          .find(".blog-detail")
          .find("#add-like-button")
          .click();

        cy.get("@container").should("contain", "likes 1");
      });

      it("it can be deleted", function () {
        cy.contains(`${newBlog.title} ${newBlog.author}`)
          .parent()
          .as("container");

        cy.get("@container").click().contains("view").click();

        cy.get("@container")
          .find(".blog-detail")
          .find("#delete-button")
          .click();

        cy.contains(`${newBlog.title} ${newBlog.author}`).should("not.exist");
      });

      it("but it cannot be deleted if user is not creator", function () {
        cy.contains(`${initialBlogs[0].title} ${initialBlogs[0].author}`)
          .parent()
          .as("container");

        cy.get("@container").click().contains("view").click();

        cy.get("@container")
          .find(".blog-detail")
          .find("#delete-button")
          .should("not.exist");
      });

      it("and blogs should sort by likes", function () {
        const blogs = initialBlogs.concat(newBlog);
        const expected = blogs.sort((a, b) => b.likes - a.likes);

        expected.map((blog, index) => {
          cy.get(".blog").eq(index).contains(blog.title);
        });

        cy.contains(`${newBlog.title} ${newBlog.author}`)
          .parent()
          .as("container");

        cy.get("@container").click().contains("view").click();

        cy.get("@container")
          .find(".blog-detail")
          .find("#add-like-button")
          .click()
          .wait(1000)
          .click()
          .wait(1000)
          .click()
          .wait(1000)
          .click()
          .wait(1000)
          .click()
          .wait(1000)
          .click()
          .wait(1000);

        const updatedBlogs = initialBlogs.concat({ ...newBlog, likes: 6 });
        const newExpected = updatedBlogs.sort((a, b) => b.likes - a.likes);

        newExpected.map((blog, index) => {
          cy.get(".blog").eq(index).contains(blog.title);
        });
      });
    });
  });
});

// cy.get("html").should("not.contain", `${user.name} logged in`);
// it("then example", function () {
//   cy.get("button").then((buttons) => {
//     console.log("number of buttons", buttons.length);
//     cy.wrap(buttons[0]).click();
//   });
// });
