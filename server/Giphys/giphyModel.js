var mongoose = require('mongoose')

var giphySchema = new mongoose.Schema({
  user: String,
  giphy: String,
  sound: String,
  description: String
})

module.exports = mongoose.model('Giphy', giphySchema);