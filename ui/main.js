//counter code
var button=document.getElementById('counter');

button.onclick=function(){
	//create the response and store it in avariable
	var request = new XMLHttpRequest();

	//capture the response and store it in a variable
	request.onreadystate=function(){
		if(request.readyState===XMLHttpRequest.DONE){
			//take some action
			if(request.status===200){
			    	console.log('hello');
				var counter=request.responseText;
			
				var span=document.getElementById('count');
				span.innerHTML=counter.toString(); 
				
			}
			

  }
		
		}
	}; 
	//Make the request
	request.open('GET','http://alibasit78.imad.hasura-app.io/counter',true);
	request.send(null);

};
