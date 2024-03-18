var mongoose = require('mongoose');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};
var dbURI = 'mongodb://localhost/Blogs';
mongoose.connect(dbURI);
var Blog = new mongoose.Schema({
    blogTitle: {type: String, required: true},
    blogEntry: {type: String, required: true},
    createdOn: {
        type: Date,
        default: Date.now
    }
});

require('./db');