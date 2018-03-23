var express = require('express');
var router = express.Router();
var ResumeData = require('../models/resume-detail');

router.post('/detailsSaved', function(req, res, next){

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
    /* resumeDetail.employer_name = req.body.employerName;
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
    resumeDetail.additional_skills = req.body.addiSkills; */
    req.checkBody('cardNumber','Invalid card number').isLength({min:10});
    req.checkBody('amountRecharged','Recharge is not complimentary :P').notEmpty();
    var errors = req.validationErrors();
    console.log(errors);
    resumeDetail.save(function(err, resumedetails){
        if(err)
            if(errors) {
                var messages = [];
                errors.forEach(function (error) {
                    messages.push(error.msg);
                });
                req.flash('error', messages);
                res.render('user/design', {messages: messages, hasErrors: messages.length > 0});
            }
        else {
                req.flash('notice', 'Saved Successfully!');
                res.render('user/design', {flash: {notice: req.flash('notice')}});
            }
    });
});

module.exports = router;
