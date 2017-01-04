var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var db = require('./models');
var Hashids = require("hashids");
var hashids = new Hashids("The 256-bit NaCl for the hash!");

//middleware setup
app.set('view engine', 'ejs');
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);


app.get('/', function(req, res) {
  res.render('home');
});

app.post('/links', function(req,res){
  db.link.create(req.body).then(function(link){
    res.redirect('/links/'+link.id);
  });
});

app.get('/links/:id', function(req,res){
  db.link.find({
    where: {id: req.params.id},
  })
  .then(function(link){
    var hash = hashids.encode(link.id);
    console.log("Hash is "+hash);
    res.render('links', {hash:hash});
  });
});

app.get('/:hash', function(req,res){
  var hash = hashids.decode(req.params.hash);
  db.link.find({
    where: {id: hash},
  })
  .then(function(link){
    console.log(link);
    link.increment("count");
    res.redirect(link.url);
  });
});


var server = app.listen(process.env.PORT || 3001);

module.exports = server;
