const ccampground=require('./models/campmodel');
module.exports.isLoggedIn=(req,res,next)=>
{
    if(!req.isAuthenticated())
    {
        req.session.returnTo=req.originalUrl;
        req.flash('error','you must be logged in');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/details/${id}`);
    }
    next();
}