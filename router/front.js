/**
 * Created by Administrator on 2017/10/26.
 */
var express=require('express'),
    router=express.Router(),
    async=require('async'),
    mongoDB=require('../db/db.js');



router.get('/',function(req,res){
    async.parallel({
        kind:function(callback){
            mongoDB.find('blogKind',{},function(err,data){
                callback(err,data);
            });
        },
        list:function(callack){
            mongoDB.find('article',{},function(err,data){
                callack(err,data);
            })
        },
        imgList:function(callback){
            mongoDB.find('imgKind',{},function(err,data){
                callback(err,data);
            });
        },
        img:function(callback){
            mongoDB.find('img',{},function(err,data){
                callback(err,data);
            });
        }
    },function(err,results){
        if(err) throw err;
        res.render('front/index',{
            kind:results.kind,
            list:results.list,
            imgList:results.imgList,
            img:results.img
        });
    });

});


module.exports=router;