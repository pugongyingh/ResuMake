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

	resumeDetail.save(function(err){
		if(err)
			throw err;
		else
			res.send('Saved Successfully');
	});
});

module.exports = router;
