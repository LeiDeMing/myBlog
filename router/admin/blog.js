/**
 * Created by Administrator on 2017/10/25.
 */
var express=require('express'),
    router=express.Router(),
    ObjectID=require('mongodb').ObjectID,
    async=require('async'),
    multiparty = require('multiparty'),
    mongoDB=require('../../db/db.js');

router.get('/',function(req,res){
    res.render('admin/blog/index')
});
router.get('/blogList',function(req,res){
    // mongoDB.find('article',{},{},function(err,data){
    //     if(err) throw err;
    //     res.render('admin/blog/index',{list:data});
    // });
    var page=req.query.page || 1;
    var pageSize=5;
    async.parallel({
        count:function(callback){
            mongoDB.count('article',{},function(err,countN){
                callback(err,countN);
            })
        },
        kind:function(callback){
          mongoDB.find('blogKind',{},function(err,data){
              callback(err,data)
          });
        },
        list:function(callback){
            mongoDB.findSkip('article',{},{"title":1},{
                page:page,
                pageSize:pageSize
            },function(err,data){
                callback(err,data);
            })
        }
    },function(err,results){
        if(err) throw err;
        res.render('admin/blog/blogList',{
            list:results.list,
            page:page,
            kind:results.kind,
            totalPage:results.count,
        });

    });
});

router.get('/edit',function(req,res){
    var id=req.query.id;

    async.parallel({
        kind:function(callback){
            mongoDB.find('blogKind',{},function(err,data){

                callback(err,data);
            });
        },
        list:function(callback){
            mongoDB.findById('article',ObjectID(id),function(err,data){

                callback(err,data)
            })
        }
    },function(err,results){
        if(err) throw err;
        res.render('admin/blog/edit',{
            kind:results.kind,
            list:results.list,
            id:id
        })
    });
});

router.post('/doEdit',function(req,res){
    var form = new multiparty.Form();
    form.uploadDir = 'public/upload/blog';
    form.parse(req, function (err, fields, files) {
        var id=fields['id'][0];
        var json={
            title:fields['title'][0],
            kindId:fields['kindId'][0],
            sendTime:fields['sendTime'][0],
            content:fields['content'][0]
        };
        mongoDB.update('article',{"_id":ObjectID(id)},json,function(err,data){
            if(err) throw err;
            res.redirect('/admin/blog/blogList')
        })
    });
});

router.get('/remove',function(req,res){
    var id=req.query.id;
    mongoDB.remove('article',{"_id":ObjectID(id)},function(err,result){
        if(err) throw err;
        res.redirect('/admin/blog/blogList');
    })
});
module.exports=router;