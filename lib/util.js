require('es6-promise').polyfill();

var path = require('path');
var fs   = require('fs');
var dir  = require('node-dir');
var readDir = require('readdir');
var recurseDir = require('recursive-readdir');

module.exports = {
	getDirectories: function(directoryString) {
		return promise = new Promise(function(resolve, reject) {
			// Janky ways to get all directories
			readDir.read(directoryString, ['*/'], readDir.INCLUDE_DIRECTORIES, function(err, paths) {
				// Resolve paths
				for (var i = 0; i < paths.length; i++) {
					paths[i] = path.resolve(directoryString, paths[i]);
				}
			    if (err) {
			    	reject(err);
			    } else {
				    resolve(paths);
			    }
			});
		}).catch(function(err) {
			console.log(err.stack);
		});
	},
	getRecursiveDirectories: function(directoryString) {
		return promise = new Promise(function(resolve, reject) {
			dir.subdirs(directoryString, function(err, paths) {
			    if (err) {
			    	reject(err);
			    } else {
				    resolve(paths);
			    }
			});
		}).catch(function(err) {
			console.log(err.stack);
		});
	},
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
		}).catch(function(err) {
			console.log(err.stack);
		});
	},
	// Read all the files in a directory recursively then return one promise that resolves
	// when all of the files' contents have been grabbed.
	readUTF8RecursiveDirectoryFilesReturnPromise: function(dirpath, exclusions) {
		return new Promise(function(resolve, reject) {
			recurseDir(dirpath, exclusions || [], function (err, filepaths) {
				var promises = [];

				for (var i = 0; i < filepaths.length; i++) {
					// We also need a promise for each individual readFile
					promises.push(new Promise(function(resolve, reject) {
						fs.readFile(filepaths[i], { encoding: 'UTF8' }, function(err, contents) {
							if (err) {
								reject(err);
							} else {
								resolve(contents);
							}
						});
					}).catch(function(err) {
						console.log(err.stack);
					}));
				}

				Promise.all(promises).then(function(results) {
					resolve(results);
				}).catch(function(err) {
					console.log(err.stack);
				});
			});
		}).catch(function(err) {
			console.log(err.stack);
		});
	}
};