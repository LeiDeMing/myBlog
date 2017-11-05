/**
 * Created by Administrator on 2017/10/26.
 */
var express=require('express'),
    router=express.Router(),
    async=require('async'),
    ObjectID=require('mongodb').ObjectID,
    mongoDB=require('../db/db.js'),
    blog=require('./front/blog.js');


router.get('/',function(req,res){
    mongoDB.findOnSort('article',{"state":"发布"},{},{sendTime:-1},function(err,data){
        if(err) throw err;
        res.render('front/index',{
            list:data
        });
    });
});

router.use('/blog',blog);

module.exports=router;