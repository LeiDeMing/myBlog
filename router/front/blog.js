/**
 * Created by Administrator on 2017/11/4.
 */
var express=require('express'),
    router=express.Router(),
    app=express(),
    async=require('async'),
    ObjectID=require('mongodb').ObjectID,
    bodyParser=require('body-parser'),
    mongoDB=require('../../db/db.js');





router.get('/blogList',function(req,res){
    var id=req.query.id;
    mongoDB.find('article',{"_id":ObjectID(id)},"browse",function(err,results){
        if(err) throw err;
        var newBrowse=results[0].browse+1;

        async.parallel({
            update:function(callback){
                mongoDB.update('article',{"_id":ObjectID(id)},{"browse":newBrowse},function(err,rel){
                    if(err) throw err;
                    callback(err,rel);
                });
            },
            find:function(callback){
                mongoDB.find('article',{"_id":ObjectID(id)},{},function(err,data){
                    callback(err,data);
                });
            }
        },function(err,results){
            if(err) throw err;
            res.render('front/blog',{
                list:results.find[0]
            })
        });
    });

});

module.exports=router;