
var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
const { MongoClient } = require("mongodb");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//-----------------------------------------------------------------------------
//YOU CAN EDIT BELOW THIS LINE
app.get('/',function(req,res){
  res.render('login')
});

app.get('/registration',function(req,res){
  res.render('registration')
});

app.get('/home',function(req,res){
  res.render('home')
});

app.get('/annapurna',function(req,res){
  res.render('annapurna')
});

app.get('/bali',function(req,res){
  res.render('bali')
});

app.get('/cities',function(req,res){
  res.render('cities')
});

app.get('/hiking',function(req,res){
  res.render('hiking')
});

app.get('/inca',function(req,res){
  res.render('inca')
});

app.get('/islands',function(req,res){
  res.render('islands')
});

app.get('/paris',function(req,res){
  res.render('paris')
});

app.get('/rome',function(req,res){
  res.render('rome')
});

app.get('/santorini',function(req,res){
  res.render('santorini')
});

app.get('/searchresults',function(req,res){
  res.render('searchresults')
});

app.get('/wanttogo',function(req,res){
  res.render('wanttogo')
});

const mongoUrl = "mongodb://127.0.0.1:27017";
const dbName = "TravelSystemDB";

// POST route for handling registration
app.post('/register', async function (req, res) {
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
      return res.render('registration', { messageGiven: "Please fill in both fields." });
  }

  var MongoClient = require('mongodb').MongoClient;

  try {
      MongoClient.connect("mongodb://127.0.0.1:27017", async function (err, client) {
          if (err) throw err;
          var db = client.db('TravelSystemDB');

          // Check if the username already exists
          const existingUser = await db.collection('users').findOne({ username: username });

          if (existingUser) {
              return res.render('registration', { messageGiven: "Username already taken. Please choose another." });
          }

          // Insert the new user into the database
          await db.collection('users').insertOne({ username: username, password: password });

          return res.render('registration', { messageGiven: "Registration successful! Please log in." });
      });
  } catch (error) {
      console.error("Error during registration:", error);
      return res.render('registration', { messageGiven: "An error occurred. Please try again." });
  }
});



app.post('/',function(req,res){
  var x = req.body.username;
  var y = req.body.password;
  console.log(x);
  console.log(y);
})

//-----------------------------------------------------------------------------
app.post('/search', function(req, res) {

  const searchValue = req.body.Search;

  const destinations = ['Inca Trail to Machu Picchu', 'Annapurna Circuit', 'Paris', 'Rome', 'Bali Island', 'Santorini Island', 'Cities', 'Hiking', 'Islands' ];

  let results ="";
  for(let i = 0; i < destinations.length; i++) {
    if(destinations[i].includes(searchValue)){
      results = results + destinations[i] + ' - ';
    }
  }

  res.render('searchresults', { searchQuery: results });

});
app.listen(3000);