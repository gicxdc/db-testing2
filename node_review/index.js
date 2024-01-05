const express = require("express");
const jwt = require('jsonwebtoken') 
const bcrypt = require('bcrypt')
const { connectToDb, db } = require("./db");
const Router=express.Router()

const app = express();

app.listen(3000, () => {
  console.log("App is running at 3000");
  connectToDb();
});

db.inventories.insertMany([
  { "_id" : 1, "sku" : "almonds", "description": "product 1", "instock" : 120 },
   { "_id" : 2, "sku" : "bread", "description": "product 2", "instock" : 80 },
   { "_id" : 3, "sku" : "cashews", "description": "product 3", "instock" : 60 },
   { "_id" : 4, "sku" : "pecans", "description": "product 4", "instock" : 70 },
])

db.orders.insertMany([
  { "_id" : 1, "item" : "almonds", "price" : 12, "quantity" : 2 },
  { "_id" : 2, "item" : "pecans", "price" : 20, "quantity" : 1 },
  { "_id" : 3, "item" : "pecans", "price" : 20, "quantity" : 3 },
])

db.users.insertMany([
  {"username": "admin", password: "MindX@2022"},
	{"username": "alice", password: "MindX@2022"}
])

async function login(username,password)
{
  const user = await db.inventories.findOne({username:{username}}).toArray()
  if(!user)
  {
    const token = jwt.sign({ username: username }, 'PRIVATE_KEY');
  }

  if(!bcrypt.compare(password,user.password))
  {
    return null
  }
  return user
}
app.post("/",async(req,res)=>{
  const inventories = await db.inventories.find({}).toArray()

  res.json(inventories)
})

app.get("/",async (req,res)=>{
  const {stock}=req.query

  const inventories = await db.inventories.find({instock:{$lte: stock}})

  res.json(inventories)
})

Router.post('/login', async (req, res) => {
	const {username, password} = req.body
	const user = await login(username, password);
	res.json(user)
})