const { default: mongoose } = require("mongoose");

var blogSchema = new mongoose.Schema({
    blogEntry: {
        "blogTitle": String,
        "blogText": String,
        createdOn: { type: Date, default: Date.now }
    }
});

mongoose.model('Blog', blogSchema);
console.log('Blog schema created');