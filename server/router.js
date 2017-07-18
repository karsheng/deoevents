const UserAuthController = require('./controllers/user_auth_controller');
const UserController = require('./controllers/user_controller');
const AdminAuthController = require('./controllers/admin_auth_controller');
const AdminController = require('./controllers/admin_controller');
const PublicController = require('./controllers/public_controller');
const PayPalPaymentController = require('./controllers/paypal_payment_controller');
const passportService = require('./services/passport');
const passport = require('passport');

// To be deleted after integration of payment system
const FakePaymentController = require('./controllers/fake_payment_controller');

const requireAuth = passport.authenticate('user-jwt', { session: false });
const requireSignin = passport.authenticate('user-local', { session: false });
const adminRequireAuth = passport.authenticate('admin-jwt', { session: false });
const adminRequireSignin = passport.authenticate('admin-local', { session: false });


module.exports = function(app) {
	app.get('/api/event/open/all', PublicController.getAllOpenEvents);
	app.get('/api/event/:event_id', PublicController.getEvent);
	app.get('/api/associate/all', PublicController.getAllAssociates);
	app.get('/api/associate/:associate_id', PublicController.getAssociate);

	app.post('/api/signin', requireSignin, UserAuthController.signin); 
	app.post('/api/signup', UserAuthController.signup);
	app.put('/api/user/email', requireAuth, UserAuthController.updateEmail);
	app.post('/api/user/password/change', requireAuth, UserAuthController.changePassword);
	
	app.get('/api/profile', requireAuth, UserAuthController.getProfile);
	app.put('/api/profile', requireAuth, UserAuthController.updateProfile);

	app.get('/api/registration/:registration_id', requireAuth, UserController.getRegistrationInfo);
	app.post('/api/event/register/:event_id', requireAuth, UserController.registerForEvent);
	
	// fake payment execution
	// to be deleted when payment system is integrated
	app.post('/api/fakepayment/:registration_id', requireAuth, FakePaymentController.executeFakePayment);

	app.post('/api/paypal/create-payment/:registration_id', requireAuth, PayPalPaymentController.createPayment);
	app.post('/api/paypal/execute-payment/:registration_id', requireAuth, PayPalPaymentController.executePayment);

	app.get('/api/test', function(req, res) {
		res.send("test success!");   
	});

	app.post('/api/admin/create', AdminAuthController.createAdmin); // TO BE DELETED
	app.post('/api/admin/signin', adminRequireSignin, AdminAuthController.signin);

	app.post('/api/admin/category', adminRequireAuth, AdminController.createCategory);
	app.delete('/api/admin/category/:category_id', adminRequireAuth, AdminController.removeCategory);

	app.post('/api/admin/event', adminRequireAuth, AdminController.createEvent);
	app.put('/api/admin/event/:event_id', adminRequireAuth, AdminController.updateEvent);
	app.delete('/api/admin/event/:event_id', adminRequireAuth, AdminController.deleteEvent);
	
	app.get('/api/admin/meal/all', adminRequireAuth, AdminController.getAllMeals);
	app.get('/api/admin/meal/:meal_id', adminRequireAuth, AdminController.getMeal);
	app.post('/api/admin/meal', adminRequireAuth, AdminController.createMeal);
	app.delete('/api/admin/meal/:meal_id', adminRequireAuth, AdminController.deleteMeal);

	app.post('/api/admin/associate', adminRequireAuth, AdminController.createAssociate);
	app.put('/api/admin/associate/:associate_id', adminRequireAuth, AdminController.updateAssociate);
	app.delete('/api/admin/associate/:associate_id', adminRequireAuth, AdminController.deleteAssociate);
};