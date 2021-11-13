const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const ObjectId = require("mongodb").ObjectId;
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 5000;

// MiddleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w4gi1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("db connected");
    const database = client.db("carDealer");
    const productssCollection = database.collection("products");
    const orderCollection = database.collection("order");
    const reviewsCollection = database.collection("reviews");
    const usersCollection = database.collection("users");

    // GET Products API
    app.get("/products", async (req, res) => {
      const cursor = productssCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    // Get Reviews API
    app.get("/reviews", async (req, res) => {
      const cursor = reviewsCollection.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    // Post Review API
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.json(result);
    });

    // Order Post API
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.json(result);
    });

    // Special User
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    // Users Post API
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });

    // User Make Admin
    app.put("/users", async (req, res) => {
      const user = req.body;
      console.log("put", user);
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    // Get Order
    app.get("/orders", async (req, res) => {
      const email = req.query.customerEmail;
      const query = { email: email };
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      res.json(orders);
    });

    // Delete Specific Tour API
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const order = await orderCollection.deleteOne(query);
      res.json(order);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Car-Dealer-Server is running");
});

app.listen(port, () => {
  console.log("Server running at port", port);
});
