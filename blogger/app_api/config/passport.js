var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  async (username, password, done) => {
    try {
        const user = await User.findOne({ email: username });
        if (!user) {
            return done(null, false, {
                message: 'Incorrect email or password.'
            });
        }
        // If the password is incorrect, return the message
        if (!user.validPassword(password)) {
            return done(null, false, {
                message: 'Incorrect email or password.'
            });
        }
       // If the credentials are correct, return the user object
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));