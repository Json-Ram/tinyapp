const express = require('express');
const app = express();
const PORT = 8080;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set('view engine', 'ejs');

const urlDatabase = {

  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"

};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
}


app.get('/', (req, res) => {
  res.send('Hello!');
});


app.get('/hello', (req, res) =>{
  res.send("<html><body>Hello <b>World</b></body</html>\n");
});


app.get('/urls.json', (req, res) =>{
  res.json(urlDatabase);
});


app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"]};
  res.render('urls_index', templateVars);
});


app.get('/urls/new', (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  res.render('urls_new', templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL:req.params.shortURL,
    longURL:urlDatabase[req.params.shortURL],
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});


app.post('/urls', (req, res) => {
  let newURL = generateRandomString();
  //console.log(req.body);
  //console.log(newURL, req.body.longURL)
  urlDatabase[newURL] = req.body.longURL;
  //console.log(urlDatabase)
  res.redirect(`/urls/${newURL}`);
});


app.get('/u/:shortURL', (req, res) =>{
  let longURLdata = urlDatabase[req.params.shortURL];
  //console.log("this is the short url:", longURLdata);
  if (longURLdata.startsWith('http')) {
    res.redirect(longURLdata);
  } else {
    res.redirect("https://" + longURLdata);
  }
});


app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});


app.post('/urls/:id', (req, res) => {
  //console.log('id ---:', req.params.id)
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect(`/urls/${req.params.id}`);
});


app.post('/login', (req, res) => {
  //console.log("req body", req.body.username)
  res.cookie("username", req.body.username);
  res.redirect(`/urls`);
});


app.post('/logout', (req, res) => {
  //console.log("req body", req.body.username)
  res.clearCookie("username");
  //console.log("getting the cookie:", req.cookies)
  res.redirect(`/urls`);
});


app.get('/register', (req, res) => {

  const templateVars = { username: req.cookies["username"]}

  res.render("registration", templateVars)
});

app.post('/register', (req, res) => {
  const newID = generateRandomString();
  console.log(generateRandomString());
  console.log(req.body.email, req.body.password);
  //console.log(users);

  users[newID] = {
    id: newID, 
    email: req.body.email, 
    password: req.body.password
  }
  console.log(users);
  res.cookie("user_id", newID)
  res.redirect('/urls')
});


app.listen(PORT, () =>{
  console.log((`Example app listening on port ${PORT}!`));
});


const generateRandomString = function() {
  // array of 52 letters for random generation
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //console.log(alphabet.length)
  let randomStr = '';
  //generates 6 random indexs of alphabet between 0-62
  for (let i = 0; i < 6; i++) {
    let generateNum = Math.floor(Math.random() * 62);
    randomStr += alphabet[generateNum];
  }
  return randomStr;
};
