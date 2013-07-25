#!/usr/bin/env node
/*
Automatically grad files for the presence of specified HTML tags/attributes.  
Uses commander.js and cheerio.  
Teaches command line application development and basic DOM parsing.
 
References:

+ cheerio
	- https://github.com/MatthewMueller/cheerio
   	- http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   	- http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

+ JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
 */


var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');
var sys = require('util');

var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json"
var URL_DEFAULT = "http://lowvolu.me"

var assertFileExists = function(infile) {
	var instr = infile.toString();
	console.log(infile);
	if(!fs.existsSync(instr)) {
		console.log("%s does not exist. Exiting.", instr);
		process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
	}
	return instr;
};

var cheerioHtmlFile = function(htmlfile) {
	return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
	return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
	$ = cheerioHtmlFile(htmlfile);
	var checks = loadChecks(checksfile).sort();
	var out = {};
	for(var ii in checks) {
		var present = $(checks[ii]).length > 0;
		out[checks[ii]] = present;
	}
	return out;
};

var clone = function(fn) {
	// Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

var url_arg = function(url) {
// 			return rest.get(url, function(response) {
// 				return response;
// 			})
		rest.get(url)
			.on('complete', function(response){
			console.log("derp");
			if(response instanceof Error) {
				sys.puts('Error: ' + result.message);

			} else {
				sys.puts(response);
				fs.writeFileSync('response.html', response);
				var checkJson = checkHtmlFile('response.html', program.checks);
				var outJson = JSON.stringify(checkJson, null, 4);
				fs.writeFileSync("outJson.json", outJson);
			}
		})
		}


if(require.main == module) {
	program
		.option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
		.option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
		.option('-u, --url <url>', 'URL', URL_DEFAULT)
		.parse(process.argv);
	if (process.argv[4] == '--url') {
		console.log("yes, it is a url");
		// String(url_arg(program.url))
		url_arg(program.url);
		console.log("yes, it is past url_arg(program.url)");
		// var checkJson = checkHtmlFile('response.html', program.checks);	

	} else {
			var checkJson = checkHtmlFile(program.file, program.checks);
			var outJson = JSON.stringify(checkJson, null, 4);
			fs.writeFileSync("outJson.json", outJson);	
		}
	

	
	// console.log(outJson);
	// fs.writeFileSync("response.json", url_arg(process.argv[5]));
	// console.log("It's ARGV!", process.argv)
} else {
	exports.checkHtmlFile = checkHtmlFile;
}

























