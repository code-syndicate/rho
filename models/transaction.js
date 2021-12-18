var mongoose = require('mongoose');
var {nanoid} = require('nanoid');

function genVerificationCode() {
	return nanoid(8);
}

const depositSchema = mongoose.Schema({
	date: {type: Date, default: Date.now},
	ref: {
		type: mongoose.Types.ObjectId,
		default: mongoose.Types.ObjectId,
		unique: true,
	},
	amount: {type: Number, min: 0},
	description: String,
	details: String,
	approved: {type: Boolean, default: false},
	client: {type: mongoose.Types.ObjectId, ref: 'User'},
	walletType: {type: String, required: true},
	walletAdrress: {type: String, required: true, min: 24},
});

const withdrawalSchema = mongoose.Schema({
	date: {type: Date, default: Date.now},
	ref: {
		type: mongoose.Types.ObjectId,
		default: mongoose.Types.ObjectId,
		unique: true,
	},
	amount: {type: Number, min: 0},
	approved: {type: Boolean, default: false},
	walletType: {type: String, required: true},
	pin: {type: String, required: true, minLength: 4},
	details: String,
	client: {type: mongoose.Types.ObjectId, ref: 'User'},
	walletAdrress: {type: String, required: true, min: 24},
});

const Deposit = mongoose.model('Deposit', depositSchema);
const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);

module.exports = {
	Deposit,
	Withdrawal,
};
