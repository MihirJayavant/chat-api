import { environment } from "./environments/index.ts";
import { mongoose } from "/deps.ts";

export async function mongoConnect() {
  await mongoose.connect(environment.mongoUrl);
}
