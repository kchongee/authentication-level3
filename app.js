//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use("/login", express.static(__dirname+'/login'));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
	username:String,
	password:String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]})

const User = mongoose.model("user",userSchema);
// const secretSchema = new mongoose.Schema({
// 	caption:String,
// });
// const Secret = mongoose.model("secret",userSchema);

app.get("/",function(req,res){
	res.render("home");
});
app.get("/:route",function(req,res){	
	const route = req.params.route;
	res.render(route);	
});

app.post("/login",function(req,res){
	const username = req.body.username;
	const password = req.body.password;
	User.findOne({username:username},function(err,theUser){
		if(!err){
			if(theUser){				
				if(theUser.password === password){					
					res.redirect("/secrets");
				}else{					
					res.redirect("/login");
				}
			}else{				
				res.redirect("/login");
			}					
		}else{			
			console.log(err);
			res.send(err);
		}
	});
})
app.post("/register",function(req,res){
	const username = req.body.username;
	const password = req.body.password;
	const user = new User({
		username:username,
		password:password
	});
	user.save(function(err){
		if(!err){
			res.redirect("/secrets");
		}else{
			res.send(err);
		}
	});
})

app.listen(3000,function(){
	console.log("Server connected to port 3000");
});

