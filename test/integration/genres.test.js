const mongoose = require("mongoose");
const request = require("supertest");
const { Genre } = require("../../models/Genre");
const User = require("../../models/User");
const { app, conn } = require("../../server");

let server, agent;

// both approaches have the same flaw

describe("/api/genres", () => {
  beforeEach(() => {
    // server = app.listen(3335)
    agent = request.agent(app);
  });
  afterEach(async () => {
    // server && (await server.close());
    await Genre.deleteMany({});
  });

  // afterAll(async () => server && (await server.close()));
  afterAll(async () => conn && await conn.close())


  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.insertMany([
        { name: "genre1", movies: 23, isSafe: true },
        { name: "genre2", movies: 23, isSafe: true },
        { name: "genre3", movies: 23, isSafe: true },
      ]);

      const res = await agent.get("/api/genres");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre3")).toBeTruthy();
    });

    it("should return a 404 status if an invalid id is sent", async () => {
      const res = await agent.get("/api/genres/1234");
      expect(res.status).toBe(404);
    });

    it("should return a 404 status if the id do not exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await agent.get("/api/genres/" + id);
      expect(res.status).toBe(404);
    });

    it("should return the genre that corresponds the id passed", async () => {
      const genre = await new Genre({
        name: "genre",
        movies: 23,
        isSafe: true,
      });
      await genre.save();

      const res = await agent.get("/api/genres/" + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });
  });

  describe("POST /", () => {
    let token;
    let name;
    const exec = async () => {
      return await agent
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name, movies: 23, isSafe: true });
    };
    beforeEach(() => {
      name = "genrename";
      token = new User().generateAuthToken();
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if inputs are missing", async () => {
      const res = await agent
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "genre" });

      expect(res.status).toBe(400);
    });

    it("should return 400 if name is less than 3 characters", async () => {
      name = "aa";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the genre if it is valid", async () => {
      const res = await exec();

      const exists = await Genre.exists({ id: res.body._id });

      expect(exists).toBe(true);
    });

    it("should return the genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", name);
      expect(res.body).toHaveProperty("movies", 23);
      expect(res.body).toHaveProperty("isSafe", true);
    });
  });

  describe("PUT /", () => {
    let token;
    let name;
    let id;
    const exec = async () => {
      return await agent
        .put("/api/genres/" + id)
        .set("x-auth-token", token)
        .send({ name, movies: 23, isSafe: true });
    };
    beforeEach(() => {
      name = "genrename";
      id = mongoose.Types.ObjectId();
      token = new User().generateAuthToken();
    });

    it("should return 404 if the id passed is invalid", async () => {
      id = "1234";

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if the id passed does not match any genre", async () => {
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 400 if the information passed has invalid format ", async () => {
      const genre = await Genre.create({ name, movies: 23, isSafe: true });

      id = genre._id;
      name = "aa";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 200 if the information passed has valid format", async () => {
      const genre = await Genre.create({ name, movies: 23, isSafe: true });
      id = genre._id;

      const res = await exec();

      expect(res.status).toBe(200);
    });

    it("should return the genre saved if the information passed has valid format", async () => {
      const genre = await new Genre({ name, movies: 23, isSafe: true });
      await genre.save();

      id = genre._id;

      const res = await exec();

      expect(res.body).toEqual(
        expect.objectContaining({
          _id: genre.id,
          name: genre.name,
          movies: genre.movies,
          isSafe: genre.isSafe,
        })
      );
    });
  });

  describe("DELETE /", () => {
    let token;
    let name;
    let id;
    const exec = async () => {
      return await agent
        .delete("/api/genres/" + id)
        .set("x-auth-token", token)
        .send({ name, movies: 23, isSafe: true });
    };
    beforeEach(() => {
      name = "genrename";
      id = mongoose.Types.ObjectId();
      token = new User().generateAuthToken();
    });

    it("should return 404 if the id passed is invalid", async () => {
      id = "1234";

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if the id passed does not match any genre", async () => {
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 200 if the id passed matchs a genre", async () => {
      const genre = await Genre.create({ name, movies: 23, isSafe: true });
      id = genre._id;

      const res = await exec();

      expect(res.status).toBe(200);
    });

    it("should return the genre deleted if the id passed matchs a genre", async () => {
      const genre = await Genre.create({ name, movies: 23, isSafe: true });
      id = genre._id;

      const res = await exec();

      expect(res.body).toEqual(
        expect.objectContaining({
          _id: genre.id,
          name: genre.name,
          movies: genre.movies,
          isSafe: genre.isSafe,
        })
      );
    });
  });
});
