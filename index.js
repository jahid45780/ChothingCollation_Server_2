const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
 
// middleware
const corsOptions = {
  origin: ['https://clothing-swap-7ece5.web.app', 'https://clothing-swap-7ece5.firebaseapp.com'],
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions));
app.use(express.json());


const uri = "mongodb+srv://clothingSwap:8NPLt9PF17yZyMkk@cluster0.d6oiejw.mongodb.net/?retryWrites=true&w=majority"
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d6oiejw.mongodb.net/?retryWrites=true&w=majority`



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

    const serviceCollection = client.db('popularServices').collection('services');
    const allServiceCollection = client.db('popularServices').collection('allServices');
    const schedulesCollection = client.db('popularServices').collection('schedules');
    const productCollection = client.db('popularServices').collection('product')
    //  popular service
    app.get('/services', async (req, res)=>{
         const cursor = serviceCollection.find();
         const result = await cursor.toArray();
         res.send(result)
    })
// popular service detail
  app.get('/services/:id', async (req, res)=>{
     const id = req.params.id;
     const query = { _id: new ObjectId(id)}
      const options = { 
      // Include only the `title` and `img` fields in each returned document
       projection: {  price: 1, service_id: 1, service_Image: 1, service_name: 1, service_description: 1, provider_img: 1, provider_name: 1  },
         };

     const result = await serviceCollection.findOne(query, options)
     res.send(result)
  })

  // all service
  app.get('/allServices', async (req, res)=>{
    const cursor = allServiceCollection.find();
    const result = await cursor.toArray();
    res.send(result) 
  }) 

  // all service detail
  app.get('/allServices/:id', async (req, res)=>{
    const id = req.params.id;
    const query = { _id: new ObjectId(id)}
     const options = { 
     // Include only the `title` and `img` fields in each returned document
      projection: {  price: 1, service_id: 1, service_Image: 1, service_name: 1, service_description: 1, provider_img: 1, provider_name: 1, Service_Area: 1  },
        };

    const result = await allServiceCollection.findOne(query, options)
    res.send(result)
 })

//  schedules

app.get('/schedules', async (req, res)=>{
      console.log(req.query.email);
      let query = {}
      if(req.query?.email){
        query = {email: req.query.email}
      }
       const result = await schedulesCollection.find(query).toArray();
       res.send(result)
})


app.post('/schedules', async (req, res)=>{
    const schedules = req.body
    console.log(schedules);
    const result = await schedulesCollection.insertOne(schedules)
    res.send(result)
})

//  delete

app.delete('/schedules/:id', async (req, res)=>{
    const id = req.params.id
    const query = {_id: new ObjectId(id)}
    const result = await schedulesCollection.deleteOne(query)
    res.send(result)
})

//  put 

app.patch('/schedules/:id', async (req, res)=>{
    const updateSchedules = req.body
    const id = req.params.id
    const filter = {_id: new ObjectId(id)}
    console.log(updateSchedules);
    const updateDoc = {
      $set:{
        status: updateSchedules.status
      }
    }
    const result = await schedulesCollection.updateOne(filter, updateDoc)
    res.send(result)


})

// add service
app.post('/product', async(req,res)=>{
  const newProduct = req.body;
  console.log(newProduct)
  const result = await productCollection.insertOne(newProduct)
  res.send(result)
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


app.get('/', (req, res)=>{

    res.send('clothing swap is running',)
})

app.listen(port, ()=>{
    console.log(`clothing swap server is running on the port ${port}`);
})
