const express=require('express');
const app=express();
const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
const joicampschema=require('joi');
const wraperror=require('./errors/wrapAsync');
const ejsMate=require('ejs-mate');
const campground=require('./models/campmodel')
const methodOverride = require('method-override');
const path = require('path');
const { find } = require('./models/campmodel');
app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
//const {campschema}=require('./joischema');
const Review=require('./models/reviewmodel')
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
const {campschema,reviewSchema}=require('./schemas')
const db = mongoose.connection;
//const router=require('./router/campground');
const session=require('express-session');
const flash=require('connect-flash')
const Auth=require('./models/auth');
const passport=require('passport');
const passportLocal=require('passport-local');
const {isLoggedIn,isAuthor} = require('./middleware');

function catchAsync(fn)
{
    return function(req,res,next)
    {
        fn(req,res,next).catch(e=>next(e));
    }
}
const option={
    secret:'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(option));
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(Auth.authenticate()));

passport.serializeUser(Auth.serializeUser());
passport.deserializeUser(Auth.deserializeUser());
app.use(flash())
app.use((req,res,next)=>
{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})
//camp routes home page
app.get('/home',catchAsync(async(req,res)=>
{const findproducts=await campground.find();
  //  console.log("user is" ,req.user,"odd yet works");
    res.render('./campground/home',{findproducts});
   
    
}))
//details page
app.get('/details/:id',isLoggedIn, catchAsync(async(req,res)=>
{
    const {id}=req.params;
const findproducts=await campground.findById(id).populate('reviews').populate('author');
//console.log(findproducts)
if(!findproducts)
{
    req.flash('error','oh boy not interested and not present');
    return res.redirect('/home');
}
//console.log("place is",findproducts.reviews.textarea)
res.render('./campground/details',{findproducts})
    
}))
// get route for a new campground
app.get('/newcampground',isLoggedIn,(req,res)=>
{
res.render('./campground/newcampground')
})
// creating a new campground
app.post('/newcamp',catchAsync(async(req,res,next)=>
{

    const akamp=joicampschema.object(
        {
           title:joicampschema.string().required(),
           price:joicampschema.number().required().min(0),
           description:joicampschema.string().required(),
           location:joicampschema.string().required(),
           image:joicampschema.string().required()
        }
    );
    const {error}=akamp.validate(req.body);
    if(error)
    {
        const msg=error.details.map(a=>a.message).join(',' );
        throw new wraperror(msg,400);
    }
  const {id}=req.params;
const Campground =new campground(req.body);
Campground.author=req.user._id;
await Campground.save();
req.flash('success','succesfull created a campground');
res.redirect(`/details/${Campground._id}`)
}))
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new wraperror(msg, 400)
    } else {
        next();
    }
}
//get request for updating a campground
app.get('/updatecamp/:id',isLoggedIn,isAuthor, catchAsync(async(req,res)=>
{
    const {id}=req.params;
    const findproducts=await campground.findById(id);
    res.render('./campground/updatecamp',{findproducts})


}))
//patch request for updating a campground
app.patch('/updatecamp/:id',isLoggedIn,isAuthor,catchAsync(async(req,res)=>
{
    const {id}=req.params;
    const Campground=await campground.findByIdAndUpdate(id,{... req.body})
    res.redirect('/home');
}))
// get request for deleting a campground
app.get('/deletecamp/:id',isLoggedIn,isAuthor,catchAsync(async(req,res)=>
{
    const {id}=req.params;
    const findproducts=await campground.findById(id);
    res.render('./campground/deletecamp',{findproducts});
}))
//deleting a campground
app.delete('/deletecampground/:id',isLoggedIn,isAuthor,catchAsync(async(req,res)=>
{
    const {id}=req.params;
    const findproducts=await campground.findByIdAndDelete(id);
    res.redirect('/home')
}))
//test path
app.get('/sing',(req,res)=>
{
chicen.fly();
})
//test path
app.get('/admin',(req,res)=>
{
    throw new wraperror("u are not admin",403);
})

app.post('/addreviews', async(req,res)=>
{
    const {text}=req.body;
    console.log(text);
    const check=mongoose.Types.ObjectId.isValid(text);
    console.log(check);
    const findproduct=await campground.findById(text);
    res.render('./campground/review',{findproduct})


})
//creating reviews
app.post('/addreviews/:id',validateReview, async(req,res)=>
{
    //const {range,textarea}=req.body;
    const {id}=req.params;
    const {range,textarea}=req.body;
    const findproducts=await campground.findById(id).populate('reviews');
    //console.log("here is the review",findproducts)
    const review=await new Review(req.body.review);
    findproducts.reviews.push(review);
    console.log("username is",req.user.username);
    review.author=await req.user.username;
    await review.save();
    await findproducts.save();
    console.log(findproducts)
    res.redirect(`/details/${id}`)
})
//deleting reviews
app.delete('/deletereview/:id/review/:reviewId',async(req,res)=>
{
    const { id, reviewId } = req.params;
    await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/details/${id}`);

})
//page for registering user
app.get('/registerform',(req,res)=>
{
    res.render('./Authenticate/registerform')
})
//creating a registered user
app.post('/registerform',catchAsync( async(req,res)=>
{
    try{
    const { email, username, password } = req.body;
        const user = new Auth({ email, username });
        const registeredUser = await Auth.register(user, password);
        console.log(registeredUser)
        req.flash('success','welcome to akamp');
            res.redirect('/home');
    }
    catch(e)
    {
        req.flash('error','something went wrong');
       res.redirect('/registerform')
    }
}))
//get request for a login page
app.get('/login',(req,res)=>
{
    res.render('./Authenticate/login')
})
//logging a user in
app.post('/loginform',passport.authenticate('local',{ failureFlash: true, failureRedirect: '/login' }) ,(req,res)=>
{
    const redirectUrl=req.session.returnTo||'/home';
    delete req.session.returnTo;
req.flash('success',"welcome back buddy");
res.redirect('/home');
})
//logout
app.get('/logout',(req,res)=>
{
    req.logout();
    req.flash('success','Amigos');
    res.redirect('/home');
})
app.all('*',(req,res)=>
{
throw new wraperror('page not found',404);
})
app.use((err,req,res,next)=>
{
    const {status=500}=err;
if(!err.message)
{
    err.message="something wrong check again";
}
    res.status(status).render('./partials/error',{err})
})


app.listen('8080',()=>
{
console.log('waiting for request');
})
