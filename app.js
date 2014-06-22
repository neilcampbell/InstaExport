var InstaExport = require('./instaexport');

var options = {
    clientId: '',
    tag: '',
    limit: 0
};

var exporter = new InstaExport(options);
exporter.downloadImages();