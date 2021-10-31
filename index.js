const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
//Middleware
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gu8vt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        // console.log('connected to database');
        const database = client.db('tourismDb');
        const offerCollection = database.collection('offers')
        const orderCollection = database.collection('orders');
        
        // POST Api for Offers
        app.post('/offers', async(req, res)=>{
           console.log(req.body)
            const newOffer = req.body;
            const result = await offerCollection.insertOne(newOffer)
            console.log("got new Offer", newOffer) 
            console.log("added offer", result); 
            res.json(result); 
        });
        //GET API
        app.get('/offers', async(req, res)=>{
            const cursor = offerCollection.find({})
            const offers = await cursor.toArray();
            res.send(offers)
        });
        //Get Single Offer
        
        app.get('/offers/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const offer = await offerCollection.findOne(query)
            console.log("load offer with id:", id)
            res.send(offer);
        });

        

            // POST Api for Oders
        app.post('/orders', async(req, res)=>{
           console.log(req.body)
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder)
            console.log("got new order", newOrder) 
            console.log("added order", result); 
            res.json(result); 
        });
        //Get Order Api
        app.get('/orders', async(req, res)=>{
            const cursor = orderCollection.find({})
            const orders = await cursor.toArray();
            res.send(orders)
        });
        //DELETE Order API
    app.delete('/orders/:id', async(req, res) =>{
      const id = req.params.id;
      const query = { _id:ObjectId(id) };
      const result = await orderCollection.deleteOne(query)
    //   console.log("deleting order id", result);
      res.json(result)
    });

    // Update Order
    app.put('/orders/:id', async(req, res)=>{
      const id = req.params.id;
      const updatedOrder = req.body;
      const filter = {_id:ObjectId(id)};
      const options = {upsert: true};
      const updateDoc = {
        $set: {
          name: updatedOrder.name,
          email: updatedOrder.email,
        },
      };
      const result = await orderCollection.updateOne(filter, updateDoc, options)
      console.log("updating Order", req)
      res.send(result)
      });
    }
finally{
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res)=>{
    res.send('Running react tourism app server');
});
app.listen (port, ()=>{
    console.log("Running server on port", port)
})