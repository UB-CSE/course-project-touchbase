import { Forbidden } from "@feathersjs/errors";
import app from "@/app";

const userInfo = {
  email: "someone@example.com",
  password: "supersecret",
};

beforeEach(async () => {
  await app.service("users").create(userInfo);
});

describe("'workspaces' service", () => {
  it("registered the service", () => {
    const service = app.service("workspaces");
    expect(service).toBeTruthy();
  });
});

it("creates and fetches workspaces for a user", async () => {
  const { accessToken, user } = await app.service("authentication").create(
    {
      strategy: "local",
      ...userInfo,
    },
    {}
  );

  const idk = await app.service("workspaces").create(
    {
      strategy: "local",
      name: "D&D stuff",
      ownerID: user.id,
    },
    {}
  );

  const testget = await app.service("workspaces").get(idk.id, {
    provider: "rest",
    authentication: { strategy: "jwt", accessToken },
  });

  const res = await app.service("workspaces").find({
    query: { name: "D&D stuff", $limit: 1 },
    paginate: false,
    provider: "rest",
    authentication: { strategy: "jwt", accessToken },
  });

  if (Array.isArray(res)) {
    expect(res[0].name).toBeDefined();
  } else {
    fail("Pagination was disabled, but we didn't get an array");
  }
});

it("doesn't allow another user to access", async () => {
  const { user } = await app.service("authentication").create(
    {
      strategy: "local",
      ...userInfo,
    },
    {}
  );

  const idk = await app.service("workspaces").create(
    {
      strategy: "local",
      name: "electric boogaloo",
      ownerID: user.id,
    },
    {}
  );

  const userInfo2 = {
    email: "pleasefortheloveofcthuluwork@example.com",
    password: "eslintistheworstthingonearth",
  };

  await app.service("users").create(userInfo2);

  const { accessToken } = await app.service("authentication").create(
    {
      strategy: "local",
      ...userInfo2,
    },
    {}
  );

  expect(async () => {
    const testget = await app.service("workspaces").get(idk.id, {
      provider: "rest",
      authentication: { strategy: "jwt", accessToken },
    });
  }).rejects.toThrow(Forbidden);
});
