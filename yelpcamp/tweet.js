const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect('mongodb://localhost:27017/relationshipDemo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

    const userschema=new mongoose.Schema(
        {
            name:String,
            age:Number
        }
    )
    const User=mongoose.model('User',userschema);
    const tweetschema=new mongoose.Schema(
        {
            text:String,
            likes:Number,
            user:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
        }
    )
    const Tweet=mongoose.model('Tweet',tweetschema);

//const addtweets=async()=>
//{
  //  const vasanthitweet=new Tweet({text:'i have anger issues',likes:40})
    //const user=await User.findOne({name:'vasanthi'})
    //vasanthitweet.user=user;
    //vasanthitweet.save();
    //console.log(vasanthitweet);
//}
//addtweets();
const pop=async()=>
{
    const tweet=await Tweet.find({}).populate('user','name');
    console.log(tweet);
}
pop();
