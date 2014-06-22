var request = require('request');
var fs = require('fs');
var shortId = require('shortid');

var options = {
	clientId: '',
	tag: ''
};

var instaExport = function(options) {
	if(options.clientId === '' || options.tag === '') {
		throw new Error('Please supply both clientId and tag');
	}

	var tagExportUrl = 'https://api.instagram.com/v1/tags/' + options.tag + '/media/recent?client_id=' + options.clientId;
	
	function fetchImages(url) {
		request(url, function (error, response, body) {
			if(error || response.statusCode !== 200) {
				console.log('Error getting Instagram images');
				return;
			}
			
			var response = JSON.parse(body);
			var nextUrl = response.pagination.next_url;
			
			for(var i = 0; i < response.data.length; i++) {
				var item = response.data[i];
				console.log('exporting: ' + item.images.standard_resolution.url);
				downloadImage(item.images.standard_resolution.url);
			}
			if(nextUrl) {
				fetchImages(nextUrl);
			}
			else {
				console.log('done');
			}
		});
	}

	function downloadImage(url) {
		request(url).pipe(fs.createWriteStream('images/' + shortId.generate() + '.jpg'))
	}
	
	return {
		downloadImages: function() { fetchImages(tagExportUrl); }
	};
};

var exporter = instaExport(options);
exporter.downloadImages();