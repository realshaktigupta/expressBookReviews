const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.params.username;
  const password = req.params.password;
  if (!username || !password){
    res.status(404).json({message:"Check Username And Password"});
  }
  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({
        data:password},'access',{expiresIn: 60*60});
    req.session.authorisation = { accessToken, username}
    return res.status(200).send("User successfully logged in");
    }else{
        return res.status(208).send("Invalid Login, Check Username and Password");
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let review = req.params.review;
  let username = req.session.authorisation.username;
  let isbn = req.params.isbn;
  let book_review = { 'username' : username, 'review' :review};
  let filtered_books = books.filter((book) => book.isbn === isbn);
  if(filtered_books.length > 0){
    let filtered_book = filtered_books[0];
    filtered_book.review.push(book_review);

    books = books.filter((book) => book.isbn != isbn);
    books.push(filtered_book);
    res.send('Review Updated for Book With ISBN: ${isbn}');
  }else{
    res.send("Book Doesn't Exist!");
  }
});

//Delete a book review
regd_users.delete("/auth/review/:isbn",(req,res) => {
  let username = req.session.authorisation.username;
  let isbn = req.params.isbn;
  let filtered_books = books.filter((book) => book.isbn === isbn);
  if(filtered_books.length > 0){
    filtered_book = filtered_books[0];
    let reviews = filtered_book.reviews;
    filtered_reviews = reviews.filter((review) => review.username != username);
    filtered_book.reviews = filtered_reviews;

    books = books.filter((book) => book.isbn != isbn);
    books.push(filtered_book);
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
