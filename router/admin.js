/**
 * Created by Administrator on 2017/10/24.
 */
var express=require('express'),
    router=express.Router(),
    login=require('./admin/login.js'),
    mongoDB=require('../db/db.js'),
    session=require('express-session'),
    fs=require('fs'),
    userSuper=require('./admin/userSuper.js'),
    sendBlog=require('./admin/sendBlog.js'),
    blogKind=require('./admin/blogKind.js'),
    imgKind=require('./admin/imgKind.js'),
    img=require('./admin/img.js'),
    blog=require('./admin/blog.js');


router.use(function(req,res,next){

    if(req.session.adminInfo!==undefined){
        req.app.locals.profile=req.session.adminInfo.profile;
        next();
    }else{
        if(req.url==='/login' || req.url==='/login/getLogin'){
            next();
        }else{
            res.redirect('/admin/login');
        }
    }
});

router.get('/',function(req,res){
    mongoDB.find('admin',{},{},function(err,data){
        if(err) throw err;
        if(data.length>0 && req.session.adminInfo!==undefined){
            res.render('admin/admin');
        }else{
            res.redirect('/admin/login');
        }
    })
});
router.use('/login',login);
router.use('/userSuper',userSuper);
router.use('/sendBlog',sendBlog);
router.use('/blogKind',blogKind);
router.use('/blog',blog);
router.use('/imgKind',imgKind);
router.use('/img',img);

module.exports=router;