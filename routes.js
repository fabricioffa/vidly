const router = require("express").Router();
const customer = require('./controllers/customer');
const genre = require('./controllers/genre')
const movie = require('./controllers/movie')
const rental = require('./controllers/rental');
const user = require('./controllers/user');
const auth = require('./controllers/auth');
const { authUser, isAdmin, apllyTryCatch } = require('./middlewares/middlewares');

router.get("/api/customers", authUser, apllyTryCatch(customer.index));
router.get("/api/customers/:id", authUser, apllyTryCatch(customer.showOne));
router.post("/api/customers", authUser, apllyTryCatch(customer.register));
router.put("/api/customers/:id", authUser, apllyTryCatch(customer.edit));
router.delete("/api/customers/:id", authUser, isAdmin, apllyTryCatch(customer.delete));

router.get("/api/genres", apllyTryCatch(genre.index));
router.get("/api/genres/:id", apllyTryCatch(genre.showOne));
router.post("/api/genres", authUser, apllyTryCatch(genre.register));
router.put("/api/genres/:id", authUser, apllyTryCatch(genre.edit));
router.delete("/api/genres/:id", authUser, apllyTryCatch(genre.delete));

router.get("/api/movies", apllyTryCatch(movie.index));
router.get("/api/movies/:id", apllyTryCatch(movie.showOne));
router.post("/api/movies", authUser, apllyTryCatch(movie.register));
router.put("/api/movies/:id", authUser, apllyTryCatch(movie.edit));
router.delete("/api/movies/:id", authUser, apllyTryCatch(movie.delete));


router.get("/api/rentals", authUser, apllyTryCatch(rental.index));
router.get("/api/rentals/:id", apllyTryCatch(rental.showOne));
router.post("/api/rentals", authUser,apllyTryCatch( rental.register));
router.put("/api/rentals/:id", authUser, apllyTryCatch(rental.edit));
router.delete("/api/rentals/:id", authUser, apllyTryCatch(rental.delete));


router.get("/api/users", apllyTryCatch(user.index));
router.get("/api/users/me", authUser, apllyTryCatch(user.currentUser));
router.post("/api/users", apllyTryCatch(user.register));

router.post("/api/auth", apllyTryCatch(auth.login));

module.exports = router;
