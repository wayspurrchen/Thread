var path = require('path');

module.exports = {
	pathToFilename: function(pathString) {
		return path.basename(pathString).replace(/\.[^/.]+$/, "");
	},
	readUTF8FileReturnPromise: function(path) {
		return new Promise(function(resolve, reject) {
			fs.readFile(path, { encoding: 'UTF8' }, function(err, contents) {
				if (err) {
					reject(err);
				} else {
					resolve(contents);
				}
			});
		});
	}
};