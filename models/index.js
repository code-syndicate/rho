var mongoose = require('mongoose');

module.exports = function () {
	mongoose
		.connect(process.env.DATABASE_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			console.log('\n --> Database connected succesfully');
		})
		.catch((err) => {
			console.log('\n --> Database connection error: ', err.message);
		});
};
