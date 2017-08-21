var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

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
			${date}
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

app.get('/:articleName', function (req, res) {
var articleName=req.params.articleName;
  res.send(createTemplate(articles[articleName]));
});



app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 8080;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
