const express=require('express');
const multer=require('multer');
const methodOverride=require('method-override');
const app=express();
const mongoose=require('mongoose');
const MONGO_URI='mongodb://127.0.0.1:27017/wanderlust';
const Listing=require('./models/listing');
const path=require('path');
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(methodOverride('_method'));

//multer configuration
const storage=multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext); // unique name
    }
});
const upload = multer({ storage: storage });
//create new listing
app.post('/listings/new_list',upload.single('imageFile'),async(req,res)=>{
 const { title, description, imageLink, price, location, country } = req.body;
 let imageUrl='';
 let fileName='';
 if(req.file){
    imageUrl=`/uploads/${req.file.filename}`;
    console.log(req.file.filename);
    console.log(imageUrl);
    filename=req.file.filename;
    console.log(filename);
   
 }else if(imageLink){
    imageUrl=imageLink;
 }
  const newListing=new Listing({
          title,
        description,
        image: {
            url: imageUrl,
            filename:filename
        },
        price,
        location,
        country
    });
    await newListing.save();
    res.render('listings/show.ejs',{listing:newListing});
});

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

//all list display index.js
app.get('/listings',async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

app.get('/listing/new',async(req,res)=>{
    res.render("listings/new.ejs");
});
//edit the listing
app.put('/listings/:id/edit', upload.single("imageFile"),async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    const { title, description, imageLink, price, location, country } = req.body;
    let updatedImageUrl = listing.image.url;
    let updatedFilename = listing.image.filename;
  
    if(req.file) {
        //user uploaded a new file
        updatedImageUrl = `/uploads/${req.file.filename}`;
        updatedFilename = req.file.filename;
    }else if (imageLink && imageLink !== listing.image.url) {
        // user gave a new image URL
        updatedImageUrl = imageLink;
        updatedFilename = ''; // no filename since it’s an online URL
    }
    
    await Listing.findByIdAndUpdate(id,{
        title,
        description,
        image: {
             url: updatedImageUrl,
             filename: updatedFilename,
        },
        price,
        location,
        country,
    });
    // Get updated version to display
    const updatedListing = await Listing.findById(id);
    res.render('listings/show.ejs', { listing: updatedListing });
 
 
});

//show edit form
app.get('/listings/:id/edit',async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

//delete listing
app.delete('/listing/:id/delete',async(req,res)=>{
        let {id}=req.params;
       await Listing.findByIdAndDelete(id);
        res.redirect("/listings");
});
//show specific listing
app.get('/listings/:id',async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    console.log(listing);
    res.render("listings/show.ejs",{listing});
});



//test Listing model
// app.get('/testListing',async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"Nature",
//         description:"test image",
//         image:"",
//         price:323,
//         location:"valley",
//         country:"india"
//     });
//     await sampleListing.save()
//     res.send("Testing Successful");
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
// });
app.listen(8082,(req,res)=>{
    console.log(`server running on port 8082: http://localhost:8082`);
});