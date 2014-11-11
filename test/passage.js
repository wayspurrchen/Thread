var path   = require('path');
var expect   = require('expect.js');
var file     = require('../lib/passage/file.js');
var passageUtil = require('../lib/passage/util.js');
var composer = require('../lib/passage/composer.js');

var correctStoryDir = path.resolve(__dirname, 'fixtures/stories/correct');

describe('passage/file.js', function() {
	describe('#loadFile', function() {
		it('should load a file correctly', function() {
			file.loadFile()
		});
	});
	describe('#parseFrontMatter', function() {
		var results = undefined;

		beforeEach(function(done) {
			file.loadFile(correctStoryDir + '/front_matter.md')
				.then(function(contents) {
					results = file.parseFrontMatter(contents);
					done();
				});
		});

		it('should parse front matter properly', function() {
			expect(results).to.have.key('attributes');
			expect(results.attributes.title).to.be('I have front-matter');
			expect(results.attributes.arbitrary).to.be('I am arbitrary front matter');
		});
		it('should retain body', function() {
			expect(results).to.have.key('body');
			expect(results.body).to.be('\nHi, this has front-matter.');
		});
	});
});

describe('passage/util.js', function() {
	var contents = undefined;
	beforeEach(function(done) {
		file.loadFile(correctStoryDir + '/tag_contents.md')
			.then(function(result) {
				contents = result;
				done();
			});
	});

	describe('#getTagContents', function() {
		var prescript;
		var postscript;
		beforeEach(function() {
			prescript  = passageUtil.getTagContents('prescript', contents);
			postscript = passageUtil.getTagContents('postscript', contents);
		});

		it('returns contents for each instance of a tag', function() {
			expect(prescript).to.have.length(1);
			expect(postscript).to.have.length(2);
		});
		it('returns stripped and full contents', function() {
			expect(prescript[0]).to.have.key('stripped');
			expect(prescript[0]).to.have.key('full');
			expect(postscript[0]).to.have.key('stripped');
			expect(postscript[0]).to.have.key('full');
			expect(postscript[1]).to.have.key('stripped');
			expect(postscript[1]).to.have.key('full');
		});
		it('properly returns stripped contents', function() {
			expect(prescript[0].stripped).to.be("console.log('I\\'m executed beforehand!');");
			expect(postscript[0].stripped).to.be("\nconsole.log('I\\'m loaded afterwards!');\n");
			expect(postscript[1].stripped).to.be("\nconsole.log('Me too!');\n");
		});
		it('properly returns full contents', function() {
			expect(prescript[0].full).to.be("<prescript>console.log('I\\'m executed beforehand!');</prescript>");
			expect(postscript[0].full).to.be("<postscript>\nconsole.log('I\\'m loaded afterwards!');\n</postscript>");
			expect(postscript[1].full).to.be("<postscript>\nconsole.log('Me too!');\n</postscript>");
		});
	});

	describe('#parseDoubleSquareBrackets', function() {
		it('works', function() {
			var parsed = passageUtil.parseDoubleSquareBrackets(contents);
			expect(parsed[0].stripped).to.be('This is a link');
			expect(parsed[0].full).to.be('[[This is a link]]');
			expect(parsed[1].stripped).to.be('This is a second link');
			expect(parsed[1].full).to.be('[[This is a second link]]');
			expect(parsed[2].stripped).to.be('This is a third link');
			expect(parsed[2].full).to.be('[[This is a third link]]');
		});
	});

	describe('#parseDoubleCurlyBraces', function() {
		it('works', function() {
			var parsed = passageUtil.parseDoubleCurlyBraces(contents);
			expect(parsed[0].stripped).to.be('This is inside curlies');
			expect(parsed[0].full).to.be('{{This is inside curlies}}');
			expect(parsed[1].stripped).to.be('This is curlies two');
			expect(parsed[1].full).to.be('{{This is curlies two}}');
		});
	});
});

// The passage composer should:
// 
// 1. Strip out any predefined tags (<prescript>, <postscript>)
// and turn them into attributes on the passage object
// 2. Should detect links and generate an array of story links
// 3. 

describe('passage/composer.js', function() {

	describe('#generatePassageObject', function() {
		var contents = undefined;
		var attributes = undefined;
		var pObject = undefined;

		beforeEach(function(done) {
			file.loadFile(correctStoryDir + '/tag_contents.md')
				.then(function(result) {
					contents = result;
					attributes = file.parseFrontMatter(contents).attributes;
					pObject = composer.generatePassageObject(contents, attributes);
					done();
				});
		});


		it('should have proper keys', function() {
			expect(pObject).to.have.key('attributes');
			expect(pObject).to.have.key('postscript');
			expect(pObject).to.have.key('prescript');
			expect(pObject).to.have.key('body');
		})
	});
})