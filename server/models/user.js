const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const CategorySchema = require('./category');

const UserSchema = new Schema({
	name: { type: String },
	email: { type: String, unique: true, lowercase: true },
	password: String,
	gender: { type: Boolean },
	address1: { type: String },
	address2: { type: String },
	address3: { type: String },
	city: { type: String },
	postcode: { type: String },
	country: { type: String },
	interests: [CategorySchema],
	admin: {
		type: Boolean,
		default: false
	}
});

// On Save Hook, encrypt password
// Before saving a model, run this function
UserSchema.pre('save', function(next) {
	// get access to the user model
	const user = this;

	if (!user.isModified('password')) { 
		return next(); 
	}
	// generate a salt then run callback
	bcrypt.genSalt(10, function(err, salt) {
		if (err) { return next(err); }

		// hash (encrypt) our password using the salt
		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if (err) { return next(err); }

			// overwrite plain text password with encrypted password
			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function(candidatePassword, callback){
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) { return callback(err); }
		callback(null, isMatch);
	});
};

// Create the model class
const User = mongoose.model('user', UserSchema);

// Export the model
module.exports = User;