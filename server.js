var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser=require('body-parser');
var session =require('express-session');

var config={
	user:'alibasit78',
	database:'alibasit78',
	host:'db.imad.hasura-app.io',
	port:'5432',
	password:process.env.DB_PASSWORD

};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
	secret: 'someRandomSecretValue',
	cookie:{maxAge:1000*60*60*24*30}
}));

var articles={

	'article-one':{
	title:'Article-One Basit Ali',
	heading:'Article-One',
	date:'August 20,2017 ',
	content:`
		<p>This is my content This is my content This is my content 
			This is my content This is my content This is my content
		</p>
		<p>
		This is my content This is my content This is my content
		This is my content This is my contentThis is my content
		</p>`
},

	'article-two':{
	title:'Article-Two Basit Ali',
	heading:'Article-Two',
	date:'August 10,2017',
	content:`
		<p>This is my content This is my content This is my content 
			This is my content This is my content This is my content
		</p>
		<p>
		This is my content This is my content This is my content
		</p>`},

	'article-three':{
	title:'Article-Three Basit Ali',
	heading:'Article-Three',
	date:'August 15,2017',
	content:`
		<p>This is my content This is my content This is my content 
			This is my content This is my content This is my content
		</p>
		`}

}
function createTemplate(data){
var title=data.title;
var date=data.date;
var heading=data.heading;
var content=data.content;

var htmlTemplate=`
<html>
	<head>
		<title>
			${title}
		</title>
		<meta name="viewport" content="width-device-width"/>
		 <link href="/ui/style.css" rel="stylesheet" />
	</head>
	<body>
	<div class="container">
		<div>
			<a href="/">home</a>
		</div>
		<hr/>
		<h3>
			${heading}
		</h3>
		<div>
			${date.toDateString()}
		</div>
		<div>
			${content}
		</div>
	</div>
	
	</body>
</html>
	`;
return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,'ui', 'index.html'));
});

var counter=0;
app.get('/counter',function(req,res){
counter=counter+1;
res.send(counter.toString());
});


function hash(input,salt){
	//how do we create a hash
	var hashed=crypto.pbkdf2Sync(input,salt,1000,512,'sha512');
	return ['pbkdf2','10000',salt,hashed.toString('hex')].join('$');
}

app.post('/create-user',function(req,res){
	//username password
	//json
	//{"username":"alibasit","password":"password"}
	var username=req.body.username;
	var password=req.body.password;
	var salt=crypto.randomBytes(128).toString('hex');
	var dbString=hash(password,salt);
	pool.query('INSERT INTO "users" (username,password) VALUES ($1,$2)',[username,dbString],function(err,result){
		if(err){
		res.status(500).send(err.toString());
	}else{
		res.send('User successfully created: '+ username);
	}	
	});
});

app.post('/login',function(req,res){
	var username=req.body.username;
	var password=req.body.password;
	//var salt=crypto.randomBytes(128).toString('hex');
	//var dbString=hash(password,salt);
	pool.query('select * from "users" where username= $1',[username],function(err,result){
		if(err)
		{
			res.status(500).send(err.toString());
		}
		else
		{
			if(result.rows.length===0)
			{
				res.status(403).send('username/password is invalid');
			}
			else
			{
				var dbString=result.rows[0].password;
				var salt=dbString.split('$')[2];
				var hashedPassword=hash(password,salt);
				if(hashedPassword===dbString)
				{
				
					//set the session
					req.session.auth={userId:result.rows[0].id};
					//set cookie with a session id
					//internally, on the server side ,it maps the session id to an object
					//{auth:{userId}}
					res.send('credentials correct');
				}
				else
				{
				    console.log(result.rows[0].password);
				res.status(403).send('username/password is invalid');
				}
			}
		}

		

		//res.send('User successfully created: '+ username);
		
		
	});

});

app.get('/check-login',function(req,res){
	if(req.session&&req.session.auth&&req.session.auth.userId){
		res.send('You are Logged in: '+req.session.auth.userId.toString());
	}else {
		res.send('You are not Logged in');
	}
});

app.get('/logout',function(req,res){
	delete req.session.auth;
	res.send('Logged Out');
});

app.get('/hash/:input',function(req,res){
	var hashedString=hash(req.params.input,'this-is-same-random-string');
	res.send(hashedString);
});

var pool=new Pool(config);
app.get('/test-db',function(req,res){
	//make a select request
	//return a response with the results
	pool.query('SELECT * FROM users',function(err,result){
	if(err){
		res.status(500).send(err.toString());
	}else{
		res.send(JSON.stringify(result.rows));
	}	
	});
});
app.get('/submit-name',function(req,res){//submit-name?name=xxxx
	//Get the name from the request
	var name=req.query.name;
	names.push(name);
	//JSON:Javascript Object notation
	res.send(JSON.stringify(names));
});

app.get('/articles/:articleName', function (req, res) {
//var articleName=req.params.articleName;
//select * from article where title='';DELETE artilce where a='a
pool.query("SELECT * FROM article WHERE title= $1",[req.params.articleName],function(err,result){
    if(err){
	    	res.status(500).send(err.toString());
	    }else{
		    if(result.rows.length===0){
			    res.status(404).send('Artice not found');		
		    }else {
			    var articleData=result.rows[0];
			    res.send(createTemplate(articleData));
		    }
	    }		
    });
 
});




app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});
var names=[];
/*app.get('/submit-name/:name',function(req,res){
	//Get the name from the request
	var name=req.params.name;
	names.push(name);
	//JSON:Javascript Object notation
	res.send(JSON.stringfly(name));
});
*/


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
