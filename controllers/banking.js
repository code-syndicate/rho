var {body, validationResult} = require('express-validator');
var Notification = require('./../models/notification');
var {Deposit, Withdrawal} = require('./../models/transaction');

function home(req, res) {
	res.render('index');
}

async function deleteNotification(req, res) {
	await Notification.findByIdAndDelete(req.params.notificationId).exec();
	req.flash('info', 'Notification marked as read');
	res.locals.flash = true;

	res.redirect('/banking/app/');
}

const registerDeposit = [
	body('walletType', 'Wallet type is required').isAlphanumeric().notEmpty(),
	body('amount', 'Amount is required').isNumeric().notEmpty(),
	body('address', 'Wallet address is required')
		.notEmpty()
		.isBtcAddress()
		.withMessage('Please enter a valid wallet address'),
	body('description').optional(),
	body('date', 'Date is required')
		.notEmpty()

		.withMessage('Please enter a valid date'),

	async function (req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			req.flash('formErrors', errors.array());
			res.redirect(
				'/banking/app/?component_ref=transactions&sub_component_ref=D'
			);
			return;
		}

		const walletType = req.body.walletType;
		const amount = req.body.amount;
		const address = req.body.address;
		const description = req.body.description;
		const dateOfTransfer = req.body.date;

		const deposit = new Deposit({
			amount,
			description,
			client: req.user.id,
			date: dateOfTransfer,
			walletAdrress: address,
			walletType,
			details: `Deposited $${amount} into account`,
		});

		await new Notification({
			listener: req.user.id,
			description: `Submitted deposit request with reference ID - ${deposit.ref}`,
		}).save();

		req.flash(
			'info',
			'Your deposit claim has been submitted. Your account will be credited immediately it is verified'
		);
		res.locals.flash = true;

		await deposit.save();

		res.redirect('/banking/app/');
	},
];

const registerWithdrawal = [
	body('walletType', 'Wallet type is required').isAlphanumeric().notEmpty(),
	body('amount', 'Amount is required').isNumeric().notEmpty(),
	body('address', 'Wallet address is required')
		.notEmpty()
		.isBtcAddress()
		.withMessage('Please enter a valid wallet address'),
	body('pin')
		.isAlphanumeric()
		.withMessage('Please enter a valid PIN')
		.isLength({min: 4, max: 48}),

	async function (req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			req.flash('formErrors', errors.array());
			res.redirect(
				'/banking/app/?component_ref=transactions&sub_component_ref=W'
			);
			return;
		}

		const walletType = req.body.walletType;
		const amount = req.body.amount;
		const address = req.body.address;
		const pin = req.body.pin;

		const withdrawal = new Withdrawal({
			amount,
			client: req.user.id,
			walletAdrress: address,
			walletType,
			details: `Withdrew $${amount} into ${walletType} wallet address - ${address}`,
			pin,
		});

		await new Notification({
			listener: req.user.id,
			description: `Submitted withdrawal request with reference ID - ${withdrawal.ref}`,
		}).save();

		req.flash(
			'info',
			'Your withdrawal claim has been submitted. Your wallet will be credited shortly'
		);
		res.locals.flash = true;

		await withdrawal.save();

		res.redirect('/banking/app/');
	},
];

async function index(req, res) {
	let componentRef = req.query.component_ref || 'dashboard';
	let subComponentRef = req.query.sub_component_ref || 'D';

	const refComponents = [
		'withdrawals',
		'deposits',
		'notifications',
		'transactions',
		'settings',
	];

	const subRefComponents = ['D', 'W', 'V'];
	if (!refComponents.includes(componentRef)) {
		componentRef = 'dashboard';
	}

	if (!subRefComponents.includes(subComponentRef)) {
		subComponentRef = 'D';
	}

	const notificationCount = await Notification.count({
		listener: req.user.id,
		status: 'UNREAD',
	}).exec();
	res.locals.notificationCount = notificationCount;

	let transactions;

	let deposits = await Deposit.find({client: req.user.id}).lean().exec();
	deposits = deposits.slice(0, 10);
	let withdrawals = await Withdrawal.find({client: req.user.id})
		.lean()
		.exec();
	withdrawals = withdrawals.slice(0, 10);

	let notifications = await Notification.find({
		listener: req.user.id,
		status: 'UNREAD',
	})
		.lean()
		.exec();

	notifications = notifications.slice(0, 10);

	transactions = deposits.concat(withdrawals);

	res.locals.transactions = transactions;
	res.locals.deposits = deposits;
	res.locals.withdrawals = withdrawals;
	res.locals.notifications = notifications;
	res.locals.user = req.user;
	res.locals.BTC = 'bc1qhp4ghpz5z6nd60ge7mump80terk022y5gse8f9';
	res.locals.formErrors = req.flash('formErrors');

	res.render('base', {
		templateType: componentRef,
		subComponent: subComponentRef,
	});
}

module.exports = {
	index,
	registerWithdrawal,
	registerDeposit,
	deleteNotification,
	home,
};
