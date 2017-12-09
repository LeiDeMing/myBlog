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
    var page = req.query.page || 1;
    var pageSize = 5;
    async.parallel({
        count:function(callback){
            mongoDB.count('article',{"state":"发布"},function(err,data){
                callback(err,data);
            });
        },
        p:function(callback){
            mongoDB.findSkip('article',{"state":"发布"},{sendTime:-1},{
                page,
                pageSize
            },function(err,rel){
                callback(err,rel);
            })
        }
    },function(err,results){
        if(err) throw err;
        res.render('front/index',{
            list:results.p,
            page,
            pageCount:results.count
        });
    })
});

router.use('/blog',blog);

module.exports=router;