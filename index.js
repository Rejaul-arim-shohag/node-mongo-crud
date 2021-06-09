const express = require('express');
const bodyParser = require('body-parser');
const password = 'vVsa3GZaiyzbm4u2';
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const uri = "mongodb+srv://rejaulkarim:vVsa3GZaiyzbm4u2@cluster0.fmftb.mongodb.net/rejaulkarim?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
      app.use(bodyParser.urlencoded({ extended: false }));
      app.use(express.json())


app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html');
})


client.connect(err => {
  const productCollection = client.db("rejaulkarim").collection("product")

  app.get('/products', (req, res)=>{
    productCollection.find({}) 
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.get('/product/:id', (req, res) =>{
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents)=>{
      res.send(documents[0])
    })
  })


   app.post("/addPRoduct", (req, res) =>{
     const product = req.body;
     productCollection.insertOne(product) //then or callback way
     .then((result) =>{
      //  res.send("send success")
      res.redirect('/')
     })
   })


   app.patch("/update/:id", (req, res) =>{
    productCollection.updateOne({_id: ObjectId(req.params.id)},
      {
        $set:{price: req.body.price, quantity: req.body.quantity}
      })
      .then((result)=>{
        res.send(result.modifiedCount>0)
    })
   })

  
   app.delete("/delete/:id", (req, res) =>{
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then( result=>{
      // console.log(result)
      res.send(result.deletedCount>0);
    })
 })
});



app.listen(8000);