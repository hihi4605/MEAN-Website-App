var mongoose = require('mongoose');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};
var dbURI = "mongodb+srv://Chris:DrakeFan58949$@mydb.srmedx4.mongodb.net/";
mongoose.connect(dbURI);
var Blog = new mongoose.Schema({
    blogTitle: {type: String, required: true},
    blogEntry: {type: String, required: true},
    createdOn: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Blog', Blog);

require('./db');