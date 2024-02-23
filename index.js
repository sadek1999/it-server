const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5001;

app.use(cors({
    origin:['https://automotive-dfe92.web.app','http://localhost:5173/']
}))
app.use(express.json())

// automotive
// vOn5015Hu4mtEgJJ
// 
// https://miro.medium.com/v2/resize:fit:720/format:webp/0*55K3702CaKaC9A8K.png


const uri = "mongodb+srv://automotive:vOn5015Hu4mtEgJJ@cluster0.xtmekud.mongodb.net/?retryWrites=true&w=majority";



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
        const usersCulloction = client.db("userDB").collection("users");
        const productsColloctions = client.db("productsDB").collection("products")
        const ordersColloctions = client.db("productsDB").collection("orders")
        // const usersColloctions = client.db("productsDB").collection("users")

// api for user --------------------------------------------------------------------
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCulloction.insertOne(user);
            res.send(result)
        })
        app.get('/users', async (req, res) => {
            const result = await usersCulloction.find().toArray();
            res.send(result);
        })
        

        app.get('/users/:email',async(req,res)=>{
        
            const userEmail=req.params.email;
            // console.log(userEmail)
            const query={email: userEmail};
            const result= await usersCulloction.findOne(query);
            res.send(result);
        })
      
        app.put("/users/:email",async(req,res)=>{
            const id=req.params.email;
            const query={email: id};
            const option={upsert:true};
            const updateUser=req.body
            // console.log(updateUser)
            const User={
                $set: {
                    
                    products: updateUser.products
                   
                }
            }
           
            const result=await usersCulloction.updateOne(query,User,option)
            res.send(result)
        })

        // Api for products --------------------------------------------------------

        app.post('/products', async (req, res) => {
            const user = req.body;
            const result = await productsColloctions.insertOne(user);
            res.send(result)
        })
        app.get("/products", async (req, res) => {
            const result = await productsColloctions.find().toArray();
            res.send(result);
        })
        app.get('/products/:brand', async (req, res) => {
            const brandName = req.params.brand;
            const query = { brand:brandName}
            const result = await productsColloctions.find(query).toArray();
            res.send(result);
        })

        app.get("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productsColloctions.findOne(query)
            res.send(result);
        })

        app.put("/products/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const updateproduct = req.body
            const product = {
                $set: {
                    name: updateproduct.name,
                    brand: updateproduct.brand,
                    type: updateproduct.type,
                    img: updateproduct.img,
                    about: updateproduct.about,
                    price: updateproduct.price,
                    rating: updateproduct.rating,

                }

            }
            const result = await productsColloctions.updateOne(query, product, option)
            res.send(result);
        })

        app.delete("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productsColloctions.deleteOne(query);
            res.send(result);
        })

        // Api for orders --------------- --------------------------
        app.post('/order',async(req,res)=>{
            const order=req.body;
            const result=await ordersColloctions.insertOne(order)
            res.send(result)
        })
         
        app.get('/order',async(req,res)=>{
            let query={};
            if(req.query?.email){
                query={email:req.query.email}
            }
            // console.log(query)
            const result=await ordersColloctions.find(query).toArray()
            res.send(result)
        })
        app.delete('/order/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:new ObjectId(id)}
            const result=await ordersColloctions.deleteOne(query)
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
    res.send('aotomovite is runing')
})

app.listen(port, () => {
    console.log(`the site is runing in port ${port}`)
})
