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
	phone_no: {type:'number', required: true},
	employer_name: {type:'string', required: true},
	industry: {type:'string',required: true},
	employer_city: {type:'string',required:true},
	employer_country: {type:'string',required:true},
	employer_state: {type:'string',required:true},
	position_title: {type:'string',required:true},
	start_date: {type:'string',required:true},
	still_work_here: {type:'boolean',required:true,default:false},
	school_name: {type:'string',required:true},
	school_city: {type:'string',required:true},
	school_state: {type:'string',required:true},
	school_country: {type:'string',required:true},
	still_in_school: {type:'boolean',required:true,default:false},
	additional_skills: {type:'string',required:false}
});

	module.exports = mongoose.model('ResumeData',resumeDataSchema);



	