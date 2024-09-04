const mongoose=require('mongoose');
const initdata=require('./newData.js');
const Listing=require("../models/listing.js");

main()
.then(console.log("system connected"))
.catch(err=>console.log(err));
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wonder');
}

async function initDb(){
    await Listing.deleteMany();
    initdata.data=initdata.data.map((el)=>({...el,owner:'65cdd4066e0edb6459472ead'}))
    // initdata.data=initdata.data.map((el)=>({...el,category:'Castles'}))
    console.log(initdata.data)
    await Listing.insertMany(initdata.data);
}

initDb();