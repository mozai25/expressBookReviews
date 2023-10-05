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

//task 10 with promise
function getBooks() {
    return new Promise((resolve, reject) => {
        if (books != null) {
            resolve(books);
        } else {
            reject('no books yet');
        }
    })
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    getBooks().then((items) => {
        res.send(JSON.stringify(items,null,4));
    }).catch((error) => {
        res.send(error);
    });
});

//task 11 with promise
function getBooksByIsbn(isbn) {
    return new Promise((resolve, reject) => {
        let book = null;
        for (let index = 1; index <= Object.keys(books).length; index++) {
            let b = books[index];
            if (b.isbn === isbn) {
                book = b;
            }
        }
        if (book != null) {
            resolve(book);
        } else {
            reject("no book by this isbn!");
        }
    })
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    getBooksByIsbn(isbn).then((book) => {
        res.send(JSON.stringify(book,null,4));
    }).catch((error) => {
        res.send(error);
    });
 });
  
//task 12 with promise
function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
        let book_author = null;
        for (let index = 1; index <= Object.keys(books).length; index++) {
            let b = books[index];
            if (b.author === author) {
                book_author = b;
            }
        }
        if (book_author != null) {
            resolve(book_author);
        } else {
            reject("no book by this author!");
        }
    })
}

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    getBooksByAuthor(author).then((book) => {
        res.send(JSON.stringify(book,null,4));        
    }).catch((error) => {
        res.send(error);
    })
});

//task 13 with promise
function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
        let book_title = null;
        for (let index = 1; index <= Object.keys(books).length; index++) {
            let b = books[index];
            if (b.title === title) {
                book_title = b;
            }
        }
        if (book_title != null) {
            resolve(book_title);
        } else {
            reject("no book by this title!");
        }
    })
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getBooksByTitle(title).then((book) => {
        res.send(JSON.stringify(book,null,4));
    }).catch((error) => {
        res.send(error);
    })
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
