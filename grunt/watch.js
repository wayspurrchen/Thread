module.exports = {
	story: {
		files: [
			'story/**/*',
			'lib/**/*',
			'inject/**/*',
			'templates/**/*'
		],
		tasks: ['shell:story']
	}
};