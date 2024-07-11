import { MongoClient } from "mongodb";
import { NextResponse } from 'next/server';

const uri = "mongodb://sahilthegreat760:wRjXt7sEIFtpSVYj@ac-sdo1nfn-shard-00-00.l3vntdx.mongodb.net:27017,ac-sdo1nfn-shard-00-01.l3vntdx.mongodb.net:27017,ac-sdo1nfn-shard-00-02.l3vntdx.mongodb.net:27017/?ssl=true&replicaSet=atlas-11cq0d-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  await client.connect();
  cachedClient = client;
  return client;
}

export async function GET(request) {
  const client = await connectToDatabase();

  try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');

    // Get the searchText from query parameters
    const { searchParams } = new URL(request.url);
    const searchText = searchParams.get('searchText');

    // If searchText is provided, use it to filter the products
    let query = {};
    if (searchText) {
      query = { stockName: { $regex: searchText, $options: 'i' } };
    }

    const products = await inventory.find(query).toArray();

    return NextResponse.json({ success: true, products });
  } catch (err) {
    console.error("An error occurred while fetching products from MongoDB:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  const client = await connectToDatabase();
  
  try {
    const body = await request.json();
    const database = client.db('stock');
    const inventory = database.collection('inventory');

    const result = await inventory.insertOne(body);

    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error("An error occurred while adding a product to MongoDB:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
