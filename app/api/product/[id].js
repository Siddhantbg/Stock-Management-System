import { MongoClient, ObjectId } from 'mongodb';
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

export async function PUT(request, { params }) {
  const client = await connectToDatabase();

  try {
    const body = await request.json();
    const database = client.db('stock');
    const inventory = database.collection('inventory');

    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const updatedProduct = await inventory.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: body },
      { returnDocument: 'after' }
    );

    if (!updatedProduct.value) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updatedProduct.value });
  } catch (err) {
    console.error("An error occurred while updating the product in MongoDB:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const client = await connectToDatabase();

  try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');

    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const deletedProduct = await inventory.findOneAndDelete({ _id: new ObjectId(id) });

    if (!deletedProduct.value) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: deletedProduct.value });
  } catch (err) {
    console.error("An error occurred while deleting the product in MongoDB:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
