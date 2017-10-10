var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
var ResumeData = require('../models/resume-detail');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/design', function(req, res, next) {
	res.render('design');
});

router.post('/balloon', function(req, res, next){

	console.log('entered the post');

	var resumeDetail = new ResumeData();

		resumeDetail.first_name = req.body.firstName;
		resumeDetail.last_name = req.body.lastName;
		resumeDetail.country = req.body.country;
		resumeDetail.zip = req.body.zipCode;
		resumeDetail.city = req.body.cityName;
		resumeDetail.state = req.body.stateName;
		resumeDetail.address1 = req.body.address1;
		resumeDetail.address2 = req.body.address2;
		resumeDetail.email = req.body.email;
		resumeDetail.phone_no = req.body.phone;
		resumeDetail.employer_name = req.body.employerName;
		resumeDetail.industry = req.body.industry;
		resumeDetail.employer_city = req.body.employerCity;
		resumeDetail.employer_country = req.body.employerCountry;
		resumeDetail.employer_state = req.body.employerState;
		resumeDetail.position_title = req.body.positionTitle;
		resumeDetail.start_date = req.body.startDate;
		resumeDetail.still_work_here = req.body.inWork;
		resumeDetail.school_name = req.body.schoolName;
		resumeDetail.school_city = req.body.schoolCity;
		resumeDetail.school_state = req.body.schoolState;
		resumeDetail.school_country = req.body.schoolCountry;
		resumeDetail.still_in_school = req.body.inSchool;
		resumeDetail.additional_skills = req.body.addiSkills;

	resumeDetail.save(function(err){
		if(err)
			throw err;
		else
			res.send('Saved Successfully');
	});
});

module.exports = router;
