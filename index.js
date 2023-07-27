const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require("mongoose");
const cors=require('cors')
const axios = require('axios');
require("dotenv").config(); 
const jwt = require('jsonwebtoken');

//importing models
const User=require('./app/models/user')
const Post=require('./app/models/post')

const userAuth=require('./app/middlewares/userAuth')

const app = express();

app.use(bodyParser.json());
app.use(cors())

app.get('/', (req, res) => {
  console.log("inside social media app")
  res.send("Backend")
});

app.post('/register',async(req,res)=>{
  console.log(req.body)
  try{
     const {username,email,password}=req.body
  const newUser=new User({username,email,password})
  newUser.save()
  
  let tokenData = { userID: newUser._id }
    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
    res.json({ ok: true, token, userID: newUser._id});
  }
  catch(err){
    console.log(err)
  }
})

app.post('/login',async (req,res)=>{
  console.log(req.body)
  let filter={email:req.body.email}
  try{
        const user = await User.findOne(filter);
        if(!user){ 
            return res.status(400);
        }
    
        const tokenData = { userID: user._id };
      const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
          const tokeName ="userJwt";

    res.cookie(tokeName, token, { secure: true, httpOnly: true });
    res.status(200).json({ ok: true, token, userID: user._id });
  }
  catch(err){
    console.log(err)
  }
})

app.get('/getAllUsers',async(req,res)=>{
  try{
    const users=await User.find({})
    res.status(200).json(users)
  }
  catch(err){
    console.log(err)
  }
})

app.post("/createPost",async(req,res)=>{
  console.log(">>>>>post Data:",req.body)
  try{
    const {uploadedImage,imageDescription,location}=req.body
    const newPost=new Post({description:imageDescription,mediaUrl:uploadedImage,location})
    newPost.save()
    res.status(200).json({ok:true})
  }
  catch(err){
    console.log(err)
  }
})

app.get("/getAllPosts",async(req,res)=>{
  try{
    const posts=await Post.find({})
    res.status(200).json(posts)
  }
  catch(err){
    console.log(err)
  }
})

app.post("/getPostById",async(req,res)=>{
  try{
    console.log("inside get postby id")
    const {id}=req.body
    const post=await Post.findById(id)
    res.status(200).json(post)
  }
  catch(err){
    console.log(err)
  }
})

app.post("/updatePost/:id",async(req,res)=>{
    try{
        //add post like
        // const {userId,postId}=req.body
        const post=await Post.findById(req.params.id)
        post.likes.push(req.body.userId)
    }
    catch(err){
      console.log(err)
    }
})
// app.post("/user/generateToken", (req, res) => {
// 	let jwtSecretKey = process.env.JWT_SECRET_KEY;
// 	let data = {
// 		time: Date(),
// 		userId: 12,
// 	}
// 	const token = jwt.sign(data, jwtSecretKey);
// 	res.send(token);
// });
// app.get("/user/validateToken", (req, res) => {
// 	// Tokens are generally passed in the header of the request
// 	// Due to security reasons.
// 	let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
// 	let jwtSecretKey = process.env.JWT_SECRET_KEY;
// 	try {
// 		const token = req.header(tokenHeaderKey);
// 		const verified = jwt.verify(token, jwtSecretKey);
// 		if(verified){
// 			return res.send("Successfully Verified");
// 		}else{
// 			// Access Denied
// 			return res.status(401).send(error);
// 		}
// 	} catch (error) {
// 		// Access Denied
// 		return res.status(401).send(error);
// 	}
// });


app.listen(8000, () => {
  console.log('Listening on 8000');
});

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected successfully to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });