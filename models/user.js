var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var registerSchema = new Schema({

	username: {type:'string',required:true},
	emailid: {type:'string', required: true},
	password: {type:'string', required: true},

	
});

registerSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
};
    
registerSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('RegisterData',registerSchema);

