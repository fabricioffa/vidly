const mongoose = require("mongoose");
const request = require("supertest");
const User = require("../../models/User");
const Rental = require("../../models/Rental");
const Movie = require("../../models/Movie");
const { app, conn } = require("../../server");

let agent;

describe("/api/returns", () => {
  beforeEach(() => {
    agent = request.agent(app);
  });

  afterAll(async () => conn && (await conn.close()));

  describe("POST /", () => {
    let token, name, rental, movie, customerId, movieId;

    const exec = async () => {
      return await agent
        .post("/api/returns")
        .set("x-auth-token", token)
        .send({ customerId, movieId });
    };

    beforeEach(async () => {
      name = "genrename";
      token = new User().generateAuthToken();
      customerId = mongoose.Types.ObjectId();

      movie = await Movie.create({
        title: "title",
        genre: {
          _id: mongoose.Types.ObjectId(),
          name: "name",
          movies: 10,
          isSafe: true,
        },
        numberInStock: 15,
        dailyRentalRate: 10,
      });

      movieId = movie._id;

      rental = await Rental.create({
        customer: customerId,
        movie: movieId,
        dateOut: Date.now() - 1000 * 60 * 60 * 24 * 7,
      });
    });

    afterEach(async () => {
      await Rental.deleteMany({});
      await Movie.deleteMany({});
    });

    afterAll(async () => await Movie.deleteMany({}));

    it("should return 401 if no token is provided", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if a invalid token is sent", async () => {
      token = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if customerId is not provided", async () => {
      customerId = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if movieId is not provided", async () => {
      movieId = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if no rental found for this costumer/movie combination", async () => {
      customerId = mongoose.Types.ObjectId();
      movieId = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 400 if rental already processed", async () => {
      await rental.update({ devolutionDate: Date.now() });

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 200 if request is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it("should set the return date", async () => {
      const res = await exec();

      expect(res.body.devolutionDate > res.body.dateOut).toBe(true);
    });

    it("should set the rental fee", async () => {
      const res = await exec();

      expect(res.body.rentalFee).toBe(70);
    });

    it("should update stock", async () => {
      await exec();

      const updatedMovie = await Movie.findOne({ _id: movieId });

      expect(updatedMovie.numberInStock).toBe(movie.numberInStock + 1);
    });

    it("should return the rental", async () => {
      const res = await exec();

      const rentalInDb = await Rental.findById(rental._id);

      expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['_id', 'customer', 'movie', 'dateOut','devolutionDate']));
    });
  });
});
