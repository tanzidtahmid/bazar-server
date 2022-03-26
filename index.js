const express = require('express')
const fileUpload = require('express-fileupload');
const fs = require('fs-extra');
const bodyParser = require('body-parser');
const cors = require('cors');
// const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('services'))
app.use(fileUpload())




app.get('/', (req, res) => {
  res.send('Hello World!')
})








const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('bson');
const uri = "mongodb+srv://mytodolist:0121881738@cluster0.nvcgk.mongodb.net/bazar?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const allPdCollection = client.db("bazar").collection("allProducts");
  const orderedProduct = client.db("bazar").collection("orderedProduct");
  const admins = client.db("bazar").collection("admins");

  app.post('/addProducts', (req, res) => {
    const ProductInfo = req.body;
    const productFile = req.files.file;
    const title = ProductInfo.title;
    const price = ProductInfo.price;
    const description = ProductInfo.description;
    const catagoary = ProductInfo.catagoary;

    console.log(title);
    console.log(price);
    console.log(description);
    console.log(catagoary);
    console.log(productFile);
    const newFile = productFile.data;
    const enImg = newFile.toString('base64');

    var image = {
      contentType: req.files.file.mimetype,
      size: req.files.file.size,
      img: Buffer.from(enImg, 'base64')

    }
    console.log(image)
    allPdCollection.insertOne({ title, price, description, catagoary, image })
      .then(result => {
        res.send(result.insertedCount > 0)
      })

  })

  app.post('/orderedProduct', (req, res) => {
    const productInfo = req.body;
    console.log(productInfo)
    orderedProduct.insertOne({productInfo})
      .then(result => {
        res.send(result.insertedCount > 0)
      })

  })

  app.get('/orderList', (req, res) => {
    orderedProduct.find({})
      .toArray((err, document) => {
        res.send(document)
      })
  })
  app.get('/allProducts', (req, res) => {
    allPdCollection.find({})
      .toArray((err, document) => {
        res.send(document)
      })
  })
  app.get('/singleOrder/:id', (req, res) => {
    orderedProduct.find({ _id: ObjectID(req.params.id) })
      .toArray((err, document) => {
        res.send(document)
      })
  })

  app.get('/fashionForMen', (req, res) => {
    allPdCollection.find({ catagoary: "Fashion for Men" })
      .toArray((err, document) => {
        res.send(document)
      })
  })
  app.get('/homeAppliance', (req, res) => {
    allPdCollection.find({ catagoary: "Home Appliance" })
      .toArray((err, document) => {
        res.send(document)
      })
  })

  app.get('/search/:name', (req, res) => {
    allPdCollection.find({ title: (req.params.name) })
      .toArray((err, document) => {
        res.send(document)
      })
  })

  app.get('/singleManPd/:id', (req, res) => {
    allPdCollection.find({ _id: ObjectID(req.params.id) })
      .toArray((err, document) => {
        res.send(document)
      })
  })
  app.get('/homeAppliance/:id', (req, res) => {
    allPdCollection.find({ _id: ObjectID(req.params.id) })
      .toArray((err, document) => {
        res.send(document)
      })
  })

  app.get('/dashboard', (req, res) => {
    orderedProduct.find({})
      .toArray((err, document) => {
        res.send(document)
      })
  })

  // Product Delete
  app.delete('/deleteProduct/:id', function (req, res) {
    allPdCollection.deleteOne({_id: ObjectID(req.params.id)})
    .then((result)=>{
      console.log(result)
    })
  })

  // Add Admins
  app.post('/addAdmin',(req,res)=>{
    console.log(req.body)
    admins.insertOne(req.body)
    .then(function(result) {
      res.send(result.insertedCount > 0)
    })
  })

  // Get Admin
  app.get('/getAdmins',(req,res)=>{
    admins.find({})
    .toArray((err,document)=>{
      res.send(document)
    })
  });

  //Update Statuse
  app.patch('/updateStatuse/:id',  (req, res) => {
    console.log(req.body)

    orderedProduct.updateOne({ _id: ObjectId(req.params.productId) },
    {
      $set: { status : req.body.status,}
    })
    .then(result => {
      res.send(result.modifiedCount > 0)
      console.log(result)
    }
    )
  });


});








app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})














































