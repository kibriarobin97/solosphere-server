const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express()

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}))
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mahb0di.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    const jobsCollection = client.db('solosphereDB').collection('jobs')
    const bidsCollection = client.db('solosphereDB').collection('bids')


    app.post('/bid', async(req, res) => {
        const bidData = req.body;
        const result = await bidsCollection.insertOne(bidData)
        res.send(result)
    })

    app.post('/job', async(req, res) => {
      const jobData = req.body;
      const result = await jobsCollection.insertOne(jobData)
      res.send(result)
    })

    app.get('/jobs', async(req, res) => {
        const result = await jobsCollection.find().toArray()
        res.send(result)
    })

    app.get('/job/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await jobsCollection.findOne(query)
        res.send(result)
    })

    app.get('/jobs/:email', async(req, res) => {
      const email = req.params.email;
      const query = {'buyer.email': email}
      const result = await jobsCollection.find(query).toArray()
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




app.get('/', (req, res) => {
    res.send('solosphere is running')
})

app.listen(port, () => {
    console.log(`solosphere is running on post: ${port}`)
})