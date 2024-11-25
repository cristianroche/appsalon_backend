import mongoose from "mongoose";
import colors from "colors";

export const db = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    const url = `${db.connection.name} on ${db.connection.host}:${db.connection.port}`;
    console.info(colors.green("Connected to MongoDB: ", url));
  } catch (error) {
    console.error(colors.red("Error connecting to MongoDB: ", error.message));
    process.exit(1);
  }
};
