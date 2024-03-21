var mongoose = require('mongoose');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

var BlogSchema = new mongoose.Schema({
    blogTitle: {type: String},
    blogEntry: {type: String,},
    createdOn: {
        type: Date,
        default: Date.now
    }
});
console.log('BlogSchema created');
module.exports =  mongoose.model('Blog', BlogSchema);
