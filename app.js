
var express=require('express'),
    router=express.Router(),
    app=express(),
    bodyParser=require('body-parser'),
    multiparty = require('multiparty'),
    async=require('async'),
    fs=require('fs'),
    session=require('express-session'),
    ObjectID=require('mongodb').ObjectID,
    mongoDB=require('./db/db.js'),
    md5=require('md5'),
    admin=require('./router/admin.js'),
    front=require('./router/front.js'),
    api=require('./router/api.js');

app.use('/public', express.static('public'));
app.use(express.static('public'));
//  parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine','ejs');

app.use('/admin',admin);
app.use('/api',api);
app.use('/',front);

app.use("*",function(req,res){
    res.status(403);
    res.render('403');
});


app.listen(3001);
console.log('server start');