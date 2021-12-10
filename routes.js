const router = require("express").Router();
const customer = require("./controllers/customer");
const genre = require("./controllers/genre");
const movie = require("./controllers/movie");
const rental = require("./controllers/rental");
const user = require("./controllers/user");
const auth = require("./controllers/auth");
const returns = require("./controllers/returns");
const {
  authUser,
  isAdmin,
  apllyTryCatch,
  isValidObjectId,
  validate,
} = require("./middlewares/middlewares");
const {
  genrePostVerifier,
  genrePutVerifier,
  customerPostVerifier,
  customerPutVerifier,
  moviePostVerifier,
  moviePutVerifier,
  rentalPostVerifier,
  rentalPutVerifier,
  userPostVerifier,
  userLoginVerifier,
} = require("./verifiers");

router.get("/api/customers", authUser, apllyTryCatch(customer.index));
router.get(
  "/api/customers/:id",
  authUser,
  isValidObjectId,
  apllyTryCatch(customer.showOne)
);
router.post(
  "/api/customers",
  authUser,
  validate(customerPostVerifier),
  apllyTryCatch(customer.register)
);
router.put(
  "/api/customers/:id",
  isValidObjectId,
  authUser,
  validate(customerPutVerifier),
  apllyTryCatch(customer.edit)
);
router.delete(
  "/api/customers/:id",
  isValidObjectId,
  authUser,
  isAdmin,
  apllyTryCatch(customer.delete)
);

router.get("/api/genres", apllyTryCatch(genre.index));
router.get("/api/genres/:id", isValidObjectId, apllyTryCatch(genre.showOne));
router.post(
  "/api/genres",
  authUser,
  validate(genrePostVerifier),
  apllyTryCatch(genre.register)
);
router.put(
  "/api/genres/:id",
  isValidObjectId,
  authUser,
  validate(genrePutVerifier),
  apllyTryCatch(genre.edit)
);
router.delete(
  "/api/genres/:id",
  isValidObjectId,
  authUser,
  apllyTryCatch(genre.delete)
);

router.get("/api/movies", apllyTryCatch(movie.index));
router.get("/api/movies/:id", isValidObjectId, apllyTryCatch(movie.showOne));
router.post(
  "/api/movies",
  authUser,
  validate(moviePostVerifier),
  apllyTryCatch(movie.register)
);
router.put(
  "/api/movies/:id",
  isValidObjectId,
  authUser,
  validate(moviePutVerifier),
  apllyTryCatch(movie.edit)
);
router.delete(
  "/api/movies/:id",
  isValidObjectId,
  authUser,
  apllyTryCatch(movie.delete)
);

router.get("/api/rentals", authUser, apllyTryCatch(rental.index));
router.get("/api/rentals/:id", isValidObjectId, apllyTryCatch(rental.showOne));
router.post(
  "/api/rentals",
  authUser,
  validate(rentalPostVerifier),
  apllyTryCatch(rental.register)
);
router.put(
  "/api/rentals/:id",
  isValidObjectId,
  authUser,
  validate(rentalPutVerifier),
  apllyTryCatch(rental.edit)
);
router.delete(
  "/api/rentals/:id",
  isValidObjectId,
  authUser,
  apllyTryCatch(rental.delete)
);

router.get("/api/users", apllyTryCatch(user.index));
router.get("/api/users/me", authUser, apllyTryCatch(user.currentUser));
router.post(
  "/api/users",
  validate(userPostVerifier),
  apllyTryCatch(user.register)
);

router.post(
  "/api/auth",
  validate(userLoginVerifier),
  apllyTryCatch(auth.login)
);

router.post("/api/returns", authUser, validate(rentalPostVerifier), apllyTryCatch(returns));

module.exports = router;
