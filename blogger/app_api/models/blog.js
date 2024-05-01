var mongoose = require('mongoose');
var time = require('moment-timezone');
var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};
var getDateTime = function() {
    return time().tz("America/New_York").format();
};

var reactionschema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'User ID is required',
        ref: 'User' 
    },
    reaction: {
        type: String,
        required: 'Reaction is required',
        enum: ['like', 'dislike']
    }
}, {_id: false});

var commentSchema = new mongoose.Schema({
    commentText: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    authorEmail: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    reactions: [reactionschema]
});

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
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    comments: [commentSchema],
    reactions: [reactionschema]
});

module.exports = mongoose.model('Blog', BlogSchema);