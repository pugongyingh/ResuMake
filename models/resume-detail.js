var mongoose = require('mongoose');
var Schema = mongoose.Schema;


	var resumeDataSchema = new Schema({

	first_name: {type:'string', required: true},
	last_name: {type:'string', required: true},
	country: {type:'string', required: true},
	zip: {type:'number', required: true},
	state: {type:'string', required: true},
	city: {type:'string', required: true},
	address1: {type:'string', required: true},
	address2: {type:'string', required: true},
	email: {type:'string', required: true},
	phone_no: {type:'number', required: true}
});

	module.exports = mongoose.model('ResumeData',resumeDataSchema);



	