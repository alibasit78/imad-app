//counter code

//submit username/password to login 

var submit=document.getElementById("submit_btn");
submit.onclick=function(){
	//make a request to the server and send the name

	//capture a list of names and render it as a list
	var request = new XMLHttpRequest();

	//capture the response and store it in a variable
	request.onreadystatechange=function(){
		if(request.readyState===XMLHttpRequest.DONE){
			//take some action
			if(request.status===200){
				var names=request.responseText;
				names=JSON.parse(names);
				var list='';
				for(var i=0;i<names.length;i++)
				{
					list+='<li>' + names[i] + '</li>';
				}
				var ul=document.getElementById('namelist');
				ul.innerHTML=list;
			}
		}
	}; 
	//Make the request
	var username=document.getElementById('username').value;
	var password=document.getElementById('password').value;
	console.log(username);
	console.log(password);
	request.open('POST','http://alibasit78.imad.hasura-app.io/login',true);
	request.setRequestHeader('Content-Type','application/json');
	request.send(JSON.stringify({username:username,password:password}));
	
} 

