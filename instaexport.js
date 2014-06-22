var request = require('request');
var fs = require('fs');
var shortId = require('shortid');

var InstaExport;

module.exports = InstaExport = (function () {
    var itemCount = 0;
    var exportUrl;
    var cfg;

    function InstaExport(options) {
        if (options.clientId === '' || options.tag === '') {
            throw new Error('Please supply both clientId and tag');
        }

        if(!options.limit) {
            options.limit = 0;
        }

        cfg = {
            clientId: options.clientId,
            tag: options.tag,
            limit: options.limit,
            exportUrl: 'https://api.instagram.com/v1/tags/' + options.tag + '/media/recent?client_id=' + options.clientId
        };
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

            var responseBody = JSON.parse(body);
            var nextUrl = responseBody.pagination.next_url;

            for (var i = 0; i < responseBody.data.length && (cfg.limit < 1 || itemCount < cfg.limit); i++) {
                var item = responseBody.data[i];
                console.log('exporting: ' + item.images.standard_resolution.url);
                downloadImage(item.images.standard_resolution.url, exportPath);
                itemCount++;
            }
            if (nextUrl && (cfg.limit < 1 || itemCount < cfg.limit)) {
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

        fetchAndDownloadImages(cfg.exportUrl, exportPath);
    };

    return InstaExport;
})();