var express     = require('express'),
    mongoose    = require('mongoose'),
    bodyParser = require('body-parser')

var app = express();
var Giphy = require('./Giphys/giphyModel.js');
mongoose.connect('mongodb://localhost/mvp'); // connect to mongo database named shortly
// app.use(bodyParser.json());
// configure our server with all the middleware and and routing
// export our app for testing and flexibility, required by index.js
app.use(express.static(__dirname + '/../client'))
// app.use(bodyParser.json());

app.post('/api/giphy', function(req, res){
  var string = '';
  req.on('data', function(chunk){
    string += chunk;
  })
  req.on('end', function(){

    res.sendStatus(201)   
  })
})

app.post('/api/sound', function(req, res){
  var string = '';
  req.on('data', function(chunk){
    string += chunk;
  })
  req.on('end', function(){
    re
  })
})
app.listen(3000);

module.exports = app;
