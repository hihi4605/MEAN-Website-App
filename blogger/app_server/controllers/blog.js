module.exports.blogAdd = function(req, res) {
    res.render('blogAdd', {title: 'Add Blog'});
};

module.exports.blogList = function(req, res) {
    res.render('blogList', {title: 'blogList'});
};