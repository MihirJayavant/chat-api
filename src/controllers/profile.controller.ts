import { okResponse } from "/configs/api.config.ts";
import { createController, jsonBodySelector } from "./base.controller.ts";
import { Router } from "/deps.ts";
import { Users } from "/database/profile.collection.ts";

const router = new Router();

async function getProfile() {
  const users = await Users.find();
  return okResponse({ users });
}

async function postProfile(user: any) {
  const entity = new Users(user);
  await entity.save();
  return okResponse({ user });
}

createController({
  route: "/",
  controller: getProfile,
}).get(router);

createController({
  route: "/",
  selector: jsonBodySelector,
  controller: postProfile,
}).post(router);

export const profileRouter = router;
