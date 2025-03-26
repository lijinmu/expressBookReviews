const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
        username: "John",
        password: "wick",
    },
    {
        username: "John",
        password: "smith",
    },
    {
        username: "Joyal",
        password: "white",
    },
    {
        username: "user2",
        password: "password2",
    },
];

let reviews = [
    {
        isbn: "1",
        username: "John",
        review:"giid book"
    },
    {
        isbn: "1",
        username: "John",
        review:"giid book"
    },
    {
        isbn: "1",
        username: "John",
        review:"giid book"
    },
    {
        isbn: "1",
        username: "John",
        review:"giid book"
    },
];

// Check if a user with the given username already exists
const isValid = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(400).json({ message: "Username or password is missing" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({ username }, 'access', { expiresIn: '1h' });

        // Store access token and username in session
        req.session.authorization = {
            accessToken,
            username
        };

        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(401).json({ message: "Invalid Login. Check username and password" });
    }
   //   return res.status(300).json({message: "Yet to be implemented"});
   });
   

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}



// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { review } = req.body;
  const isbn = req.params.isbn;
  let book = Object.values(books).filter((book) => book.isbn === isbn);

  const { authorization } = req.session;
 if (req.session) {

    let reviewObj = {
        "isbn":isbn,
        "user" : authorization.username,
        "review": review
      }
    
     reviews.push(reviewObj);

     console.log(reviewObj);
     console.log(reviews);
    

    return res.status(200).send("review added scuccessfully");
} else {
    return res.status(401).json({ message: "Invalid Login. Check username and password", reviews });
}

});


// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const { authorization } = req.session;

   if (req.session) {
  
    reviews = Object.values(reviews).filter((review) => review.user !== authorization.username);
      
       console.log(reviews);
  
      return res.status(200).send("review deleted scuccessfully");
  } else {
      return res.status(401).json({ message: "Invalid Login. Check username and password", reviews });
  }
  
  });


  

module.exports.authenticatedUser = authenticatedUser;
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
