const List=require("../models/listing")
// import Radar from 'radar-sdk-js';
//const Radar = require('radar-sdk-js');

//import 'radar-sdk-js/dist/radar.css'
const User=require("../models/user")

module.exports.index=async(req,res)=>{
   let {categ}=req.query;
   let data; 
   console.log(categ)
   if(categ)
    {  data=await List.find({category:categ}) }
   else{
      data=await List.find({})
   }
   console.log(data)
    if(!data[0]){
        res.render("miss/miss.ejs")
    }else{
    res.render("listing/index.ejs",{data});
    }
}

module.exports.details=async(req,res,next)=>{
    let {id}=req.params;
    let data=await List.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate('owner')

    if(!data){
       req.flash("error",'The page you requested for does not exist')
       res.redirect("/listing")
    }
    res.render("listing/show.ejs",{data})
}

module.exports.create=(req,res)=>{
    res.render("listing/new.ejs")
}

module.exports.help=(req,res)=>{
    res.render("listing/newhelp.ejs")
}
module.exports.book=async(req,res,next)=>{
  const data = req.session.passport.user; 
//let data = User.find({username:name})
console.log(data)
let {id}=req.params;
 let data2=await List.findById(id)
 //let newData ={data, data2}
 res.render("listing/book.ejs",{data,data2})
}
module.exports.payment=(req,res)=>{
   let data=req.query;
   const st=new Date(data.from)
   const t=new Date(data.to)

   const diffTime=Math.abs(t-st)
   const diff=Math.ceil(diffTime/(1000*60*60*24))
   console.log(diff)
   const p=data.price*diff;
   
   console.log(p)
   
   
   res.render("listing/payment.ejs",{diff , p })
}
module.exports.search=async(req,res)=>{
    let {search}=req.query;
    let data=await List.find({title:{$regex :new RegExp(search,'i') }})
    res.render("listing/index.ejs",{data})
}

module.exports.add=async(req,res,next)=>{
    // let addr;
    //  try{
    //   addr=Radar.forwardGeocode({ query: '841 broadway, new york, ny' })
    //  }catch(er){
    //     console.log(er);
    //     res.send(er);
    //  }
    //   .then((result) => {
//     const { addresses } = result;
//     // do something with addresses
//   })
//   .catch((err) => {
//     // handle error
//   });
// console.log(addr)
    let url=req.file.path;
    let filename=req.file.filename;
    let list1=new List(req.body.listing)
    list1.owner=req.user._id;
    list1.image={url,filename}
    let response=await list1.save();
    // console.log(response)
    req.flash('success','New Card Added ..')
    res.redirect("/listing")
}

module.exports.edit=async (req,res)=>{
    let{id}=req.params;
    let listings=await List.findById(id);
    let originalUrl=listings.image.url
    originalUrl=originalUrl.replace("/upload","/upload/h_175,w_175/r_max")
    if(!listings){ 
        req.flash("error",'The page you are requested for does not exist')
        res.redirect('/listing')
    }
    res.render("listing/edit.ejs",{listings,originalUrl})
}

module.exports.update=async (req,res)=>{
    let{id}=req.params;
    
    const list=await List.findByIdAndUpdate(id,{...req.body.listing})
    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    list.image={
        url,filename
    }
    list.save()}
    req.flash("success",'Edited Succesfully')
    res.redirect(`/listing/${id}`)
}

module.exports.destroy=async (req,res)=>{
    let{id}=req.params;
    await List.findByIdAndDelete(id);
    req.flash("success",'Deleted Successfully')
    res.redirect("/listing")
}