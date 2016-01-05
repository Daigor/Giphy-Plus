var mongoose = require('mongoose')

var giphySchema = new mongoose.Schema({
  user: String,
  giphy: Array,
  sound: Array
})

module.exports = mongoose.model('Giphy', giphySchema);