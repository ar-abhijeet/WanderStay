const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { findByIdAndDelete } = require("../mongo_express/models/chat.js");
const ejsMate = require("ejs-mate");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate)
app.use(express.static(path.join(__dirname,"/public")));


main()
.then(()=>{
  console.log("Database Connected!");
})
.catch((err) => console.log(err));

app.get("/",(req,res)=>{
  res.send("Connection is working");
})

//Index Route
app.get("/listings",async(req,res)=>{
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs",{allListings});
})

//Create Route
app.get("/listings/new",(req,res)=>{
  res.render("./listings/new.ejs")
})

// Update Route
app.get("/listings/:id/edit",async(req,res)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  res.render("./listings/edit.ejs",{ listing });
})

//Update Route
app.put("/listings/:id",async(req,res)=>{
  let {id} = req.params;
  let updatedListing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
  updatedListing.save();
  console.log("Listing is updated!");
  res.redirect(`/listings/${id}`);
})

//Delete Route
app.delete("/listings/:id",async(req,res)=>{
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  console.log("Listing is deleted!");
  res.redirect("/listings");
})


app.post("/listings",async(req,res)=>{
  let listing = req.body.listing;
  const newListing = new Listing(listing);
  await newListing.save()
  .then(()=>{
    console.log("new listing is saved!");
  })
  .catch((err)=>{
    console.log("Error detected", err);
  })
  res.redirect("/listings");
  })

//Next route
app.get("/listings/:id",async(req,res)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  res.render("./listings/show.ejs",{listing});
})

app.listen(3000,()=>{
  console.log("Port is listening at 3000!");
})

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}