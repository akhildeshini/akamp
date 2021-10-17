const express=require('express');
const app=express();
const router=express.Router();
router.get('/home',catchAsync(async(req,res)=>
{const findproducts=await campground.find();
    res.render('./campground/home',{findproducts});
    
}))
module.exports=router;