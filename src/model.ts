import { Schema, model } from "mongoose";

const personSchema = new Schema({
  name: String,
  age: Number,
  occupation: String,
});

export const Person = model("Person", personSchema);
