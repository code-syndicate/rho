var router = require('express').Router();
var bankingControllers = require('./controllers/banking');
var userControllers = require('./controllers/user');
var passport = require('passport');

router.get(
	'/banking/app/',
	// passport.authenticate('local', {
	// 	failureRedirect: '/banking/authentications/log-in/',
	// 	failureFlash: 'Please sign in to continue',
	// }),
	bankingControllers.index
);
router.post(
	'/banking/authentications/log-in/',
	userControllers.validateLogInData,
	passport.authenticate('local', {
		successRedirect: '/banking/app/',
		failureRedirect: '/banking/authentications/log-in/',
		failureFlash: true,
	})
);
router.get('/banking/authentications/log-in/', userControllers.logInPage);
router.post(
	'/banking/authentications/sign-up/',
	userControllers.validateSignUpData,
	userControllers.createUser
);

router.get('/banking/authentications/sign-up/', userControllers.signUpPage);

router.get(
	'/banking/verifications/email-verification/',
	passport.authenticate('local', {
		failureRedirect: '/banking/authentications/log-in/',
	}),
	userControllers.emailVerificationPage
);

router.post(
	'/banking/verifications/email-verification/',
	passport.authenticate('local', {
		failureRedirect: '/banking/authentications/log-in/',
	}),
	userControllers.verifyEmail
);

router.get('/banking/authentications/log-out/', userControllers.logOutUser);

module.exports = router;
