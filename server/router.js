const UserAuthController = require('./controllers/user_auth_controller');
const UserController = require('./controllers/user_controller');
const AdminAuthController = require('./controllers/admin_auth_controller');
const AdminController = require('./controllers/admin_controller');
const PublicController = require('./controllers/public_controller');
const passportService = require('./services/passport');
const passport = require('passport');


const requireAuth = passport.authenticate('user-jwt', { session: false });
const requireSignin = passport.authenticate('user-local', { session: false });
const adminRequireAuth = passport.authenticate('admin-jwt', { session: false });
const adminRequireSignin = passport.authenticate('admin-local', { session: false });


module.exports = function(app) {
	app.get('/event/:event_id', PublicController.getEvent);

	app.post('/signin', requireSignin, UserAuthController.signin); 
	app.post('/signup', UserAuthController.signup);

	app.put('/profile', requireAuth, UserAuthController.updateProfile);

	app.get('/meal/order/:order_id', requireAuth, UserController.getMealOrder);
	app.post('/meal/order/:registration_id', requireAuth, UserController.placeMealOrder);
	app.put('/meal/order/:order_id', requireAuth, UserController.updateMealOrder);
	app.delete('/meal/order/:order_id', requireAuth, UserController.deleteMealOrder);

	app.get('/event/register/:registration_id', requireAuth, UserController.getRegistrationInfo);
	app.post('/event/register/:event_id', requireAuth, UserController.registerForEvent);
	app.put('/event/register/:event_id', requireAuth, UserController.updateRegistration);
	app.delete('/event/register/:event_id', requireAuth, UserController.deleteRegistration);

	app.get('/test', function(req, res) {
		res.send("test success!");   
	});

	app.post('/admin/create', AdminAuthController.createAdmin);
	app.post('/admin/signin', adminRequireSignin, AdminAuthController.signin);

	app.post('/admin/event', adminRequireAuth, AdminController.createEvent);
	app.put('/admin/event/:event_id', adminRequireAuth, AdminController.updateEvent);
	app.delete('/admin/event/:event_id', adminRequireAuth, AdminController.deleteEvent);
	
	app.get('/admin/meal/all', adminRequireAuth, AdminController.getAllMeals);
	app.get('/admin/meal/:meal_id', adminRequireAuth, AdminController.getMeal);
	app.post('/admin/meal', adminRequireAuth, AdminController.createMeal);
	app.delete('/admin/meal/:meal_id', adminRequireAuth, AdminController.deleteMeal);
};