/**
 * Created by Administrator on 2017/10/24.
 */
var express=require('express'),
    router=express.Router(),
    bodyParser=require('body-parser'),
    ObjectID=require('mongodb').ObjectID,
    multiparty = require('multiparty'),
    mongoDB=require('../../db/db.js');

router.get('/',function(req,res){
    mongoDB.find('blogKind',{},{},function(err,data){
        if(err) throw err;
        res.render('admin/sendBlog',{list:data})
    });

});
router.post('/getBlog',function(req,res){
    var form = new multiparty.Form();
    form.uploadDir = 'public/upload/blog';
    form.parse(req, function (err, fields, files) {
        var json={
            title:fields['title'][0],
            kindId:fields['kindId'][0],
            sendTime:fields['sendTime'][0],
            content:fields['content'][0]
        };
        mongoDB.save('article',json,function(err,data){
            if(err) throw err;
            res.redirect('/admin/blog')
        })
    });
});


router.post('/upload',function(req,res){
    var form = new multiparty.Form();
    form.uploadDir = 'public/upload/blog';
    form.parse(req, function (err, fields, files) {
        var uploadurl='/'+files.filedata[0].path;
        res.json({"err":"","msg":uploadurl});
    });
});


module.exports=router;
