const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{}

function authenticatedUser(username, password) {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
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
regd_users.put("/auth/review/:isbn", async (req, res) => {
    const username = req.session.authorization.username	
    const isbn = req.params.isbn;
    let filtered_book = books[isbn]
    if (filtered_book) {
        let review = req.query.review;
        let reviewer = req.session.authorization['username'];
        if(review) {
            filtered_book['reviews'][reviewer] = review;
            books[isbn] = await filtered_book;
        }
        res.send(`The review for the book with ISBN  ${isbn} has been added/updated.`);
    }  else{
        res.send("Unable to find this ISBN!");
    }
});

//Delete a book review
regd_users.delete("/auth/review/:isbn",async (req,res) => {
    const isbn = req.params.isbn
    const username = req.session.authorization.username
    if (books[isbn]) {
        let book = await books[isbn]
        delete book.reviews[username]
        return res.status(200).send('Review successfully deleted')
    } else {
        return res.status(404).json({message: `ISBN ${isbn} not found`})
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
