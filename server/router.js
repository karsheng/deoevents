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
	app.get('/event/open/all', PublicController.getAllOpenEvents);
	app.get('/event/:event_id', PublicController.getEvent);
	app.get('/associate/all', PublicController.getAllAssociates);
	app.get('/associate/:associate_id', PublicController.getAssociate);

	app.post('/signin', requireSignin, UserAuthController.signin); 
	app.post('/signup', UserAuthController.signup);
	app.put('/user/email', requireAuth, UserAuthController.updateEmail);
	app.post('/user/password/change', requireAuth, UserAuthController.changePassword);
	
	app.get('/profile', requireAuth, UserAuthController.getProfile);
	app.put('/profile', requireAuth, UserAuthController.updateProfile);

	app.get('/registration/:registration_id', requireAuth, UserController.getRegistrationInfo);
	app.post('/event/register/:event_id', requireAuth, UserController.registerForEvent);
	
	// fake payment execution
	// to be deleted when payment system is integrated
	app.post('/fakepayment/:registration_id', requireAuth, FakePaymentController.executeFakePayment);

	app.post('/paypal/create-payment/:registration_id', requireAuth, PayPalPaymentController.createPayment);
	app.post('/paypal/execute-payment/:registration_id', requireAuth, PayPalPaymentController.executePayment);

	app.get('/test', function(req, res) {
		res.send("test success!");   
	});

	app.post('/admin/create', AdminAuthController.createAdmin); // TO BE DELETED
	app.post('/admin/signin', adminRequireSignin, AdminAuthController.signin);

	app.post('/admin/category', adminRequireAuth, AdminController.createCategory);
	app.delete('/admin/category/:category_id', adminRequireAuth, AdminController.removeCategory);

	app.post('/admin/event', adminRequireAuth, AdminController.createEvent);
	app.put('/admin/event/:event_id', adminRequireAuth, AdminController.updateEvent);
	app.delete('/admin/event/:event_id', adminRequireAuth, AdminController.deleteEvent);
	
	app.get('/admin/meal/all', adminRequireAuth, AdminController.getAllMeals);
	app.get('/admin/meal/:meal_id', adminRequireAuth, AdminController.getMeal);
	app.post('/admin/meal', adminRequireAuth, AdminController.createMeal);
	app.delete('/admin/meal/:meal_id', adminRequireAuth, AdminController.deleteMeal);

	app.post('/admin/associate', adminRequireAuth, AdminController.createAssociate);
	app.put('/admin/associate/:associate_id', adminRequireAuth, AdminController.updateAssociate);
	app.delete('/admin/associate/:associate_id', adminRequireAuth, AdminController.deleteAssociate);
};