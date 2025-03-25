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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
