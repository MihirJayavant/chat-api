import * as local from "./environment.ts";
import * as qa from "./environment.qa.ts";
import * as prod from "./environment.release.ts";

function getEnvironment() {
  switch (Deno.env.get("APP_ENV")) {
    case "aw-qa":
      return qa.config;
    case "master":
      return prod.config;
    case "release":
      return prod.config;
    default:
      return local.config;
  }
}

export const environment = getEnvironment();
