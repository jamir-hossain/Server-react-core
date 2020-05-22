const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json())



const uri = process.env.DB_PATH;

app.get('/product', (req, res) => {
  let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
  console.log("Product called")
  client.connect( err => {
    const collection = client.db("emaJohn").collection("productData");
    collection.find().toArray((error, document)=>{
          if(error){
            console.log(error);
            res.status(500).send({massage:error});
          }
          else{
            res.send(document);
          };
        });
      //  client.close();
  });

});

app.get('/allProduct', (req, res) => {
  let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
  console.log("Product called")
  client.connect( err => {
    const collection = client.db("onlineStore").collection("product");
    collection.find().toArray((error, document)=>{
          if(error){
            console.log(error);
            res.status(500).send({massage:error});
          }
          else{
            res.send(document);
          };
        });
      //  client.close();
  });

});


// (৩) একানে আমরা প্রোডাক্ট এর key এর সাহায্যে কোনো একটা নির্দিষ্ট প্রোডাক্ট কে নেওয়ার জন্য আমরা url এ Dynamic Parameter {/product/:key} ব্যবহার করেছি । 
app.get('/product/:key', (req, res) => {
  const key = req.params.key;

  let client = new MongoClient(uri, { useNewUrlParser: true});
  client.connect( err => {
    const collection = client.db("onlineStore").collection("product");
    collection.find({key}).toArray((error, document)=>{
          if(error){
            console.log(error);
            res.status(500).send({massage:error});
          }
          else{
            res.send(document[0]);
          };
        });
       client.close();
  });

});


app.post('/reviewProducts', (req, res) => {
  const key = req.params.key;
  const reviewProducts = req.body;
  console.log(reviewProducts);

  let client = new MongoClient(uri, { useNewUrlParser: true});
  client.connect( err => {
    const collection = client.db("onlineStore").collection("product");
    collection.find({key:{ $in: reviewProducts}}).toArray((error, document)=>{
          if(error){
            console.log(error);
            res.status(500).send({massage:error});
          }
          else{
            res.send(document);
          };
        });
       client.close();
  });

});


app.post('/productData/', (req, res) => {
    const product = req.body;
    let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });

    client.connect( err => {
      const collection = client.db("emaJohn").collection("productData");
      collection.insertOne(product, (error, result)=>{

            if(error){
              res.status(500).send({massage:error});
            }
            else{
              res.send(result.ops[0]);
            };
          });
      // client.close();
    }); 
});

app.post('/orderedData', (req, res) => {
  const product = req.body;
  let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });

  client.connect( err => {
    const collection = client.db("onlineStore").collection("orderProductData");
    collection.insertOne(product, (error, result)=>{

          if(error){
            res.status(500).send({massage:error});
          }
          else{
            res.send(result.ops[0]);
          };
        });
    // client.close();
  }); 
});



const port  = process.env.PORT || 4000;
app.listen(port, () => console.log("Listening to port ", port));

