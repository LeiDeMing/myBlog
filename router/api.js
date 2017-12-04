/**
 * Created by Administrator on 2017/10/26.
 */
var express=require('express'),
    router=express.Router(),
    app=express(),
    ObjectID=require('mongodb').ObjectID,
    bodyParser=require('body-parser'),
    mongoDB=require('../db/db.js');



// router.get('/blogList',function(req,res){
//     var page=req.query.page || 1;
//     var pageSize=3;
//     mongoDB.findSkip('article',{},{title:1},{
//         page:page,
//         pageSize:pageSize
//     },function(err,data){
//         if(err) throw err;
//         res.jsonp({
//             result:data,
//             page:page
//         });
//     })
// });

router.post('/user',function(req,res){
	var num=0;
	for(var item in req.body){
		if(req.body[item]){
			num++;
		}
		
	}
	if(num<=1){
		mongoDB.remove('admin',{"_id":ObjectID(req.body.id)},function(err,data){
			if(err) throw err;
			res.jsonp(1);
		});
	}else{
		if(req.body['__v']=='0'){
		var id=req.body['_id']
		mongoDB.update('admin',{"_id":ObjectID(id)},req.body,function(err,data){
			if(err) throw err;
			console.log(data);
			res.jsonp(1);
		});
	}else{
		var json=req.body;
	mongoDB.find('admin',{"name":json.name},function(err,resl){
		if(resl.length>0){
			res.jsonp(0)
		}else{
			mongoDB.save('admin',json,function(err,data){
				if(err) throw err;
				res.jsonp(1)
			});
		}
	})
	}
	}
	
	
	
});

router.get('/user',function(req,res){
	var id=req.query.id;
	if(id){
		mongoDB.find('admin',{"_id":ObjectID(id)},function(err,data){
			if(err) throw err;
			res.jsonp(data);
		})
	}else{
		mongoDB.find('admin',{},function(err,data){
			if(err) throw err;
			res.jsonp(data);
		})
	}
	
})

router.post('/admin',function(req,res){
	var json=req.body;
	if(json)
	mongoDB.find('admin',{"name":json.ac},function(err,data){
		if(err) throw err;
		if(data[0].pwd===json.pwd){
			res.jsonp(1);
		}else{
			res.jsonp(0);
		}
	})
})

module.exports=router;