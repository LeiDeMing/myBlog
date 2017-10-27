/**
 * Created by Administrator on 2017/10/25.
 */
var express=require('express'),
    router=express.Router(),
    mongoDB=require('../../db/db.js'),
    ObjectID=require('mongodb').ObjectID,
    multiparty = require('multiparty');



router.get('/kind',function(req,res){
    mongoDB.find('blogKind',{},function(err,data){
        if(err) throw err;
        res.render('admin/blog/kind/kind',{list:data});
    });
});

router.get('/kindAdd',function(req,res){
    res.render('admin/blog/kind/kindAdd');
});

router.post('/doKindAdd',function(req,res){
    var form = new multiparty.Form();
    form.uploadDir = 'public/upload/blog';
    form.parse(req, function (err, fields, files) {
        var json={
            name:fields['name'][0],
            foundTime:fields['foundTime'][0]
        };
        mongoDB.save('blogKind',json,function(err,result){
            if(err) throw err;
            res.redirect('/admin/blogKind/kindAdd')
        })
    });
});

router.get('/kindEdit',function(req,res){
    var id=req.query.id;
    mongoDB.find('blogKind',{"_id":ObjectID(id)},{},function(err,data){
        if(err) throw err;
        res.render('admin/blog/kind/kindEdit',{list:data[0]})
    });
});
router.post('/doKindEdit',function(req,res){
    var form = new multiparty.Form();
    form.uploadDir = 'public/upload/blog';
    form.parse(req, function (err, fields, files) {
        var id=fields['id'][0];
        var json={
            name:fields['name'][0]
        };
        mongoDB.update('blogKind',{"_id":ObjectID(id)},json,function(err,result){
            if(err) throw err;
            res.redirect('/admin/blogKind/kind')
        })
    });
});
router.get('/remove',function(req,res){
    var id=req.query.id;
    mongoDB.remove('blogKind',{"_id":ObjectID(id)},function(err,result){
        if(err) throw err;
        res.redirect('/admin/blogKind/kind')
    });
});
module.exports=router;