const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local strategy
const localOptions = { usernameField: 'email' }
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
	
	User.getAuthenticated(email, password, function(err, user, reason) {
		if (err) return done(err);
		if (user) return done(null, user);

		const reasons = User.failedLogin;

		switch (reason) {
			case reasons.NOT_FOUND:
				done(null, false);
				break;
			case reasons.PASSWORD_INCORRECT:
				done(null, false);
				break;
			case reasons.MAX_ATTEMPTS:
				// TODO: send email to users to notify them about locked account
				done(null, false);
				break;
		}

	});

});


// Setup option for JWT Strategy
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: config.secret
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
	// See if the user ID in the payload exists in our database
	// if it does, call 'done' with that user
	// otherwise, call done without user object
	User.findById(payload.sub, function(err, user) {
		// second argument should be user object,
		// but null here since there's an error
		if (err) { return done(err, false); } 

		if (user) {
			done(null, user);
		} else {
			done(null, false);
		}
	});
});

// admin local strategy
const adminLocalOptions = { usernameField: 'email' }
const adminLocalLogin = new LocalStrategy(adminLocalOptions, function(email, password, done) {
	User.findOne({ email: email }, function(err, user) {
		if (err) { return done(err); }
		if (!user) { return done(null, false); }
		if (!user.admin) { return done(null, false); }		
		
		// compare passwords - is 'password' equal to user password
		user.comparePassword(password, function(err, isMatch) {
			if (err) { return done(err); }
			if (!isMatch) { return done(null, false); }

			return done(null, user);
		});
	});

});

// Setup option for JWT Strategy
const adminJwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('admin-authorization'),
	secretOrKey: config.secret
};

// Create JWT strategy
const adminJwtLogin = new JwtStrategy(adminJwtOptions, function(payload, done){
	User.findById(payload.sub, function(err, user) {
		if (err) { return done(err, false); } 

		if (user && user.admin) {
			done(null, user);
		} else {
			done(null, false);
		}
	});
});

// Tell passport to use this strategy
passport.use('user-jwt', jwtLogin);
passport.use('user-local', localLogin);
passport.use('admin-jwt', adminJwtLogin);
passport.use('admin-local', adminLocalLogin);