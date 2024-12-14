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
//WE CAN EDIT BELOW THIS LINE

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
  const username = req.session.username || null;
  res.render('home', { username });
});

app.get('/annapurna', isAuthenticated, function(req, res) {
  const destination = 'Annapurna';
  res.render('annapurna', { destination: destination });
});

app.get('/bali', isAuthenticated, function(req, res) {
  const destination = 'Bali';
  res.render('bali', { destination: destination });
});

app.get('/cities', isAuthenticated, function(req, res) {
  res.render('cities');
});

app.get('/hiking', isAuthenticated, function(req, res) {
  res.render('hiking');
});

app.get('/inca', isAuthenticated, function(req, res) {
  const destination = 'Inca';
  res.render('inca', { destination: destination });
});

app.get('/islands', isAuthenticated, function(req, res) {
  res.render('islands');
});

app.get('/paris', isAuthenticated, function(req, res) {
  const destination = 'Paris';
  res.render('paris', { destination: destination });
});


app.get('/rome', isAuthenticated, function(req, res) {
  const destination = 'Rome';
  res.render('rome', { destination: destination });
});

app.get('/santorini', isAuthenticated, function(req, res) {
  const destination = 'Santorini';
  res.render('santorini', { destination: destination });
});

app.get('/searchresults', isAuthenticated, function(req, res) {
  res.render('searchresults');
});

app.get('/wanttogo', isAuthenticated, async function(req, res) {
  const username = req.session.username; 
  let errorMessage = null; 

  try {
    const client = await MongoClient.connect(mongoUrl, { useUnifiedTopology: true });
    const db = client.db('myDB'); 

    const user = await db.collection('myCollection').findOne({ username: username });

    let destinations = [];
    if (user && user.wantToGoList) {
      destinations = user.wantToGoList; 
    }

    await client.close();
    res.render('wanttogo', { destinations, error: errorMessage }); 
  } catch (error) {
    console.error("Error fetching want-to-go list:", error);
    errorMessage = "Failed to load want-to-go list."; 
    res.render('wanttogo', { destinations: [], error: errorMessage }); 
  }
});

app.get('/destination', function(req, res) {
  const destination = req.query.destination;
  switch (destination) {
    case 'Inca':
        res.redirect('/inca');
        break;
    case 'Annapurna':
        res.redirect('/annapurna');
        break;
    case 'Paris':
        res.redirect('/paris');
        break;
    case 'Rome':
        res.redirect('/rome');
        break;
    case 'Bali':
      res.redirect('/bali');
        break;
    case 'Santorini':
      res.redirect('/santorini');
        break;
    case 'Cities':
        res.redirect('/cities');
        break;
    case 'Hiking':
      res.redirect('/hiking');
        break;
    case 'Islands':
      res.redirect('/islands');
        break;
    default:
      res.redirect('/home');
        break;
  }
});


app.post('/addToWantToGo', isAuthenticated, async function (req, res) {
  const username = req.session.username; 
  const destination = req.body.destination;

  let errorMessage = null;

  if (!destination) {
      return res.redirect('/wanttogo'); 
  }

  try {
      const client = await MongoClient.connect(mongoUrl, { useUnifiedTopology: true });
      const db = client.db('myDB'); 

      const user = await db.collection('myCollection').findOne({ username: username });

      if (!user) {
          errorMessage = "User not found.";
          await client.close();
          return res.render('wanttogo', { destinations: [], error: errorMessage });
      }

      if (user.wantToGoList && user.wantToGoList.includes(destination)) {
          errorMessage = "The destination ("+ destination +") is already in your Want-to-Go List.";
          await client.close();
          return res.render('wanttogo', { destinations: user.wantToGoList, error: errorMessage });
      }

      await db.collection('myCollection').updateOne(
          { username: username },
          { $push: { wantToGoList: destination } }
      );

      await client.close();

      res.redirect('/wanttogo');
  } catch (error) {
      console.error("Error adding destination to want-to-go list:", error);
      errorMessage = "Failed to add destination. Please try again.";
      return res.render('wanttogo', { destinations: [], error: errorMessage });
  }
});



//El Configuration bta3 MongoDB 
const mongoUrl = "mongodb://127.0.0.1:27017";
const dbName = "myDB";

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
    const db = client.db('myDB');

    // Check if the username already exists
    const existingUser = await db.collection('myCollection').findOne({ username: username });

    if (existingUser) {
      await client.close();
      return res.render('registration', { messageGiven: "Username already taken. Please choose another." });
    }

    // Insert the new user into the database
    await db.collection('myCollection').insertOne({ username: username, password: password });

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

  // TODO: Remove hardcoded credentials at the end
  if (username === 'm' && password === '123') {
    req.session.isLoggedIn = true; 
    req.session.username = username; 
    return res.redirect('/home'); 
  }

  try {
    const client = await MongoClient.connect(mongoUrl, { useUnifiedTopology: true });
    const db = client.db('myDB');

    const user = await db.collection('myCollection').findOne({ username: username.trim() });

    if (!user || user.password !== password) {
      await client.close();
      return res.render('login', { message: "Invalid username or password." });
    }

    req.session.isLoggedIn = true; 
    req.session.username = username; 
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

  let results = [];
  const searchValue2 = searchValue.toLowerCase();
  
  for(let i = 0; i < destinations.length; i++) {
    if((destinations[i].toLowerCase()).includes(searchValue2)){
      results.push(destinations[i]);
    }
  }

  res.render('searchresults', { searchQuery: results });

});

app.post('/destination', isAuthenticated, function (req, res) {
  const selectedDestination = req.body.selectedDestination;

  switch (selectedDestination) {
      case 'Inca Trail to Machu Picchu':
          res.redirect('/inca');
          break;
      case 'Annapurna Circuit':
          res.redirect('/annapurna');
          break;
      case 'Paris':
          res.redirect('/paris');
          break;
      case 'Rome':
          res.redirect('/rome');
          break;
      case 'Bali Island':
        res.redirect('/bali');
          break;
      case 'Santorini Island':
        res.redirect('/santorini');
          break;
      case 'Cities':
          res.redirect('/cities');
          break;
      case 'Hiking':
        res.redirect('/hiking');
          break;
      case 'Islands':
        res.redirect('/islands');
          break;
      default:
        res.redirect('/home');
          break;
  }
});
//-----------------------------------------------------------------------------
app.listen(3000);