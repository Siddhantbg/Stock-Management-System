import { MongoClient } from "mongodb";
import { NextResponse } from 'next/server';

const uri = "mongodb://sahilthegreat760:wRjXt7sEIFtpSVYj@ac-sdo1nfn-shard-00-00.l3vntdx.mongodb.net:27017,ac-sdo1nfn-shard-00-01.l3vntdx.mongodb.net:27017,ac-sdo1nfn-shard-00-02.l3vntdx.mongodb.net:27017/?ssl=true&replicaSet=atlas-11cq0d-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

export async function GET() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('sample_mflix');
    const movies = database.collection('movies');

    // Query for a movie that has the title 'Back to the Future'
    const query = { title: 'Back to the Future' };
    const movie = await movies.findOne(query);

    console.log(movie);
    return NextResponse.json(movie);
  } catch (err) {
    console.error("An error occurred while connecting to MongoDB:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.close();
  }
}
