/*jslint node: true */
'use strict';
var http = require('http');
var httpStatusCodes = require('./hsc');
var xray = require('x-ray')();

var server = http.createServer().listen(8080, function() {
	console.log('Started')

});

server.on('request', function(req, res) {
	return http.get({
		host: 'www.selfridges.com',
		path: '/GB/en/cat/OnlineBrandDirectory'
	}, function(response) {
		// Continuously update stream with data
		var raw = '';
		response.on('data', function(d) {
			raw += d;
		});
		response.on('end', function() {

			xray(raw, 'li.shopBrandItem', [{
					name: 'a',
					url: 'a@href',
				}])
				(function(err, data) {
					if (err) {
						console.log('Error: ' + err);
					} else {
						
						res.statusCode = httpStatusCodes['OK'];
						data = JSON.stringify(data);

						res.setHeader('Content-Type', 'application/json; charset=utf-8');
						res.setHeader('Content-Encoding', 'utf8');
						res.setHeader('Content-Length', Buffer.byteLength(data, 'utf8'));
						res.end(data);

					}
				});
		});
	});
});