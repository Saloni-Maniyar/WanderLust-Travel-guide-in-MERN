const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const listingSchema=new Schema({
    title:{
        type:String,
        required:true

    },
    description:{
        type:String
    },
    image:{
        filename:{
            type:String
        },
         url:{
             type:String,
             set:(v)=>v===""?"https://plus.unsplash.com/premium_photo-1669377593804-2270c3436d69?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,
         }
    }
    ,
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
});
const Listing=new mongoose.model("Listing",listingSchema);
module.exports=Listing;