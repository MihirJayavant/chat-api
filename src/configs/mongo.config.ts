import { mongoose } from "/deps.ts";

export async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/chatdb");
}
