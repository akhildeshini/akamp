const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/onemany', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })
const oneFew=new mongoose.Schema(
    {
        first:'String',
        last:'String',
        address:[
            {
                city:'String',
                state:'String'
            }
        ]

    }
    
)
const Knr=mongoose.model('Knr',oneFew);
const newuser=async()=>
{
const warangal=new Knr({
    first:'akhil',last:'sis'
})
warangal.address.push({city:'karimnagar',state:'telangana'});
await warangal.save()
.then(data=>
    {
        console.log("sucessful");
        console.log(data);
    })
    .catch(err=>
    {
        console .log('error')
        console.log(err);
    })
}
