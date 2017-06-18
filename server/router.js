const UserAuthController = require('./controllers/user_auth_controller');
const UserController = require('./controllers/user_controller');
const AdminAuthController = require('./controllers/admin_auth_controller');
const AdminController = require('./controllers/admin_controller');
const passportService = require('./services/passport');
const passport = require('passport');


const requireAuth = passport.authenticate('user-jwt', { session: false });
const requireSignin = passport.authenticate('user-local', { session: false });
const adminRequireAuth = passport.authenticate('admin-jwt', { session: false });
const adminRequireSignin = passport.authenticate('admin-local', { session: false });


module.exports = function(app) {
	app.post('/signin', requireSignin, UserAuthController.signin); 
	app.post('/signup', UserAuthController.signup);
	app.post('/meal/order', requireAuth, UserController.placeMealOrder)
	app.post('/event/register', requireAuth, UserController.registerForEvent);

	app.get('/test', function(req, res) {
		res.send("test success!");   
	});

	app.post('/admin/create', AdminAuthController.createAdmin);
	app.post('/admin/signin', adminRequireSignin, AdminAuthController.signin);
	app.post('/admin/category', adminRequireAuth, AdminController.createCategory);
	app.post('/admin/event', adminRequireAuth, AdminController.createEvent);
	app.post('/admin/meal', adminRequireAuth, AdminController.createMeal);
};