
var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();

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
//-----------------------------------------------------------------------------
app.listen(3000);