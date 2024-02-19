const { default: mongoose } = require("mongoose");

var blogSchema = new mongoose.Schema({
    blogEntry: {
        "blog-title": String,
        "blog-text": String,
        createdOn: { type: Date, default: Date.now }
    }
});

mongoose.model('Blog', blogSchema).console.log('Blog schema created');