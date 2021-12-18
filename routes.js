var router = require('express').Router();
var bankingControllers = require('./controllers/banking');
var userControllers = require('./controllers/user');
var passport = require('passport');
var connectEnsureLogin = require('connect-ensure-login');

router.get('/', bankingControllers.home);

router.get(
	'/banking/notifications/:notificationId/delete/',
	connectEnsureLogin.ensureLoggedIn(),
	bankingControllers.deleteNotification
);

router.post(
	'/banking/authentications/register-deposit/',
	connectEnsureLogin.ensureLoggedIn('/banking/authentications/log-in/'),

	bankingControllers.registerDeposit
);
router.post(
	'/banking/authentications/register-withdrawal/',
	connectEnsureLogin.ensureLoggedIn('/banking/authentications/log-in/'),
	bankingControllers.registerWithdrawal
);

router.get(
	'/banking/app/',
	connectEnsureLogin.ensureLoggedIn('/banking/authentications/log-in/'),
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
	connectEnsureLogin.ensureLoggedIn('/banking/authentications/log-in/'),
	userControllers.emailVerificationPage
);

router.post(
	'/banking/verifications/email-verification/',
	connectEnsureLogin.ensureLoggedIn('/banking/authentications/log-in/'),

	userControllers.verifyEmail
);

router.get('/banking/authentications/log-out/', userControllers.logOutUser);

module.exports = router;
