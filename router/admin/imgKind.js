
var express=require('express'),
    router=express.Router(),
    ObjectID=require('mongodb').ObjectID,
    async=require('async'),
    ObjectID=require('mongodb').ObjectID,
    bodyParser=require('body-parser'),
    multiparty = require('multiparty'),
    mongoDB=require('../../db/db.js');





router.get('/imgKindAdd',function(req,res){
    res.render('admin/img/kind/imgKindAdd');
});

router.post('/imgDoAdd',function(req,res){
    var form = new multiparty.Form();
    form.uploadDir = 'public/upload/img';
    form.parse(req, function (err, fields, files) {
        var json={
            name:fields['name'][0],
            foundTime:fields['foundTime'][0]
        };
        mongoDB.save('imgKind',json,function(err,result){
            if(err) throw err;
            res.redirect('/admin/imgKind/imgKind')
        })
    });
});

router.get('/imgKind',function(req,res){
    mongoDB.find('imgKind',{},function(err,data){
        if(err) throw err;
        res.render('admin/img/kind/imgKind',{list:data});
    });
});

router.get('/kindEdit',function(req,res){
    var id=req.query.id;
    mongoDB.find('imgKind',{"_id":ObjectID(id)},function(err,data){
        res.render('admin/img/kind/kindEdit',{list:data[0]});
    });

});

router.post('/doKindEdit',function(req,res){
    var form = new multiparty.Form();
    form.uploadDir = 'public/upload/img';
    form.parse(req, function (err, fields, files) {
        var id=fields['id'][0];
        var json={
            name:fields['name'][0]
        };
        mongoDB.update('imgKind',{"_id":ObjectID(id)},json,function(err,result){
            if(err) throw err;
            res.redirect('/admin/imgKind/imgKind')
        })
    });
});

router.get('/kindRemove',function(req,res){
    var id=req.query.id;
    mongoDB.remove('imgKind',{"_id":ObjectID(id)},function(err,data){
        res.redirect('/admin/imgKind/imgKind')
    });
});

module.exports=router;