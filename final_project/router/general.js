const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let authenticatedUser = require("./auth_users.js").authenticatedUser;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const jwt = require('jsonwebtoken');
const session = require('express-session');

public_users.post("/register", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});




// Get the book list available in the shop
public_users.get('/',function (req, res) {
   res.send(JSON.stringify({books}, null, 4));
//   return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let filtered_book = Object.values(books).filter((book) => book.isbn === isbn);
  res.send(filtered_book);
//   return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    
    let filtered_books = Object.values(books).filter((book) => 
      book.author.toLowerCase().includes(author.toLowerCase()) // Case-insensitive search
    );
  
    if (filtered_books.length > 0) {
      res.send(filtered_books); // Send filtered books if found
    } else {
      res.status(404).send({ message: "No books found by this author" }); // Send 404 if no books match the author
    }
//   return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    
    let filtered_books = Object.values(books).filter((book) => 
      book.title.toLowerCase().includes(title.toLowerCase()) // Case-insensitive search
    );
  
    if (filtered_books.length > 0) {
      res.send(filtered_books); // Send filtered books if found
    } else {
      res.status(404).send({ message: "No books found by this title" }); // Send 404 if no books match the author
    }
//   return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let book = Object.values(books).filter((book) => book.isbn === isbn);
  res.send(book.reviews);
//   return res.status(300).json({message: "Yet to be implemented"});
});



  // Task 10 
public_users.get('/books', function (req, res) {
  const get_books = new Promise((resolve) => {
    resolve(res.send(JSON.stringify(books, null, 4)));
  });

  get_books.then(() => {
    console.log("Promise for Task 10 resolved");
  }).catch((error) => {
    console.error("Error resolving promise for Task 10:", error);
  });
  
});
  
  
  // TASK 11
  public_users.get('/books/isbn/:isbn', function (req, res) {
    const get_books_isbn = new Promise((resolve, reject) => {
      const isbn = req.params.isbn;
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("ISBN not found");
      }
    });

    get_books_isbn
      .then((book) => {
        res.send(book);
        console.log("Promise for Task 11 is resolved");
      })
      .catch((error) => {
        res.status(404).send({ message: error });
        console.log(error);
      });
  });
  
  
  
  // Task 12
  public_users.get("/author/:author", async function (req, res) {
    try {
      const author = req.params.author.toLowerCase();
      const booksList = Object.values(books);
      const filteredBooks = booksList.filter((book) =>
        book.author.toLowerCase().includes(author)
      );

      if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
      } else {
        return res.status(404).json({ message: "No books found by this author" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  });
  
  
  
  
  // TASK 12 
  public_users.get('/books/author/:author', function (req, res) {
    const get_books_author = new Promise((resolve, reject) => {
      let booksByAuthor = [];
      let isbns = Object.keys(books);
      isbns.forEach((isbn) => {
        if (books[isbn]["author"] === req.params.author) {
          booksByAuthor.push({
            "isbn": isbn,
            "title": books[isbn]["title"],
            "reviews": books[isbn]["reviews"]
          });
        }
      });
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject("The mentioned author does not exist");
      }
    });

    get_books_author
      .then((booksByAuthor) => {
        res.send(booksByAuthor);
        console.log("Promise is resolved");
      })
      .catch((error) => {
        res.status(404).send({ message: error });
        console.log(error);
      });
  });
  
  
  // Task 13
  public_users.get("/title/:title", async function (req, res) {
    try {
      const title = req.params.title.toLowerCase();
      const booksList = Object.values(books);
      const filteredBooks = booksList.filter((book) =>
        book.title.toLowerCase().includes(title)
      );
  
      if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
      } else {
        return res.status(404).json({ message: "No books found with this title" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  });
  
  
  // Get book details based on author
  public_users.get("/author/:author", async function (req, res) {
    try {
      const author = req.params.author.toLowerCase();
      const booksList = Object.values(books);
      const filteredBooks = booksList.filter((book) =>
        book.author.toLowerCase().includes(author)
      );

      if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
      } else {
        return res.status(404).json({ message: "No books found by this author" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  });
  
  
  // Get book details based on ISBN
  public_users.get("/isbn/:isbn", async function (req, res) {
    try {
      const isbn = req.params.isbn;
      const book = books[isbn];

      if (book) {
        return res.status(200).json(book);
      } else {
        return res.status(404).json({ message: "Invalid ISBN" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  });
  
  
  // TASK 13 
  public_users.get('/books/title/:title', function (req, res) {
    const get_books_title = new Promise((resolve, reject) => {
      let booksByTitle = [];
      let isbns = Object.keys(books);
      isbns.forEach((isbn) => {
        if (books[isbn]["title"] === req.params.title) {
          booksByTitle.push({
            "isbn": isbn,
            "author": books[isbn]["author"],
            "reviews": books[isbn]["reviews"]
          });
        }
      });
      if (booksByTitle.length > 0) {
        resolve(booksByTitle);
      } else {
        reject("The mentioned title does not exist");
      }
    });

    get_books_title
      .then((booksByTitle) => {
        res.send(booksByTitle);
        console.log("Promise is resolved");
      })
      .catch((error) => {
        res.status(404).send({ message: error });
        console.log(error);
      });
  });
  
  
  // Task 10
  public_users.get("/", async function (req, res) {
    try {
      const data = await new Promise((resolve) => {
        const booksList = Object.values(books);
        resolve(booksList);
      });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  });



  

module.exports.general = public_users;
