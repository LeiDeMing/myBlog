/**
 * Created by Administrator on 2017/10/24.
 */
var express = require('express'),
    router = express.Router(),
    ObjectID = require('mongodb').ObjectID,
    md5 = require('md5'),
    fs=require('fs'),
    multiparty = require('multiparty'),
    mongoDB = require('../../../db/db.js');

// 展示超级用户
router.get('/', function (req, res) {
    mongoDB.find('admin', {}, {}, function (err, data) {
        if (err) throw err;
        res.render('admin/userSuper/userSuper', {list: data});
    });

});

// 添加超级用户
router.get('/add', function (req, res) {
    res.render('admin/userSuper/add');

});

router.post('/doAdd', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = 'public/upload/adminUser';
    form.parse(req, function (err, fields, files) {
        var json = {
            name: fields['name'][0],
            pwd: md5(fields['pwd'][0]),
            foundTime: fields['foundTime'][0],
            auth: fields['auth'][0],
            profile: files.profile[0].path
        };
        mongoDB.save('admin', json, function (err, data) {
            if (err) throw err;
            res.redirect('/admin/userSuper');
        })
    });
});


// 修改超级用户
router.get('/edit', function (req, res) {
    var userId = req.query.id;
    mongoDB.find('admin', {"_id": ObjectID(userId)}, {}, function (err, data) {
        res.render('admin/userSuper/edit', {list: data[0]});
    });

});

router.post('/doEdit', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = 'public/upload/adminUser';
    form.parse(req, function (err, fields, files) {
        var name = fields['name'][0],
            pwd = fields['pwd'][0],
            auth = fields['auth'][0],
            profile = files.profile[0].path,
            id = fields['id'][0];
        // originalFilename
        mongoDB.find('admin', {"_id": ObjectID(id)}, {}, function (err, data) {
            if (err) throw err;
            if(data[0].pwd===pwd && files.profile[0].originalFilename===''){
                var json={
                    name,
                    pwd,
                    auth
                };
                fs.unlink(profile);
            }else if(data[0].pwd===pwd && files.profile[0].originalFilename!==''){
                var json={
                    name,
                    pwd,
                    auth,
                    profile
                };
            }else if(data[0].pwd!==pwd && files.profile[0].originalFilename===''){
                var json={
                    name,
                    pwd:md5(pwd),
                    auth
                };
                fs.unlink(profile);
            }else{
                var json={
                    name,
                    pwd:md5(pwd),
                    auth,
                    profile
                };
            }
            idUptate('admin',ObjectID(id),json);
            if(req.session.adminInfo.name===data[0].name){
                req.session.adminInfo=undefined;
                res.redirect('/admin/login')
            }else{
                res.redirect('/admin/userSuper');
            }
        })

    });
});


function idUptate(colle,condiciton,data){
    mongoDB.update(colle,{"_id":condiciton},data,function(err,result){
        if(err) throw err;
    });
}
module.exports = router;
