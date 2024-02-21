require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const Blog = require("./models/blog");

const mongoose = require("mongoose");
const app=express();
//const port = process.env.PORT||8000;
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const checkForAuthenticationCookie = require("./middlewares/authentication");

const mongoURI = process.env.Mongo_URL;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        // Start your server here
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server Started at PORT:${process.env.PORT || 8000}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));
app.get("/",async(req,res)=>{
    const allBlogs= await Blog.find({});
    res.render("home",{
        user:req.user,
        blogs:allBlogs,
    });
})
app.use("/user",userRoute);
app.use("/blog",blogRoute);

//app.listen(port,()=>console.log(`Server Started at PORT:${port}`));