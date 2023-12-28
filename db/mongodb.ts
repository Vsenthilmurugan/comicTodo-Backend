import { MongoClient, ServerApiVersion } from 'mongodb';

const uri: string = "mongodb+srv://vsenthilmurugan:W0b8idwuQJVb1k9R@cluster0.18h8clv.mongodb.net/comic_todo?retryWrites=true&w=majority";

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
