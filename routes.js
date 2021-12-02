const router = require("express").Router();
const customer = require('./controllers/customer');
const genre = require('./controllers/genre')
const home = require('./controllers/home');
const movie = require('./controllers/movie')
const rental = require('./controllers/rental');
const user = require('./controllers/user');
const auth = require('./controllers/auth');
const { authUser } = require('./middlewares/middlewares');

router.get("/", home.index);

router.get("/api/customers", authUser, customer.index);
router.get("/api/customers/:id", authUser, customer.showOne);
router.post("/api/customers", authUser, customer.register);
router.put("/api/customers/:id", authUser, customer.edit);
router.delete("/api/customers/:id", authUser, customer.delete);

router.get("/api/genres", genre.index);
router.get("/api/genres/:id", genre.showOne);
router.post("/api/genres", authUser, genre.register);
router.put("/api/genres/:id", authUser, genre.edit);
router.delete("/api/genres/:id", authUser, genre.delete);

router.get("/api/movies", movie.index);
router.get("/api/movies/:id", movie.showOne);
router.post("/api/movies", authUser, movie.register);
router.put("/api/movies/:id", authUser, movie.edit);
router.delete("/api/movies/:id", authUser, movie.delete);


router.get("/api/rentals", authUser, rental.index);
router.get("/api/rentals/:id", rental.showOne);
router.post("/api/rentals", authUser, rental.register);
router.put("/api/rentals/:id", authUser, rental.edit);
router.delete("/api/rentals/:id", authUser, rental.delete);

router.get("/api/users", user.index);
router.post("/api/users", user.register);

router.post("/api/auth", auth.login);

module.exports = router;
