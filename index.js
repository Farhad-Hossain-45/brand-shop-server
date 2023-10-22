const express = require('express');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json())


// custom json

const brands=
 [
  {
    "id": 1,
    "brand_image": "https://i.ibb.co/QNMnGzC/sony-brand.jpg",
    "brand_name": "Sony"
  },
  
  {
    "id": 2,
    "brand_image": "https://i.ibb.co/FYN6Hkt/apple-brnad.png",
    "brand_name": "Apple"
  },
  {
    "id": 3,
    "brand_image": "https://i.ibb.co/9t93Rj0/onepluse-brand.png",
    "brand_name": "Onepluse"
  },
  {
    "id": 4,
    "brand_image": "https://i.ibb.co/D16bq7k/google-pixel.png",
    "brand_name": "Google Pixel"
  },
  {
    "id": 5,
    "brand_image": "https://i.ibb.co/rpvRrhg/oppo-barand.png",
    "brand_name": "Oppo"
  },
  {
    "id": 6,
    "brand_image": "https://i.ibb.co/mt0RP9S/samsung-brand.png",
    "brand_name": "Samsung"
  }
]
app.get('/brands' , async(req,res) => {
  res.send(brands);
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.exa7jan.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const BrandCollection = client.db("BrandDB").collection('Brand');
    const CartCollection = client.db("BrandDB").collection('cart');
     app.get('/product', async(req,res)=>{
      const cursor = BrandCollection.find()
      const result = await cursor.toArray()
      res.send(result) 
    })
    app.get('/cart', async(req,res)=>{
      const cursor = CartCollection.find()
      const result = await cursor.toArray()
      res.send(result) 
    })
    
    app.get('/product/:id', async(req,res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await BrandCollection.findOne(query)
      res.send(result)
    })
    app.post('/cart', async(req,res)=> {
      const newCartItem = req.body;
      const result = await CartCollection.insertOne(newCartItem)
      res.send(result)
      console.log(result)
    })

    app.post('/brand', async(req,res)=>{
      const newBrand= req.body;
      console.log(newBrand);
      const result = await BrandCollection.insertOne(newBrand);
      res.send(result)
    })
    app.delete('/cart/:id', async(req,res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await CartCollection.deleteOne(query)
      res.send(result)
      console.log(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('my server is running')
})

app.listen(port,()=>{
    console.log(`my server is running on port:${port}`)
})