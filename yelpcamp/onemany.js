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


const productSchema = new Schema({
    name: String,
    price: Number,
    season: {
        type: String,
        enum: ['Spring', 'Summer', 'Fall', 'Winter']
    }
});
const Product = mongoose.model('Product', productSchema);
const farm=new Schema({
    city:'String',
    state:'String',
    products:[{type:mongoose.Schema.Types.ObjectId,ref:'Product'}]
})
const Farm=mongoose.model('Farm',farm);

const makefarm=async()=>
{
    const finddata=await Product.findOne({name:'apple'});
    const newfarm=new Farm({city:'karimnagar',state:'telangana'});
    newfarm.products.push(finddata);
    await newfarm.save()
    
}
const addProduct = async () => {
    const farm = await Farm.findOne({ city :'karimnagar' });
    const watermelon = await Product.findOne({ name: 'water melon' });
    farm.products.push(watermelon);
    await farm.save();
    console.log(farm);
}

Farm.findOne({ name: 'apple' })
    .populate('products')
    .then(farm => console.log(farm))