const initData=require("./data")
const Listing=require("../models/listing")

const mongoose=require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/hotelManagement"
main().then(()=>{
console.log("Connect Success ");
}).catch((err)=>{
console.log(err);
})
async function main() {
await mongoose.connect(MONGO_URL);
}

const initDb=async()=>{
await Listing.deleteMany({});
initData.data=initData.data.map((obj)=>({...obj,owner:'68c1f24b8d5749653d051281'}))
await Listing.insertMany(initData.data)
console.log("Success ");
}
initDb();