const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
