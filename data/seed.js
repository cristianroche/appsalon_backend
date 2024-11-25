import dotenv from "dotenv";
import { db } from "../config/db.js";
import Service from "../models/Service.js";
import { services } from "./beautyServices.js";
import colors from "colors";

dotenv.config();

await db();

async function seedDB() {
  try {
    await Service.insertMany(services);
    console.log(colors.green.bold("Data imported successfully"));
    process.exit();
  } catch (error) {
    console.error(data.red.bold("Failed to import data"), error);
    process.exit(1);
  }
}

async function clearDB() {
  try {
    await Service.deleteMany();
    console.log(colors.green.bold("Data cleared successfully"));
    process.exit();
  } catch (error) {
    console.error(data.red.bold("Failed to clear data"), error);
    process.exit(1);
  }
}

if (process.argv[2] === "--import") {
  seedDB();
} else if (process.argv[2] === "--clear") {
  clearDB();
}
