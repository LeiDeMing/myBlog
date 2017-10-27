/**
 * Created by Administrator on 2017/10/24.
 */
var express=require('express'),
    router=express.Router(),
    app=express(),
    bodyParser=require('body-parser'),
    mongoDB=require('../../db/db.js'),
    md5=require('md5'),
    session=require('express-session');




router.get('/',function(req,res){
    res.render('admin/login');
});

router.post('/getLogin',function(req,res){
    var loginData=req.body,
        flag=false;
    mongoDB.find('admin',loginData.admin,{},function(err,data){
        if(err) throw err;
        for(var x=0;x<data.length;x++){
            if(loginData.admin===data[x].name && md5(loginData.pwd)===data[x].pwd){
                req.session.adminInfo={
                    name:data[x].name,
                    profile:data[x].profile
                };
                flag=true;
                break;
            }else{
                flag=false;
            }
        }
        if(flag){
            res.redirect('/admin');
        }else{
            res.redirect('/admin/login');
        }
    })
});

module.exports=router;