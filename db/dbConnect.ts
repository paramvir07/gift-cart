import mongoose from "mongoose";

function getMongoUri(): string {
  const uri = process.env.GC_MONGODB_URI;

  if (!uri) {
    throw new Error("GC_MONGODB_URI is missing");
  }

  return uri;
}

const GC_MONGODB_URI = getMongoUri();

declare global {
  // eslint-disable-next-line no-var
  var _gcMongooseConnection: typeof mongoose | undefined;
}

export async function dbConnect(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState >= 1) {
    return mongoose;
  }

  if (
    process.env.NODE_ENV === "development" &&
    global._gcMongooseConnection
  ) {
    return global._gcMongooseConnection;
  }

  const connection = await mongoose.connect(GC_MONGODB_URI);

  if (process.env.NODE_ENV === "development") {
    global._gcMongooseConnection = connection;
  }

  return connection;
}