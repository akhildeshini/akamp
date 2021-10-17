const mongoose=require('mongoose');
const Review=require('./reviewmodel');
const User=require('./auth');
const campGroundSchema=new mongoose.Schema(
    {
        title:'String',
        price:'Number',
        description:'String',
        location:'String',
        image:'String',
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Review'
            }
        ],
        author:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }

    }
)
campGroundSchema.post('findOneAndDelete',async(doc)=>
{
    if(doc)
    {
        await Review.deleteMany(
        {
            _id:{
                $in:doc.reviews
            }
        })
    }
}) 
Campground=mongoose.model('Campground',campGroundSchema);

module.exports = mongoose.model('Campground', campGroundSchema);