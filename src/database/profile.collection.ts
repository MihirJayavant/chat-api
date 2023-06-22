import { mongoose } from "/deps.ts";

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
});

export const Users = mongoose.model("users", userSchema);
