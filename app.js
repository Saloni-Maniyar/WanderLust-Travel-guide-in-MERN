const express=require('express');
const app=express();
const mongoose=require('mongoose');
const MONGO_URI='mongodb://127.0.0.1:27017/wanderlust';
const Listing=require('./models/listing');


main().then(console.log(`Connected to dataabase `)).catch((err)=>{
    console.log(`error connecting database: ${err}`);
})
async function main(){
    await mongoose.connect(MONGO_URI);
}
app.get('/',(req,res)=>{
 
    res.send("Working");
}
);

//test Listing model
app.get('/testListing',async (req,res)=>{
    let sampleListing=new Listing({
        title:"Nature",
        description:"test image",
        image:"",
        price:323,
        location:"valley",
        country:"india"
    });
    await sampleListing.save()
    res.send("Testing Successful");
    // .then(
    //         (result)=>
    //         {
    //             console.log(`result:${result}`);
    //             res.send(`Result:${result}`);
    //         }
    // ).catch((err)=>{
    //     console.log(`error:${err}`);
    //     res.send(err);
    // })
});
app.listen(8082,(req,res)=>{
    console.log(`server running on port 8082: http://localhost:8082`);
});