require('dotenv').config();

function context(req, res, next) {
	res.locals.siteName = process.env.SITENAME;
	res.locals.tagline = process.env.TAGLINE;
	res.locals.appUrl = '/banking/app';
	if (req.user) {
		res.locals.auth = {user: req.user};
	} else {
		res.locals.auth = {};
	}

	next();
}

module.exports = {
	context,
};
