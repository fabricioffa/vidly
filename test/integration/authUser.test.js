const request = require("supertest");
const User = require("../../models/User");
const { Genre } = require("../../models/Genre");
const { app, conn } = require("../../server");
let server, agent;

describe("authUser", () => {
  beforeEach(() => {
    token = new User().generateAuthToken();
    // server = app.listen(3334)
    agent = request.agent(app);
  });

  afterEach(async () => {
    await Genre.deleteMany({});
    // server && await server.close();
  });

  afterAll(async () => conn && await conn.close())

  let token;
  const exec = () => {
    return agent
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre", movies: 23, isSafe: true });
  };

  it("should return 401 if no token is provided", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if a invalid token is provided", async () => {
    token = "1234";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if a valid token is provided", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
});
