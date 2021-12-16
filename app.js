require('dotenv').config();
var expressSession = require('express-session');
var morgan = require('morgan');
var express = require('express');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var routes = require('./routes');
var flashMessages = require('connect-flash');
var middlewares = require('./middlewares');
var User = require('./models/user');
var startDb = require('./models/index');

passport.use(
	new localStrategy(
		{usernameField: 'email', passwordField: 'password'},
		function (username, password, done) {
			User.findOne({email: username}).exec((err, user) => {
				if (err) return done(err);
				if (!user) {
					return done(null, false, {
						message: 'Invalid email or password',
					});
				}

				if (!user.verifyPassword(password)) {
					return done(null, false, {
						message: 'Incorrect email or password',
					});
				}

				return done(null, user);
			});
		}
	)
);

passport.serializeUser(function (user, done) {
	done(null, user._id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, (err, user) => {
		done(err, user);
	});
});

const app = express();
const Oneday = 24 * 60 * 60 * 1000;
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static('public'));
app.use(
	expressSession({
		secret: process.env.COOKIE_SECRET,
		saveUninitialized: false,
		resave: false,
		cookie: {
			maxAge: Oneday,
			sameSite: 'lax',
			signed: true,
		},
	})
);
app.use(flashMessages());
app.use(passport.initialize());
app.use(passport.session());
app.set('port', process.env.PORT);
app.set('view engine', 'ejs');
app.set('view options', {
	openDelimiter: '[',
	closeDelimiter: ']',
	delimiter: '/',
});

app.use(middlewares.context);

app.use(routes);

// 404
app.use('*', (req, res) => {
	res.render('404');
});

// 500
app.use((err, req, res, next) => {
	res.render('500', {message: err.message, stack: err.stack});
});

startDb();

app.listen(app.get('port'), () => {
	console.log('\n --> Server listening on port ', app.get('port'));
});
