const express=require("express");
const shortid=require("shortid");
const mongoose=require("mongoose");
const app=express();
app.use(express.json());
async function connectDB(){
    try{
     await mongoose.connect("mongodb://localhost:27017/myDB1");
     console.log("DB connected successfully ✅")
    }
    catch(error){
        console.log("error:",error);
        process.exit(1);
    }
    
}
connectDB();
const urlSchema=new mongoose.Schema({
    originalUrl:{
      type:String,
      required:true
    },
    shortId:{
        type:String,
        unique:true

    },
    clicks:{
        type:Number,
        default:0

    }
});
const Url=mongoose.model("Url",urlSchema);
app.post("/shorten",async(req,res)=>{
    try{
        const {originalUrl}=req.body;
        try{
            new URL(originalUrl);

        }
        catch(error){
            return res.status(400).json({error:"please enter valid URL"});

        }
        const shortId=shortid.generate();
        const url=new Url({originalUrl,shortId});
        // {
        //     originalUrl:originalUrl,
        //     shortId:shortId
        // }
        await url.save();
        res.json({
            shortUrl:`http://localhost:3000/${shortId}`
        })


    }
    catch(error){
        return res.status(500).json({error:"internal server error"});

    }
})
app.get("/:shortId",async(req,res)=>{
    const url=await Url.findOne({shortId:req.params.shortId});
    if(!Url){
        return res.status(404).json({error:"url does not exist"});
    }
    url.clicks++;
    await url.save();
    res.redirect(url.originalUrl);
})
app.listen(3000);


