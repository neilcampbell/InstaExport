var request = require('request');
var fs = require('fs');
var shortId = require('shortid');

var options = {
    clientId: '',
    tag: ''
};

var InstaExport = (function () {

    var exportUrlFormat = 'https://api.instagram.com/v1/tags/' + options.tag + '/media/recent?client_id=' + options.clientId;

    function InstaExport(options) {
        if (options.clientId === '' || options.tag === '') {
            throw new Error('Please supply both clientId and tag');
        }
    }

    function createDirectoryIfItDoesntExist(path) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    }

    function downloadImage(url, exportPath) {
        createDirectoryIfItDoesntExist(exportPath);
        request(url).pipe(fs.createWriteStream(exportPath + '/' + shortId.generate() + '.jpg'));
    }

    function fetchAndDownloadImages(url, exportPath) {
        request(url, function (error, response, body) {
            if (error || response.statusCode !== 200) {
                console.log('Error getting Instagram images');
                return;
            }

            var response = JSON.parse(body);
            var nextUrl = response.pagination.next_url;

            for (var i = 0; i < response.data.length; i++) {
                var item = response.data[i];
                console.log('exporting: ' + item.images.standard_resolution.url);
                downloadImage(item.images.standard_resolution.url, exportPath);
            }
            if (nextUrl) {
                fetchAndDownloadImages(nextUrl, exportPath);
            }
            else {
                console.log('done');
            }
        });
    }

    InstaExport.prototype.downloadImages = function (exportPath) {
        if (!exportPath) {
            exportPath = "images/"
        }

        fetchAndDownloadImages(exportUrlFormat, exportPath);
    };

    return InstaExport;
})();

var exporter = new InstaExport(options);
exporter.downloadImages();