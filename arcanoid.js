class Ball {
	constructor(options){
		this.options = options || {};		
	}

	draw() {
        var ctx = this.options.context;
		ctx.beginPath();
		ctx.arc(this.options.x,this.options.y,this.options.radius,0,2*Math.PI);
		ctx.fillStyle = this.options.fill;
		ctx.fill();
		ctx.closePath();
	}

	move(x,y) {
		this.options.x = this.options.x + x;
		this.options.y = this.options.y + y;
	}
}

class Pad {
	constructor(options){
		this.options = options || {};		
	}

	draw(){
		this.options.context.fillStyle = this.options.fill;
		this.options.context.fillRect(this.options.x,this.options.y,this.options.width,this.options.height); 
	}

	move(x) {
		this.options.x = this.options.x + x;		
	}
}

class Text {
	constructor(options){
		this.options = options || {};		 		
	}

	draw(){		
		this.options.context.font = this.options.font;
		this.options.context.fillStyle = this.options.fill;
		this.options.context.textAlign = "center";		
  		this.options.context.fillText(this.options.text, this.options.canvas.width/2, this.options.canvas.height/2);  		  		  			 			
	}
}

class Application {
  constructor(options){
  	this.options = options || {};
  	var canvas_element = document.getElementById(this.options.canvas_id);
	this.options.width = this.options.width || 1000;
	this.options.height = this.options.height || 500;
	canvas_element.width = this.options.width;
	canvas_element.height = this.options.height;
	this.context_2d = canvas_element.getContext("2d");
	this.ball_speed = 3;
	this.ball_dx = this.ball_speed;
    this.ball_dy = this.ball_speed;		

	this.ball = new Ball({
			context:this.context_2d,
			x:500,
			y:480,
			radius: 10,
			fill:'#1E90FF'
		})

	var pad_height = 10;
    this.pad = new Pad({
            context:this.context_2d,
			x:425,
			y: this.options.height - pad_height,
			width: 150,
			height: pad_height,
			fill:'#1E90FF'		
	    })

    this.loser = new Text({
			context:this.context_2d,
			canvas: canvas_element,			
			text: "You lose",
			font: "48px serif",
			fill:'#FF00FF'						
		})

	};

	

	draw() {   
	    if(this.game_over_flag) this.loser.draw();	    
		this.ball.draw();
		this.pad.draw();		
	}

	clear(){
		var ctx = this.context_2d;
		ctx.clearRect(0,0,this.options.width,this.options.height);
	}

	update(){
		if(this.left_pressed){
			if(this.left_pressed && this.pad.options.x > 0){
				this.pad.move(-10);
		    }
		}

		if(this.right_pressed){
			if(this.right_pressed && this.pad.options.x + this.pad.options.width < this.options.width){
				this.pad.move(10);
		    }
		}
        this.detect_game_over();
        this.detect_pad_collision();
		this.detect_wall_collisions();
		this.ball.move(this.ball_dx,this.ball_dy);		
			
	}

	start(){
		this.loop(Date.now());
	}

	loop(time){
		var app = this;
		this.id_request_update = requestAnimationFrame(function(t){
			app.loop(t);
		});
		this.update();
		this.clear();
		this.draw();
	}

	detect_wall_collisions(){
		if(this.ball.options.y - this.ball.options.radius < 0){
			 this.ball_dy = -this.ball_dy;
		}

		if(this.ball.options.x + this.ball.options.radius > this.options.width||
           this.ball.options.x - this.ball.options.radius < 0){
             this.ball_dx = -this.ball_dx;
        }
	}

	detect_pad_collision(){
        if (this.ball.options.y + this.ball.options.radius  > this.options.height - this.pad.options.height &&
            this.ball.options.x > this.pad.options.x &&
            this.ball.options.x < this.pad.options.x + this.pad.options.width){
            	this.ball_dy = -this.ball_dy;              
        }
    }

	keydown_callback(key_code){
		if(key_code == 39) {
	        this.right_pressed = true;
	    }
	    if(key_code == 37) {
	        this.left_pressed = true;
	    }
	}
	keyup_callback(key_code){
		if(key_code == 39) {
	        this.right_pressed = false;	        
	    }
	    if(key_code == 37) {
	        this.left_pressed = false;
	    }
	}

	game_over(){	  
      cancelAnimationFrame(this.id_request_update);
      this.game_over_flag = true;      
	}

	detect_game_over(){
		if(this.ball.options.y + this.ball.options.radius > this.options.height){
			this.game_over();
		}
	}
}

window.onload = function(){
	var app = new Application({canvas_id:"canvas"});	
	app.start();

	document.addEventListener("keydown", function(e){app.keydown_callback(e.keyCode)}, false);
	document.addEventListener("keyup", function(e){app.keyup_callback(e.keyCode)}, false);	
};