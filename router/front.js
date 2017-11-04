/**
 * Created by Administrator on 2017/10/26.
 */
var express=require('express'),
    router=express.Router(),
    async=require('async'),
    ObjectID=require('mongodb').ObjectID,
    mongoDB=require('../db/db.js');



router.get('/',function(req,res){
    mongoDB.findOnSort('article',{},{},{sendTime:-1},function(err,data){
        if(err) throw err;
        res.render('front/index',{
            list:data
        });
    });
});


module.exports=router;