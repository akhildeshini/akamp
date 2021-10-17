const joischema=require('joi');
const campgroundSchema=joischema.object(
    {
       title:joischema.string().required(),
       price:joischema.string().required(),
       description:joischema.string().required(),
       location:joischema.string().required(),
       image:joischema.string().required()
    }
);
module.exports=campgroundSchema;