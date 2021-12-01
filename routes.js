const router = require("express").Router();
const customer = require('./controllers/customer');
const genre = require('./controllers/genre')
const home = require('./controllers/home');
const movie = require('./controllers/movie')
const rental = require('./controllers/rental');
const user = require('./controllers/user');
const auth = require('./controllers/auth');

router.get("/", home.index);

router.get("/api/customers", customer.index);
router.get("/api/customers/:id", customer.showOne);
router.post("/api/customers", customer.register);
router.put("/api/customers/:id", customer.edit);
router.delete("/api/customers/:id", customer.delete);

router.get("/api/genres", genre.index);
router.get("/api/genres/:id", genre.showOne);
router.post("/api/genres", genre.register);
router.put("/api/genres/:id", genre.edit);
router.delete("/api/genres/:id", genre.delete);

router.get("/api/movies", movie.index);
router.get("/api/movies/:id", movie.showOne);
router.post("/api/movies", movie.register);
router.put("/api/movies/:id", movie.edit);
router.delete("/api/movies/:id", movie.delete);


router.get("/api/rentals", rental.index);
router.get("/api/rentals/:id", rental.showOne);
router.post("/api/rentals", rental.register);
router.put("/api/rentals/:id", rental.edit);
router.delete("/api/rentals/:id", rental.delete);

router.get("/api/users", user.index);
router.post("/api/users", user.register);

router.post("/api/auth", auth.login);

module.exports = router;
