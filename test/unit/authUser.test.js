const mongoose = require("mongoose");
const User = require("../../models/User");
const { authUser } = require("../../middlewares/middlewares");

describe("authUser", () => {
  it("should should populate req.user with the payload of a valid JWT", () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: false,
    };
    const token = new User(user).generateAuthToken();

    const req = { header: () => token };
    const res = () => undefined;
    const next = () => undefined;

    authUser(req, res, next);

    expect(req.user).toBeDefined();
    expect(req.user).toMatchObject(user);
  });
});
