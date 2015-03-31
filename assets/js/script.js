jQuery(function(){
	// This demo depends on the canvas element
	if(!('getContext' in document.createElement('canvas'))){
		alert('Sorry, it looks like your browser does not support canvas!');
		return false;
	}     	
	document.getElementById('pencil').style.border="2px solid orange";  
document.getElementById('size1').style.border="2px solid orange";
// document.getElementByClassName("sizepencil").style.border =""; 
	// The URL of your web server (the port is set in app.js)
	//var url = 'http://localhost:3000'
	var divrubber = jQuery("#divrubber");
	var imageBG ='';
	var color ='';
	var username = '';
	var roomid = '';
	var pencilsize = 1;
	var positionx ='23';
	var positiony='0';
	var string64data = '';
	var stopsaving = '';
	var rubbersize;
	var posmousex;
	var posmousey;
	var timesaving = false;
	var updatingcanvas = false;
	var cursortimer =  10000;
	// Generate an unique ID
	var id = Math.round(jQuery.now()*Math.random());	
	
  var url = window.location.hostname;
	color = getParameterByName('color');
	if (color.length == 6){  color = '#' + color};
	
	username = getParameterByName('username');
	if (username.length > 1 && username.length < 25){  username = getParameterByName('username')}
	else {
username = id;		
	};
	
	roomid = getParameterByName('roomID');
	if (roomid.length > 0){  roomid = getParameterByName('roomID')};	
	
	cursortimer = getParameterByName('cursortimer');
	if (cursortimer.length > 0){  cursortimer = getParameterByName('cursortimer')}
	else { cursortimer=10000};	
	console.log(cursortimer);
	
	imageBG = getParameterByName('imageBG');
	
	stopsaving =   getParameterByName('stopSaving');
	
	timesaving =   getParameterByName('timesaving');
			
	var doc = jQuery(document),
		canvas = jQuery('#respondcanvas'),
		bgcanvas = jQuery('#bgcanvas');
//	instructions = jQuery('#instructions');
	var ctx = canvas[0].getContext('2d');	
	var ctx1 = bgcanvas[0].getContext('2d');	
	var drawing = false;
	var controlpencil = true;
	var controlrubber = false;
	var clients = {};
	var cursors = {};
	var prev = {};
	canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
	bgcanvas.width = document.body.clientWidth;
	bgcanvas.height = document.body.clientHeight;
	var socket = io.connect(url); 

var colorem;
 
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
 ctx.font = "20px Tahoma";
 
 if (roomid.length > 0) {
socket.emit('setuproom',{
				'room': roomid,				
				'usernamerem' : username,
				'imageBG': imageBG,
				'id': id
			});
} 

 if (imageBG.length > 3){ 
	imageobj = new Image();
	imageobj.src = imageBG;
	imageobj.onload = function() {
		ctx1.clearRect(0,0,bgcanvas.width,bgcanvas.height);
         ctx1.drawImage(imageobj, positionx, positiony);
									};
      
	  socket.emit('loadimage',{
				'imageBG' : imageBG,
			    'usernamerem' : username,
				'room' : roomid,
				'id': id
			});
	
	};	

  
 $("#rubber1").click(function() {
$(".sizerubber").css("border","");
document.getElementById('rubber1').style.border="2px solid orange";
document.getElementById('pencil').style.border="";
document.getElementById('divrubber').style.display="block";
document.getElementById('divrubber').style.width="15px";
document.getElementById('divrubber').style.height="15px";
rubbersize =  15;
controlrubber = true;
controlpencil = false;
    });	
 $("#rubber2").click(function() {
$(".sizerubber").css("border","");
document.getElementById('rubber2').style.border="2px solid orange";
document.getElementById('pencil').style.border="";
document.getElementById('divrubber').style.display="block";
document.getElementById('divrubber').style.width="30px";
document.getElementById('divrubber').style.height="30px";
rubbersize =  30;
controlrubber = true;
controlpencil = false;
    });	
 $("#rubber3").click(function() {
$(".sizerubber").css("border","");
document.getElementById('rubber3').style.border="2px solid orange";
document.getElementById('pencil').style.border="";
document.getElementById('divrubber').style.display="block";
document.getElementById('divrubber').style.width="50px";
document.getElementById('divrubber').style.height="50px";
rubbersize =  50;
controlrubber = true;
controlpencil = false;
    });	
 $("#rubber4").click(function() {
$(".sizerubber").css("border","");
document.getElementById('rubber4').style.border="2px solid orange";
document.getElementById('pencil').style.border="";
document.getElementById('divrubber').style.display="block";
document.getElementById('divrubber').style.width="90px";
document.getElementById('divrubber').style.height="90px";
rubbersize =  90;
controlrubber = true;
controlpencil = false;
    });	
 
 $('#pencil').click(function() {
document.getElementById('pencil').style.border="2px solid orange";
$(".sizerubber").css("border","");
controlrubber = false;
controlpencil = true;
document.getElementById('divrubber').style.display="none";
    });
 
  $("#size1").click(function() {
$(".sizepencil").css("border","");
document.getElementById('size1').style.border="2px solid orange";
pencilsize = 1;
    });
  
    $("#size2").click(function() {
$(".sizepencil").css("border","");
document.getElementById('size2').style.border="2px solid orange";
pencilsize = 2;
    });
	
	  $("#size3").click(function() {
$(".sizepencil").css("border","");
document.getElementById('size3').style.border="2px solid orange";
pencilsize = 7;
    });
	  
	    $("#size4").click(function() {
   $(".sizepencil").css("border","");
document.getElementById('size4').style.border="2px solid orange";
pencilsize = 15;
    });
$("#size5").click(function() {
   $(".sizepencil").css("border","");
document.getElementById('size5').style.border="2px solid orange";
pencilsize = 25;
    });

  socket.on('loadimageser', function (data) {
var imgdaclient = new Image();
imgdaclient.src = data.imageBG;
ctx1.clearRect(0,0,bgcanvas.width,bgcanvas.height);
imgdaclient.onload = function() {
ctx1.drawImage(imgdaclient, positionx, positiony);
 }          
});
	
 socket.on('setuproomser', function (data) {
 var imgdaclient = new Image();
imgdaclient.src = data.imageBG;     //  url of the image
imgdaclient.onload = function() {
	ctx1.clearRect(0,0,bgcanvas.width,bgcanvas.height);
 ctx1.drawImage(imgdaclient, positionx, positiony);          
}
	});	
 
  socket.on('setupcanvasser', function (data) {
 var imgdaclient = new Image();
imgdaclient.src = data.canvasstring; 
imgdaclient.onload = function() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
 ctx.drawImage(imgdaclient,0,0);         
 string64data =  data.canvasstring;
}
	});	

	socket.on('moving', function (data) {
		if(!(data.id in clients)){
			// a new user has come online. create a cursor for them
   cursors[data.id] = jQuery('<div class="cursor"><div class="identif">'+ data.usernamerem +'</div>').appendTo('#cursors');
		}
	// Move the mouse pointer
		cursors[data.id].css({
			'left' : data.x,
			'top' : data.y
		});
			
		// Is the user drawing?
		if(data.drawing && data.controlpencil && clients[data.id]){
		  drawLinerem(clients[data.id].x, clients[data.id].y, data.x, data.y,data.spessremo,data.colorem);		 
		}
		if (data.controlrubber && data.drawing) {		
		
	ctx.clearRect(data.x+10, data.y, data.width, data.height); 			 
		 }
		
		// Saving the current client state
		clients[data.id] = data;
	     clients[data.id].updated = jQuery.now();
	});
	
	socket.on('clickpointser', function (data) {
	
		if(data.controlpencil && clients[data.id]){
	drawcircle(data.x, data.y,data.spessremo,data.colorem);
		}		
	});

	  	canvas.on('mousedown', function(e){
		e.preventDefault();
		drawing = true;
		prev.x = e.pageX;
		prev.y = e.pageY;
			});

	$('#respondcanvas').on('mouseup', function() { 
drawing = false;
updatingcanvas = true;
if (controlrubber && !timesaving) {
canvas2base64();
}
});
	
$('#respondcanvas').on('click', function(e) { 
if (controlpencil) {
    drawcircle(e.pageX,e.pageY,pencilsize,color);	
	updatingcanvas = true;
 socket.emit('clickpoint',{
				'x': e.pageX,
				'y': e.pageY,
				'controlpencil': controlpencil,
				'id' : id,
			    'usernamerem' : username,
				'spessremo' : pencilsize,
				'room' : roomid,
				'colorem': color
			});
 if (!timesaving) {
canvas2base64();
 }
}
});

	var lastEmit = jQuery.now();
							 
$('canvas').on('mousemove', function(e){								 
	//if (controlpencil  || controlrubber){		
	posmousex = e.pageX;
	posmousey = e.pageY;
	if (controlrubber){
	jQuery("#divrubber").css( "zIndex", 8);
	document.getElementById('divrubber').style.left = (posmousex +10) +'px';
			 document.getElementById('divrubber').style.top = posmousey +'px';
			 if (drawing) {
		  jQuery("#divrubber").css( "zIndex", 6);
ctx.clearRect(posmousex +10, posmousey, rubbersize, rubbersize);
		}
			 } 
		if(jQuery.now() - lastEmit > 25){
			socket.emit('mousemove',{
				'x': posmousex,
				'y': posmousey,
				'id': id,				
				'drawing': drawing,
				'controlpencil': controlpencil,
			    'usernamerem' : username,
				'spessremo' : pencilsize,
				'controlrubber': controlrubber,
				'width': rubbersize,
				'height': rubbersize,
				'room' : roomid,
				'colorem': color
			});
			lastEmit = jQuery.now();
		}
		// Draw a line for the current user's movement, as it is
		// not received in the socket.on('moving') event above
		
		if(drawing && (!controlrubber)){
     	drawLine(prev.x, prev.y, posmousex, posmousey, color);
			prev.x = posmousex;
			prev.y = posmousey;
		   }

	});
if (timesaving) {
setInterval(function(){ 
   canvas2base64();
}, 5000);
}

// Remove inactive clients after  seconds of inactivity with cursortimer
    setInterval(function(){
        var totalOnline = 0;
        for(var ident in clients){
            if(jQuery.now() - clients[ident].updated > cursortimer){

                // Last update was more than 10 seconds ago.
                // This user has probably closed the page

                cursors[ident].remove();
                delete clients[ident];
                delete cursors[ident];
            }
            else {
			 totalOnline++;			
        }}
  //      jQuery('#onlineCounter').html('Users connected: '+totalOnline);
    },cursortimer);
	
	

	function drawLine(fromx, fromy, tox, toy, color){
		ctx.strokeStyle = color;
	   ctx.lineWidth = pencilsize;	
        ctx.beginPath();
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.stroke();
	}
	
	function drawLinerem(fromx, fromy, tox, toy,spessore,colorem){
		ctx.strokeStyle = colorem;
       ctx.lineWidth = spessore;	
        ctx.beginPath();
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.stroke();
	}
	function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function canvas2base64()  {
	if (stopsaving ==='true'){
console.log ('Bytes sent to server: 0');		
		return;}
		if (updatingcanvas === true) {
			updatingcanvas = false;
	var string_canvas = canvas[0].toDataURL();
	if (string64data.length !=  string_canvas.length) {
string64data = string_canvas;	
socket.emit('base64data',{
				'base64data' : roomid + '_' + string64data
				   });
console.log ('Bytes sent to server: ' + string_canvas.length);
	}	else {
console.log ('Nothing sent to server');		
	}
 }
}



function drawcircle(tox, toy,diameter,color) {
ctx.fillStyle = color;
    ctx.strokeStyle = color;     
         ctx.moveTo(tox, toy);        
        ctx.arc(tox, toy,diameter/2, 0, Math.PI*2, false);
        ctx.fill();          
};
});	
										 
	