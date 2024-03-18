var mongoose = require('mongoose');
var blog = mongoose.model('blogSchema');


var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

var blogSchema = new mongoose.Schema({
    blogTitle: {type: String, required: true},
    blogEntry: {type: String, required: true},
    createdOn: {
        type: Date,
        "default": Date.now
    }
});





mongoose.model('blogs', blog);
