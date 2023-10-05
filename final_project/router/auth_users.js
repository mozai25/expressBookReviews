const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }

    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
          data: password
        }, 'access', { expiresIn: 60 * 60 });
    
        req.session.authorization = {
          accessToken,username
      }
      return res.status(200).send("User successfully logged in");
      } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
      }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const text = req.query.text;
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    let book = null;
    for (let index = 1; index <= Object.keys(books).length; index++) {
        let b = books[index];
        if (b.isbn === isbn) {
            book = b;
        }
    }
    if (book != null) {
        let reviews = book.reviews;
        if (Object.keys(reviews).length == 0) {
            reviews[0] = {"text":text,"author":req.session.authorization.username};
            return res.send("Review added!");
        } else {
            for (let index = 0; index <= Object.keys(book.reviews).length; index++) {
                if (reviews[index] != null && reviews[index].author == username) {
                    reviews[index].text = text;
                    return res.send("Review updated!");
                }
            }
            let index = Object.keys(book.reviews).length + 1;
            reviews[index] = {"text":text, "author":req.session.authorization.username};
            return res.send("Review added!");            
        }
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
