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
app.use(bodyParser.json());

app.post('/api/giphy', function(req, res){
  new Giphy({
    user: "Allan",
    giphy: req.body.giphy,
    sound: req.body.sound,
    description: req.body.description
  }).save(function(err, data){
    if(err)throw err;
    res.sendStatus(201);
  });
})

app.get('/api/giphy', function(req, res){
  Giphy.find(function(err, giphy){
    if(err) throw err;
    res.json(giphy);
  })
})
app.listen(3000);

module.exports = app;
