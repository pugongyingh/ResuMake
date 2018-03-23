var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({

	username: {type:'string',required:true},
	email: {type:'string', required: true},
	password: {type:'string', required: true},
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date}
});

userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
};
    
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('User',userSchema);

