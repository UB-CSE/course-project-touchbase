import app from "../../src/app";

describe("'users' service", () => {
  const userInfo = {
    email: "someone@example.com",
    password: "supersecret",
  };

  beforeAll(async () => {
    try {
      await app.service("users").create(userInfo);
    } catch (error) {
      // Do nothing, it just means the user already exists and can be tested
    }
  });

  it("registered the service", () => {
    const service = app.service("users");
    expect(service).toBeTruthy();
  });

  it("prevents access to the user email before logged in", async () => {
    const res = await app.service("users").find({
      query: { email: userInfo.email, $limit: 1 },
      paginate: false,
      provider: "rest",
    });

    if (Array.isArray(res)) {
      expect(res[0].email).toBeUndefined();
    } else {
      fail("Pagination was disabled, but we didn't get an array");
    }
  });

  it("allows access to the user email field after logged in", async () => {
    const { accessToken } = await app.service("authentication").create(
      {
        strategy: "local",
        ...userInfo,
      },
      {}
    );

    const res = await app.service("users").find({
      query: { email: userInfo.email, $limit: 1 },
      paginate: false,
      provider: "rest",
      authentication: { strategy: "jwt", accessToken },
    });

    if (Array.isArray(res)) {
      expect(res[0].email).toBeDefined();
    } else {
      fail("Pagination was disabled, but we didn't get an array");
    }
  });
});