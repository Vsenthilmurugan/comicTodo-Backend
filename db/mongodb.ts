import { MongoClient, ServerApiVersion } from 'mongodb';

const uri: string = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.18h8clv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client: MongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToDatabase(): Promise<void> {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

async function closeDatabaseConnection(): Promise<void> {
  try {
    await client.close();
    console.log("Closed MongoDB connection.");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
}

export { client, connectToDatabase, closeDatabaseConnection };
