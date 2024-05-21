const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
  username = req.params.username;
  password = req.params.password;
  if (username && password){
    if(!doesExist(username)){
        users.push({'username':username,'password':password});
        res.status(200).json({message: "User successfully registred. Now you can login"});
    }
    else{
        res.status(404).json({message:"Username Already Exists"});
    }
  }else{
    res.status(404).json({message:"Username or Password Missing"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify({users},null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let filtered_books = books.filter((book) => book.isbn === isbn);
  res.send(filtered_books);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filtered_books = books.filter((book) => book.author === author);
  res.send(filtered_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let filtered_books = books.filter((book) => book.title === title);
  res.send(filtered_books);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let filtered_books = books.filter((book) => book.isbn === isbn);
  reviews = filtered_books.reviews;
  res.send(reviews);
});

module.exports.general = public_users;
