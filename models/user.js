var mongoose = require('mongoose');
var bcrypt = require('bcrypt');


car userSchema = mongoose.Schema({
  email:   {
    type: String,
    index: true
  },
  password: {
    type: String
  }
});


var user = module.export = mogoose.model('user', user);

module.exports.createUser = function(newUser, callback){

}
