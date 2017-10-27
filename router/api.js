/**
 * Created by Administrator on 2017/10/26.
 */
var express=require('express'),
    router=express.Router(),
    app=express(),
    bodyParser=require('body-parser'),
    mongoDB=require('../db/db.js');



router.get('/blogList',function(req,res){
    var page=req.query.page || 1;
    var pageSize=3;
    mongoDB.findSkip('article',{},{title:1},{
        page:page,
        pageSize:pageSize
    },function(err,data){
        if(err) throw err;
        res.jsonp({
            result:data,
            page:page
        });
    })
});

router.post('/imgList',function(req,res){
    var valA=req.body;
    var page=req.query.page || 1;
    var pageSize=6;
    mongoDB.findSkip('img',{"kindId":valA.val},{name:1},{
        page:page,
        pageSize:pageSize
    },function(err,data){
        if(err) throw err;
        res.jsonp({
            result:data,
            page:page
        });
    })
});

router.get('/Img');

module.exports=router;