const express=require("express")
const app=express();
//env
if(process.env.NODE_ENV !="production"){
require('dotenv').config()
}



const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
//Method-Override===================
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
//Ejs Mate==========================
const engine = require('ejs-mate');
app.engine('ejs', engine);

const path=require("path");
// Connect Mongoose Start=========================
const mongoose=require("mongoose");
const dbUrl=process.env.HOTEL_DB_URL;

main().then(()=>{
console.log("Connect Success ");
}).catch((err)=>{
console.log(err);
})
async function main() {
await mongoose.connect(dbUrl);
}
// Connect Mongoose End=========================

//Authentication===================================
const passport=require("passport")
const LocalStrategy=require("passport-local")
const User=require("./models/user.js")

//Setup Ejs and Public Folder======================
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")))

//Express Router Require=====================
const listingRouter=require("./routes/listing.js")
const reviewRouter=require("./routes/review.js")
const userRouter=require("./routes/user.js")
//Mongo Store
const store=MongoStore.create({
mongoUrl:dbUrl,
crypto:{
secret:process.env.SECRET,
},
touchAfter:24*3600,
})

store.on("error",()=>{
console.log("Error occer",err)
})

//Use Session=============
const sessionOption={
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
 cookie:{
expires:Date.now()+7*24*60*60*1000,
maxAge:7*24*60*60*1000,
httpOnly:true,
 }
}



app.use(session(sessionOption))
app.use(flash());
//Use Passport Local
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//Flash Message And Store Local
app.use((req,res,next)=>{
res.locals.successMsg=req.flash("success")
res.locals.errorMsg=req.flash("error")
res.locals.currUser=req.user;

next();
})


//All Express Routers==========
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


//Rrong Api Request Handel=================
app.all(/.*/,(req,res,next)=>{
next(new ExpressError(404,"Page not found"))
})


//Error Handel=================
app.use((err,req,res,next)=>{
let{status=500,message="Something Was Wrong !"}=err;
res.status(status).render("error.ejs",{message})
})


app.listen(8080,()=>{
console.log("I am response ")
})