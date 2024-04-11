var mongoose = require('mongoose');
var time = require('moment-timezone');
var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};
var getDateTime = function() {
    return time().tz("America/New_York").format();
};

var BlogSchema = new mongoose.Schema({
    blogTitle: {type: String},
    blogEntry: {type: String,},
    createdOn: {
        type: Date,
        default: Date.now
    },

    author: {
        type: String,
        required: true
    },

    authorEmail: {
        type: String,
        required: true
    }
});
console.log('BlogSchema created');
module.exports =  mongoose.model('Blog', BlogSchema);
