const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;


// MiddleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${ process.env.DB_USER }:${ process.env.DB_PASS }@cluster0.w4gi1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run()
{
    try
    {
        await client.connect();
        console.log('db connected');
        const database = client.db('carDealer');
        const productssCollection = database.collection('products');
        const orderCollection = database.collection('order');


        // GET Products API
        app.get('/products', async (req, res) =>
        {
            const cursor = productssCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })
    }

    finally
    {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) =>
{
    res.send('Car-Dealer-Server is running');
});

app.listen(port, () =>
{
    console.log('Server running at port', port);
})