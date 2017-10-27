
var express=require('express'),
    router=express.Router(),
    ObjectID=require('mongodb').ObjectID,
    async=require('async'),
    ObjectID=require('mongodb').ObjectID,
    fs=require('fs'),
    bodyParser=require('body-parser'),
    multiparty = require('multiparty'),
    mongoDB=require('../../../db/db.js');

router.get('/',function(req,res){
    res.render('admin/img/index');
});

router.get('/imgAdd',function(req,res){
    mongoDB.find('imgKind',function(err,data){
        if(err) throw err;
        res.render('admin/img/imgAdd',{list:data});
    });

});

router.post('/doImgAdd',function(req,res){
    var form = new multiparty.Form();
    form.uploadDir = 'public/upload/img';
    form.parse(req, function (err, fields, files) {
        var json = {
            name: fields['name'][0],
            kindId: fields['kindId'][0],
            foundTime: fields['foundTime'][0],
            img: files.img[0].path
        };
        mongoDB.findById('imgKind',ObjectID(json.kindId),function(err,data){
            json.kind=data.name;
            mongoDB.save('img',json,function(err,result){
                if(err) throw err;
                res.redirect('/admin/img')
            })
        });

    });
});

router.get('/imgList',function(req,res){
    var page=req.query.page || 1;
    var pageSize=6;
    async.parallel({
        count:function(callback){
            mongoDB.count('img',{},function(err,data){
                callback(err,data);
            })
        },
        kind:function(callback){
            mongoDB.find('imgKind',{},function(err,data){
                callback(err,data);
            });
        },
        list:function(callback){
            mongoDB.findSkip('img',{},{"name":1},{
                page:page,
                pageSize:pageSize
            },function(err,data){
                callback(err,data);
            })
        }
    },function(err,results){
        res.render('admin/img/imgList',{
            count:results.count,
            kind:results.kind,
            list:results.list,
            page:page,
        })
    });
});

router.get('/edit',function(req,res){
    var id=req.query.id;
    var page=req.query.page;
    async.parallel({
        kind:function(callback){
            mongoDB.find('imgKind',function(err,data){
                callback(err,data);
            });
        },
        imgOne:function(callback){
            mongoDB.findById('img',ObjectID(id),function(err,data){
                callback(err,data);
            })
        }
    },function(err,results){
        res.render('admin/img/imgEdit',{
            kind:results.kind,
            list:results.imgOne,
            page
        })
    });
});

router.post('/doEdit',function(req,res){
    var form = new multiparty.Form();
    form.uploadDir = 'public/upload/img';
    form.parse(req, function (err, fields, files) {
        var name= fields['name'][0],
            kindId= fields['kindId'][0],
            img= files.img[0].path,
            id=fields['id'][0],
            page=fields['page'][0];
        if(files.img[0].originalFilename===''){
            var json={
                name,
                kindId,
            };
            fs.unlink(img);
        }else{
            var json={
                name,
                kindId,
                img
            };
        }
        mongoDB.findById('imgKind',ObjectID(json.kindId),function(err,data){
            json.kind=data.name;
            mongoDB.update('img',{"_id":ObjectID(id)},json,function(err,result){
                if(err) throw err;
                res.redirect('/admin/img/imgList?page='+page)
            })
        });

    });
});

router.get('/search',function(req,res){
    mongoDB.find('imgKind',function(err,data){
        if(err) throw err;
        res.render('admin/img/search',{
            list:data,
            show:0
        })
    });
});

router.post('/search',function(req,res){
    var form=new multiparty.Form();
    form.uploadDir='public/upload/img';
    form.parse(req,function(err,fields,files){
        var name=fields.keywords[0];
        var kind=fields.kind[0];
        console.log();
        if(kind==='name'){
            var keywords=name?{"name":{$regex:new RegExp(name)}}:{};
            mongoDB.find('img',keywords,{},function(err,data){
                if(err) throw err;
                res.render('admin/img/search',{
                    show:data,
                });
            })
        }
        if(kind==='kind'){
            var keywords=name?{"kind":{$regex:new RegExp(name)}}:{};
            mongoDB.find('img',keywords,{},function(err,data){
                if(err) throw err;
                res.render('admin/img/search',{
                    show:data,
                });
            })
        }
        if(kind==='foundTime'){
            var keywords=name?{"foundTime":{$regex:new RegExp(name)}}:{};
            mongoDB.find('img',keywords,{},function(err,data){
                if(err) throw err;
                res.render('admin/img/search',{
                    show:data,
                });
            })
        }
    });
});

router.get('/remove',function(req,res){
    var id=req.query.id;
    mongoDB.remove('img',{"_id":ObjectID(id)},function(err,result){
        if(err) throw err;
        res.redirect('/admin/img/imgList');
    })
});

module.exports=router;