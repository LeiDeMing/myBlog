/**
 * Created by Administrator on 2017/10/26.
 */
var express=require('express'),
    router=express.Router(),
    async=require('async'),
    mongoDB=require('../db/db.js');



router.get('/',function(req,res){
    res.render('front/index');

});


module.exports=router;