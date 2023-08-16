import { okResponse } from "/configs/api.config.ts";
import { createController, jsonBodySelector } from "./base.controller.ts";
import { Router } from "/deps.ts";
import { Users } from "/database/profile.collection.ts";
import { IUser } from "../actors/profile.actor.ts";
import { getQuery } from "https://deno.land/x/oak@v12.5.0/helpers.ts";

const router = new Router();

async function getProfile(query: Record<string, string>) {
  const users = await Users.findOne({ email: query.email });
  return okResponse({ users });
}

async function postProfile(user: IUser) {
  const entity = new Users(user);
  await entity.save();
  return okResponse({ user });
}

createController({
  route: "/",
  selector: (ctx) => Promise.resolve(getQuery(ctx, { mergeParams: true })),
  controller: getProfile,
}).get(router);

createController({
  route: "/",
  selector: jsonBodySelector,
  controller: postProfile,
}).post(router);

export const profileRouter = router;
