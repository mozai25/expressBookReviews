const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) { 
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});    
        }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let book = null;
    for (let index = 1; index <= Object.keys(books).length; index++) {
        let b = books[index];
        if (b.isbn === isbn) {
            book = b;
        }
    }
    res.send(JSON.stringify(book,null,4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let book_author = null;
    for (let index = 1; index <= Object.keys(books).length; index++) {
        let b = books[index];
        if (b.author === author) {
            book_author = b;
        }
    }
    res.send(JSON.stringify(book_author,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let book_title = null;
    for (let index = 1; index <= Object.keys(books).length; index++) {
        let b = books[index];
        if (b.title === title) {
            book_title = b;
        }
    }
    res.send(JSON.stringify(book_title,null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let book = null;
    for (let index = 1; index <= Object.keys(books).length; index++) {
        let b = books[index];
        if (b.isbn === isbn) {
            book = b;
        }
    }
    res.send(JSON.stringify(book.reviews,null,4));
});

module.exports.general = public_users;
