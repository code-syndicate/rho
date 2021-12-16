function index(req, res) {
	let componentRef = req.query.component_ref || 'dashboard';
	let subComponentRef = req.query.sub_component_ref || 'D';

	const refComponents = [
		'withdrawals',
		'deposits',
		'notifications',
		'transactions',
		'settings',
	];

	const subRefComponents = ['D', 'W'];
	if (!refComponents.includes(componentRef)) {
		componentRef = 'dashboard';
	}

	if (!subRefComponents.includes(subComponentRef)) {
		subComponentRef = 'D';
	}
	res.render('base', {
		templateType: componentRef,
		subComponent: subComponentRef,
	});
}

module.exports = {
	index,
};
