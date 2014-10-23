// TODO: Controller for this section that controls navigation.
//       Makes sense for controller to also contain all the macros / functions,
//       now that I think about it

// Technically, this is really more of a ViewModel, but I'm lazy
// and I don't want to type that often
function PassageView(object, $container) {
	this.attributes = object.attributes;
	this.body = object.body;

	// TODO?: make this more abstracted / generalized
	this.prescript = object.prescript;
	this.postscript = object.postscript;
	eval(this.prescript);
	$container.append(this.body);
	eval(this.postscript);
}

function constructPassageViewMap(object) {
	window.passageViewMap = {};
	for (var i in object) {
		// Relies on the assumption that Zepto will be injected here
		// by lib/generator.js
		passageViewMap[i] = new PassageView(object[i], $('#passages'));
	}
}
// Assumes that variable passageData will be injected
constructPassageViewMap(passageData);