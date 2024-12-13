var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
const { MongoClient } = require("mongodb");


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//-----------------------------------------------------------------------------
//YOU CAN EDIT BELOW THIS LINE

const session = require('express-session');

// Session configuration
app.use(session({
  secret: 'ajsh6_$gHb3_Kj%2F',
  resave: false,
  saveUninitialized: false,
}));

// Checking if user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.session.isLoggedIn) { 
    next();
  } else {
    res.redirect('/?messageGiven=Please log in first.');
  }
};

app.get('/', (req, res) => {
  const messageGiven = req.query.messageGiven || null; 
  res.render('login', { message: messageGiven }); 
});

app.get('/registration', function(req, res) {
  res.render('registration', { messageGiven: null });
});

// Protected Routes
app.get('/home', isAuthenticated, function(req, res) { 
  res.render('home');
});

app.get('/annapurna', isAuthenticated, function(req, res) {
  res.render('annapurna');
});

app.get('/bali', isAuthenticated, function(req, res) {
  res.render('bali');
});

app.get('/cities', isAuthenticated, function(req, res) {
  res.render('cities');
});

app.get('/hiking', isAuthenticated, function(req, res) {
  res.render('hiking');
});

app.get('/inca', isAuthenticated, function(req, res) {
  res.render('inca');
});

app.get('/islands', isAuthenticated, function(req, res) {
  res.render('islands');
});

app.get('/paris', isAuthenticated, function(req, res) {
  res.render('paris');
});

app.get('/rome', isAuthenticated, function(req, res) {
  res.render('rome');
});

app.get('/santorini', isAuthenticated, function(req, res) {
  res.render('santorini');
});

app.get('/searchresults', isAuthenticated, function(req, res) {
  res.render('searchresults');
});

app.get('/wanttogo', isAuthenticated, function(req, res) {
  res.render('wanttogo');
});

//El Configuration bta3 MongoDB 
const mongoUrl = "mongodb://127.0.0.1:27017";
const dbName = "TravelSystemDB";

// POST route for handling registration
app.post('/register', async function (req, res) {
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !username.trim() || !password || !password.trim()) {
    return res.render('registration', { messageGiven: "Please fill in both fields." });
  }

  const MongoClient = require('mongodb').MongoClient;
  const mongoUrl = "mongodb://127.0.0.1:27017";

  try {
    const client = await MongoClient.connect(mongoUrl, { useUnifiedTopology: true });
    const db = client.db('TravelSystemDB');

    // Check if the username already exists
    const existingUser = await db.collection('users').findOne({ username: username });

    if (existingUser) {
      await client.close();
      return res.render('registration', { messageGiven: "Username already taken. Please choose another." });
    }

    // Insert the new user into the database
    await db.collection('users').insertOne({ username: username, password: password });

    await client.close();

    return res.redirect('/?messageGiven=Registration successful! Please log in.');
  } catch (error) {
    console.error("Error during registration:", error);
    return res.render('registration', { messageGiven: "An error occurred. Please try again." });
  }
});

//POST route for handling login
app.post('/login', async function (req, res) {
  const { username, password } = req.body;

  if (!username || !username.trim() || !password || !password.trim()) {
    return res.render('login', { message: "Please fill in both fields." });
  }

  try {
    const client = await MongoClient.connect(mongoUrl, { useUnifiedTopology: true });
    const db = client.db('TravelSystemDB');

    const user = await db.collection('users').findOne({ username: username.trim() });

    if (!user || user.password !== password) {
      await client.close();
      return res.render('login', { message: "Invalid username or password." });
    }

    req.session.isLoggedIn = true; // Store login status in session
    req.session.username = username; //Store username in session
    await client.close();
    return res.redirect('/home');
  } catch (error) {
    console.error("Error during login:", error);
    return res.render('login', { message: "An error occurred. Please try again later." });
  }
});

// Logout route to destroy session
app.get('/logout', function(req, res) {
  req.session.destroy(err => {
    if (err) {
      console.error("Error during logout:", err);
      return res.redirect('/home');
    }
    res.redirect('/?messageGiven=You have been logged out.');
  });
});

// Search Route (Protected)
app.post('/search', isAuthenticated, function(req, res) {
  const searchValue = req.body.Search;

  const destinations = ['Inca Trail to Machu Picchu', 'Annapurna Circuit', 'Paris', 'Rome', 'Bali Island', 'Santorini Island', 'Cities', 'Hiking', 'Islands' ];

  let results ="";
  for(let i = 0; i < destinations.length; i++) {
    if(destinations[i].includes(searchValue)){
      results = results + destinations[i] + ' - ';
    }
  }

  res.render('searchresults', { searchQuery: results });

});

//-----------------------------------------------------------------------------
app.listen(3000);